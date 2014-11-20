define(function(require,exports,module){
	
	require("$");  
	var template = require("template");
	var taskTemplateId = "task-template";
	var patentTemplateId = "patent-template";
	var personTemplateId = "person-template";
	var taskUrl = "/biz_mytask_task";
	var patentUrl = "/biz_mytask_patent";
	var personUrl = "/biz_mytask_person";
	var taskType = "dlr_bz";
	
	exports.hover = function(className){
		$("." + className).hover(function(){
			$(this).addClass("selected");
		},function(){
			$(this).removeClass("selected");
		});
	};
	
	//显示任务
	exports.showTask = function(showId){
		var taskObj = $("#" + showId);
		taskObj.addClass("loading");	
		$.post(taskUrl + "?t=" + new Date().getMilliseconds(),{type:taskType},function(task){
			var json = eval("("+task+")");
			$("#" + showId).html(template(taskTemplateId,json));
			taskObj.removeClass("loading");
		});
	};
	//显示专利相关信息
	exports.showPatent = function(showId,type,callback){
		var patentObj = $("#" + showId);
		patentObj.addClass("loading");
		$.post(patentUrl + "?t=" + new Date().getMilliseconds(),{type:type},function(patent){
			var patent = eval("(" + patent + ")");
			$("#" + showId).html(template(patentTemplateId,patent));
			patentObj.removeClass("loading");
			if(typeof callback === 'function'){
				callback();
			}
		});
	};
	//显示技术联系人或代理人详细信息
	exports.showPerson = function(showId,type){
		var personObj = $("#" + showId);
		var top = personObj.offset().top;
		var left = personObj.offset().left;
		var id = personObj.attr("data-id");
		var json = "{type:'loading',left:'"+(left-55)+"px',top:'"+(top/1+30)+"px'}";
		positionPerson(showId,json);
		
		$.post(personUrl + "?t=" + new Date().getMilliseconds(),{type:type,id:id},function(result){
			var json = result.substring(0,result.length - 1) + ",left:'" + (left-55) + "px',top:'" + (top/1+30) + "px'}";
			positionPerson(showId,json);
		});
	};
	//定位弹出层
	var positionPerson = function(showId,json){
		var body = $("body");
		var personHtml = template(personTemplateId,eval("(" + json + ")"));
		body.delegate("#"+ showId,"mouseover",function(){
			$(".person-body").remove();
			body.append(personHtml);
		});
		$(document).click(function(e){
			if($(e.target).hasClass("person-body") || $(e.target).parents(".person-body").length > 0){
				
			}else{
				$(".person-body").remove();
			}
		});
	};
})