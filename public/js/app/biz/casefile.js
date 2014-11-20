define(function(require,exports,model){
	
	var h = require("../util/hover.js");
	require("$")
	
	
	exports.hover = function(){
		
		$("body").delegate(".g-body-t-item","mouseenter",function(){
			
			$(this).find(".disview").addClass("view").removeClass("disview");
			
		}).delegate(".g-body-t-item","mouseleave",function(){
			
			$(this).find(".view").addClass("disview").removeClass("view");
			
		});
		
		
		 
		
	
	}
	
})