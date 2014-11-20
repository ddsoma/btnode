define(function(require,exports,module){
	
	require("$");
	
	var pageIndexObj = $("#pageIndex"),
		fromObj = $("#searchForm"),
		pageCount = $.trim($(".paging-totalCount em").text()),
		numVal = /^\d{1,4}$/,
		pageBtn = $(".paging-num a,.paging-prev,.paging-next"),
		pageInputIndex = $(".paging-inputNum input"),
		UIDropdown = require("../blui/ui-dropdown");
	
	//分页
	exports.paging = function(){
		UIDropdown.dropdownList();
		pageBtn.click(function(){
			var pageIndex = $.trim($(this).attr("data-pageIndex"));
			var isDisable = $(this).hasClass("paging-disable") || $(this).hasClass("paging-n-current");
			if(!isDisable){
				pageIndexObj.val(pageIndex);
				fromObj.submit();
			}
		});
		
		pageInputIndex.bind("keypress",function(e){
			if(e.keyCode=="13"){
				var currentPageIndex = $.trim($(".paging-n-current").attr("data-pageIndex"));
				var thisVal = $.trim($(this).val());
				
				if(!numVal.test(thisVal)){
					alert("请输入数字");
					return false;
				}
				if(thisVal/1 < 1 || thisVal/1 > pageCount/1){
					alert("页码超出范围");
					return false;
				}
				if(currentPageIndex != thisVal){
					pageIndexObj.val(thisVal);
					fromObj.submit();
				}
			}
		});
		
		$(".paging a.d-m-item").click(function(){
	    	var thisVal = $.trim($(this).text());
	    	$(this).parents(".dropdown").find(".btn").html(thisVal+"<span class='caret'></span>");
	    	$("#pageSize").val(thisVal);
	    	pageIndexObj.val(1);
	    	fromObj.submit();
	    });
	};
});