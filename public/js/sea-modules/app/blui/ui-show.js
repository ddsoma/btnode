define(function(require,exports,module){
	
	var BLUIDialog = require("../blui/ui-dialog");
	var template = require("gallery/template/template.min.js");  
	
	//提示信息
	exports.show = function(message,id,callback){
		var templateId = "modal-message";
		var width = 510,height = 228;
		var mes = {mes:message,id:id};
		var html = template(templateId,mes);
		var bluidialog = new BLUIDialog({
				width:width,
				height:height
			}).open(html,function(t){
				if(typeof callback === "function"){
					callback(t);
				}
		});
	};
});