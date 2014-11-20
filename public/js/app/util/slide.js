/*滚动*/
define(function(require,exports,module){
	var Slide= {
	        //滑动函数—参数如下：
	        //b:滑动对象（选择器）
	        //sIndex:滑动元素的index
	        //speed:滑动的速度（毫秒）
	        //shake：滑入滑出振幅大小（px）
	        slideFunc: function (b, sIndex, speed, shake, module) {	         
	            b.eq(sIndex).siblings().animate({
	                opacity: 0.0,
	                left: '+=' + shake
	            }, speed, function () {
	                b.eq(sIndex).css({ display: "block", left: shake + "px", opacity: "100" });
	                if (Slide.hasSlide <= 0) {
	                   Slide.hasSlide += 1;
	                    b.eq(sIndex).animate({
	                        left: '-=' + shake
	                    }, speed, function () {
	                       Slide.hasAnimateEnd = 0;
	                       Slide.hasSlide = 0;
	                    });
	                }
	                b.eq(sIndex).siblings().css({ left: '0', display: 'none' });
	            });
	        },
	        //记录当前显示的是第几个块
	        i: 0,
	        //放置滑动动画重复执行的戳变量
	        hasAnimateEnd: 0,  
	        hasSlide: 0
	    }
	module.exports=Slide;
})   
