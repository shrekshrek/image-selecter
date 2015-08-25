image-selecter
============

感谢soddy.gu，在他组件基础上整理封装的图片上传组件  
exif使用第三方组件，https://github.com/exif-js/exif-js  



创建组件  
var selecter = new ImgSlter(config);  
config.el  指定对象，可以直接指定一个已有input标签，如不填会默认自动创建一个input标签  
config.size  图片最大尺寸，不填则默认值为500px  
config.type  输出二进制流图片类型，默认值是jpeg  
config.quality  输出图片质量，当图片为jpeg时有效  


实例方法  
selecter.select()   开始选择图片，需要在click事件中调用。  
selecter.handler()  设置选择图片后的捕捉函数，传入唯一参数是一个toDataURL获得的图片二进制流。  
selecter.destroy()  销毁实例  


欢迎研讨。QQ:274924021  



 * VERSION: 0.1.0
 * DATE: 2015-09-24
