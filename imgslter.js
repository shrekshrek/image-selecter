/*!
 * VERSION: 0.1.0
 * DATE: 2015-09-24
 * GIT: https://github.com/shrekshrek/image-selecter
 * @author: Shrek.wang
 **/

(function (factory) {

    if (typeof define === 'function' && define.amd) {
        define(['exif', 'exports'], function (EXIF, exports) {
            window.ImgSlter = factory(exports, EXIF);
        });
    } else if (typeof exports !== 'undefined') {
        var EXIF = require('exif');
        factory(exports, EXIF);
    } else {
        window.ImgSlter = factory({}, window.EXIF);
    }

}(function (ImgSlter, EXIF) {

    function uaParser() {
        var u = navigator.userAgent;
        return {
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            iosv: u.substr(u.indexOf('iPhone OS') + 9, 3)
        };
    }

    ImgSlter = function () {
        this.initialize.apply(this, arguments);
    };

    ImgSlter.prototype = {
        initialize: function (config) {
            var _self = this;

            var _config = config || {};
            this.el = _config.el || function () {
                var input = document.createElement("INPUT");
                input.type = 'file';
                input.accept = 'image/png,image/jpeg,image/gif';
                input.capture = 'camera';
                return input;
            }();
            this.size = _config.size || 500;
            this.type = _config.type || 'jpeg';
            this.quality = _config.quality || 0.7;
            this.handler = _config.handler || function(){};

            this.ua = uaParser();
            this.cvs = document.createElement('canvas');
            this.ctx = this.cvs.getContext('2d');

            this._changeHandler = this._changeHandler.bind(this);
            this.el.addEventListener('change', this._changeHandler, false);

        },
        _changeHandler: function (evt) {
            var _self = this;

            var _file = evt.target.files[0];

            if (_file == undefined) return;

            var imgW, imgW2, tmpImgW;
            var imgH, imgH2, tmpImgH;

            window.URL = window.URL || window.webkitURL;
            var src = window.URL.createObjectURL(_file);

            var img = new Image();
            img.src = src;
            img.onload = function () {
                EXIF.getData(img, function () {
                    var Orientation = EXIF.getTag(this, 'Orientation') || 0;

                    imgW = img.width;
                    imgH = img.height;

                    if (imgW >= imgH) {
                        imgW2 = _self.size;
                        imgH2 = imgW2 * imgH / imgW;
                        tmpImgW = imgW;
                        tmpImgH = imgH;
                    } else {
                        imgH2 = _self.size;
                        imgW2 = imgH2 * imgW / imgH;
                        tmpImgW = imgH;
                        tmpImgH = imgW;
                    }

                    switch (Orientation) {
                        case 3:
                            _self.cvs.width = imgW2;
                            _self.cvs.height = imgH2;
                            _self.ctx.clearRect(0, 0, imgW2, imgH2);
                            _self.ctx.translate(imgW2 / 2, imgH2 / 2);
                            _self.ctx.rotate(180 * Math.PI / 180);
                            break;
                        case 6:
                            _self.cvs.width = imgH2;
                            _self.cvs.height = imgW2;
                            _self.ctx.clearRect(0, 0, imgH2, imgW2);
                            _self.ctx.translate(imgH2 / 2, imgW2 / 2);
                            _self.ctx.rotate(90 * Math.PI / 180);
                            break;
                        case 8:
                            _self.cvs.width = imgH2;
                            _self.cvs.height = imgW2;
                            _self.ctx.clearRect(0, 0, imgH2, imgW2);
                            _self.ctx.translate(imgH2 / 2, imgW2 / 2);
                            _self.ctx.rotate(270 * Math.PI / 180);
                            break;
                        default:
                            _self.cvs.width = imgW2;
                            _self.cvs.height = imgH2;
                            _self.ctx.clearRect(0, 0, imgW2, imgH2);
                            _self.ctx.translate(imgW2 / 2, imgH2 / 2);
                            break;
                    }

                    if (3260 < tmpImgW || tmpImgH > 2440) {
                        if (_self.ua.ios) {
                            if (parseInt(_self.ua.iosv) >= 8) {
                                _self.ctx.drawImage(img, 0, 0, imgW, imgH, -imgW2 / 2, -imgH2 / 2, imgW2, imgH2);
                            } else {
                                _self.ctx.drawImage(img, 0, 0, imgW / 2, imgH / 2, -imgW2 / 2, -imgH2 / 2, imgW2, imgH2);
                            }
                        } else {
                            _self.ctx.drawImage(img, 0, 0, imgW, imgH, -imgW2 / 2, -imgH2 / 2, imgW2, imgH2);
                        }
                    } else {
                        _self.ctx.drawImage(img, -imgW2 / 2, -imgH2 / 2, imgW2, imgH2);
                    }

                    _self.handler.call(this, {
                        img: _self.cvs.toDataURL('image/' + _self.type, _self.quality),
                        width: _self.cvs.width,
                        height: _self.cvs.height
                    });

                    window.URL.revokeObjectURL(_file);
                });
            };
        },
        select: function () {
            if (this.el) this.el.click();
        },
        destroy: function () {
            this.el.removeEventListener('change', this._changeHandler, false);
            delete this.ua;
            delete this.ctx;
            delete this.cvs;
            delete this.el;
        }
    };

    return ImgSlter;
}));
