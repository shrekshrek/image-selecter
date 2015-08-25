/*!
 * VERSION: 0.1.0
 * DATE: 2015-09-24
 * GIT:https://github.com/shrekshrek/image-uploader
 *
 * @author: Shrek.wang, shrekshrek@gmail.com
 **/

(function(factory) {

    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exif', 'exports'], function(EXIF, exports) {
            root.ImgSlter = factory(root, exports, EXIF);
        });
    } else if (typeof exports !== 'undefined') {
        var EXIF = require('exif');
        factory(root, exports, EXIF);
    } else {
        root.ImgSlter = factory(root, {}, root.EXIF);
    }

}(function(root, ImgSlter, EXIF) {

    function uaParser(){
        var u = navigator.userAgent;
        return {
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            iosv: u.substr(u.indexOf('iPhone OS') + 9, 3)
        };
    }

    function extend(obj, obj2) {
        for (var prop in obj2) {
            obj[prop] = obj2[prop];
        }
    }

    function getElement(target){
        if(!target) throw "target is undefined, can't tween!!!";

        if(typeof(target) == 'string'){
            return (typeof(document) === 'undefined') ? target : (document.querySelectorAll ? document.querySelectorAll(target) : document.getElementById((target.charAt(0) === '#') ? target.substr(1) : target));
        }else{
            return target;
        }
    }

    ImgSlter = function() {
        this.init.apply(this, arguments);
    };

    extend(ImgSlter.prototype, {
        init: function(config){
            var _config = config || {};
            this.el = _config.el?getElement(_config.el)[0]:function(){
                var input = document.createElement("INPUT");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.setAttribute("capture", "camera");
                return input;
            }();
            this.size = _config.size || 500;
            this.type = _config.type || 'jpeg';
            this.quality = _config.quality || 0.7;

            this.ua = uaParser();
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');

            this.el.addEventListener('change', this.change.bind(this), false);

        },
        change: function(evt){
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
                EXIF.getData(img, function(){
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

                    switch(Orientation){
                        case 3:
                            _self.canvas.width = imgW2;
                            _self.canvas.height = imgH2;
                            _self.ctx.clearRect(0, 0, imgW2, imgH2);
                            _self.ctx.translate(imgW2/2, imgH2/2);
                            _self.ctx.rotate(180 * Math.PI / 180);
                            break;
                        case 6:
                            _self.canvas.width = imgH2;
                            _self.canvas.height = imgW2;
                            _self.ctx.clearRect(0, 0, imgH2, imgW2);
                            _self.ctx.translate(imgH2/2, imgW2/2);
                            _self.ctx.rotate(90 * Math.PI / 180);
                            break;
                        case 8:
                            _self.canvas.width = imgH2;
                            _self.canvas.height = imgW2;
                            _self.ctx.clearRect(0, 0, imgH2, imgW2);
                            _self.ctx.translate(imgH2/2, imgW2/2);
                            _self.ctx.rotate(270 * Math.PI / 180);
                            break;
                        default:
                            _self.canvas.width = imgW2;
                            _self.canvas.height = imgH2;
                            _self.ctx.clearRect(0, 0, imgW2, imgH2);
                            _self.ctx.translate(imgW2/2, imgH2/2);
                            break;
                    }

                    if (3260 < tmpImgW || tmpImgH > 2440) {
                        if (_self.ua.ios) {
                            if (parseInt(_self.ua.iosv) == 8) {
                                _self.ctx.drawImage(img, 0, 0, imgW, imgH, -imgW2 / 2, -imgH2 / 2, imgW2, imgH2);
                            } else {
                                _self.ctx.drawImage(img, 0, 0, imgW / 2, imgH / 2, -imgW2 / 2, -imgH2 / 2, imgW2, imgH2);
                            }
                        }else{
                            _self.ctx.drawImage(img, 0, 0, imgW, imgH, -imgW2 / 2, -imgH2 / 2, imgW2, imgH2);
                        }
                    } else {
                        _self.ctx.drawImage(img, -imgW2/2, -imgH2/2, imgW2, imgH2);
                    }

                    if(_self.completeHandler)
                        _self.completeHandler.call(this, _self.canvas.toDataURL('image/' + _self.type, _self.quality));
                });
            };
        },
        handler: function(handler) {
            this.completeHandler = handler;
        },
        select: function(){
            this.el.click();
        },
        destroy: function(){
            this.el.removeEventListener('change', this.change, false);
            delete this;
        }
    });

    return ImgSlter;
}));
