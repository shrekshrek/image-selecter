/*!
 * GIT: https://github.com/shrekshrek/image-selecter
 **/

(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        var EXIF = require('exif');
        module.exports = factory(EXIF);
    } else if (typeof define === 'function' && define.amd) {
        define(['exif'], factory);
    } else {
        global.ImgSlter = factory(global.EXIF);
    }
}(this, (function (EXIF) {
    'use strict';

    var ua = function () {
        var u = navigator.userAgent;
        return {
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            iosv: u.substr(u.indexOf('iPhone OS') + 9, 3)
        };
    }();

    var ImgSlter = function () {
        this.initialize.apply(this, arguments);
    };

    ImgSlter.prototype = {
        initialize: function (config) {
            var _config = config || {};
            this.el = _config.el || function () {
                var input = document.createElement("INPUT");
                input.type = 'file';
                input.accept = 'image/*';
                // input.accept = 'image/png,image/jpeg,image/gif';
                // input.capture = 'camera';
                input.multiple = false;
                return input;
            }();
            this.size = _config.size || 500;
            this.type = _config.type || 'jpeg';
            this.quality = _config.quality || 0.7;
            this.handler = _config.handler || function () {
            };
            this.color = _config.color;

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

                    var _w, _h, _r;
                    switch (Orientation) {
                        case 3:
                            _w = imgW2;
                            _h = imgH2;
                            _r = 180;
                            break;
                        case 6:
                            _w = imgH2;
                            _h = imgW2;
                            _r = 90;
                            break;
                        case 8:
                            _w = imgH2;
                            _h = imgW2;
                            _r = 270;
                            break;
                        default:
                            _w = imgW2;
                            _h = imgH2;
                            _r = 0;
                            break;
                    }

                    _self.cvs.width = _w;
                    _self.cvs.height = _h;
                    _self.ctx.clearRect(0, 0, _w, _h);

                    if (_self.color) {
                        _self.ctx.fillStyle = _self.color;
                        _self.ctx.fillRect(0, 0, _w, _h);
                    }

                    _self.ctx.translate(_w / 2, _h / 2);
                    _self.ctx.rotate(_r * Math.PI / 180);

                    if (3260 < tmpImgW || tmpImgH > 2440) {
                        if (ua.ios) {
                            if (parseInt(ua.iosv) >= 8) {
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
            delete this.ctx;
            delete this.cvs;
            delete this.el;
        }
    };

    return ImgSlter;

})));
