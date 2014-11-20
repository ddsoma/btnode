define(function(require,exports,module){
	
	require("$");
	
	var body = $("body"),
		dropdownList = $(".dropdown ul"),
		selectCaret = "<span class='caret'></span>";
	
	//下拉通用事件
	exports.dropdownList = function(){
		
		body.delegate(".dropdown","click",function(event){
			var e = window.event || event;
		    if (e.stopPropagation) {
		        e.stopPropagation();
		    } else {
		        e.cancelBubble = true;
		    }
		    $(".open").removeClass("open");
		    $(this).toggleClass("open");
		    $(".f-select").css({"z-index":"2"});
		    if($(this).hasClass("open")){
		    	$(this).parents(".f-select").css({"z-index":"3"});
		    }else{
		    	$(this).parents(".f-select").css({"z-index":"2"});
		    }
		    if(event.target.className=="d-m-item"){
		    	$(".open").removeClass("open");
		    }
		});
		
		$(document).click(function (e) {
		    $(".open").removeClass("open");
		});
		
		dropdownList.find("li").click(function(){
			var currentObj = $(this).parents(".dropdown").find(".btn");
			var currentVal = $.trim($(this).find("a").text());
			currentObj.html(currentVal + selectCaret);
			var thisVal = $.trim($(this).find("a").attr("data-id"));
			var thisInputObj = $(this).parents(".dropdown").parent().find(".dropdown-input");
			if( thisVal!="" &&  thisInputObj.next().hasClass("error")){
				thisInputObj.next().remove();
			}
			thisInputObj.val(thisVal);
		});
	};
	
});