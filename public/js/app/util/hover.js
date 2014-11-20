define(function(require,exports,module){
	function hover(item,selecated,callback){
		$("body").delegate(item,"mouseenter",function(){
			if(!$(this).hasClass(selecated)){	
				$(this).addClass(selecated);
			}		
			if(typeof callback=="function"){
				callback();
			}
		}).delegate(item,"mouseleave",function(){
			$(this).removeClass(selecated);  
		});
	}
	module.exports=hover;
})