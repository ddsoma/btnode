define(function(require,exports,module){	
	
	var Biz = require("../biz/biz");
	
	exports.event = function (){
		var oSearchTxt = $("input[name=key]");
		var oSearch = $("#search")
		var oSform = $("#search-Form");
	    var oValue = oSearchTxt.val();
		var oLabtxt = $("#s-txt2");
		
		if(oValue != "")
			{
				oLabtxt.text("");
			}
		oSearchTxt.on({
			"focus" : function(){
				 
					oLabtxt.text("")
			 
			 },
			"blur" : function(){
				if($(this).val() == "")
				{
					oLabtxt.text("常见问题搜索")
				}
				
			}
		    
		})
		
		oSform.submit(function(){
			
			if(oSearchTxt.val() == 0)
				{
					
					alert("请输入关键词");
					oSearchTxt.focus();				
					return false;
				}
			if(oSearchTxt.val() > 0)
				{					
					oLabtxt.text("")
					return true;
				}

		});
		
	 
		 
		
		//回到顶部等
		var str=$('<div class="m-faqservice"><div class="faq"><div class="top"><a href="javascript:void(0)">回到顶部</a></div><div class="qq"><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1527336682&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:1527336682:53" alt="点击这里给我发消息" title="点击这里给我发消息"/></a></div><div class="fb"><a href="">在线反馈</a></div><div class="mb"><a href="">电话号码</a></div></div></div>')
		str.appendTo('body');
		fnBackTop($(".top"));
		//fn回调函数
	    function fnBackTop(obj){
	        obj.css('display','none');
	        $(window).bind('scroll',function(){
	            var _oWinScrollTop= $(window).scrollTop();
	            if(_oWinScrollTop == 0)
	            {
	                obj.fadeOut();
	            }
	            if(_oWinScrollTop > 0)
	            {
	                obj.fadeIn();
	            }
	        });
	        obj.bind('click',function(){
	            $(window).scrollTop(0);
	        })
	    };
    	
	}
	
});	
	
