image-selecter
============

用于选择本地图片(支持手机摄像头拍照).不论是否横竖屏拍摄,最终得到的图片都会修正为正向图片,并缩放到指定大小,以方便后续操作使用.  


demo地址:http://shrek.imdevsh.com/demo/input/  


创建组件  
new ImgSlter(config);  
config.el  指定对象，可以直接指定一个已有input标签，如不填会默认自动创建一个input标签  
config.color  设置背景色，因为type默认是jpg，有时选择一些透明png，然后最后获取到得jpg会看到原来的透明部分变成了黑色（其实就是无色），为了避免这种状况，可以设置一个背景色（例如白色）。  
config.size  图片最大尺寸，不填则默认值为500px  
config.type  输出二进制流图片类型，默认值是jpeg  
config.quality  输出图片质量，当图片为jpeg时有效  
例如：var selecter = new ImgSlter({size:800, type:'png', quality:0.5});  


实例方法  
selecter.select()   开始选择图片，需要在click事件中调用。  
selecter.destroy()  销毁实例  
selecter.handler  注：此处是个变量。设置选择图片后的捕捉函数，传入唯一参数是一个toDataURL获得的图片二进制流。  




感谢soddy.gu，在他组件基础上整理封装的图片本地选取组件  
exif使用第三方组件，https://github.com/exif-js/exif-js  


欢迎研讨。QQ:274924021  



 * VERSION: 0.1.0
 * DATE: 2015-09-24
