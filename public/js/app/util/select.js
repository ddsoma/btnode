define(function(require,exports,module){	
	function select(callback){
	 	$("body").delegate(".ui-dropdown",'click',function(e){  
			$("."+$(this).attr("data-errortag")).hide();    
			$(".ui-dropdown-menu").hide();	
			$(this).find(".ui-dropdown-menu").show();
			e.stopPropagation();      
		})	
		$("body").not(".ui-dropdown").click(function(e){
			$(".ui-dropdown-menu").hide();
		}) 
				
		$("body").delegate(".ui-dropdown-menu li"," mouseenter",function(){  
			$(this).addClass("hover") 
		}).delegate(".ui-dropdown-menu li","mouseleave",function(){
			$(this).removeClass("hover")
		}).delegate(".ui-dropdown-menu li",'click',function(){
			console.log(1)   
			$(this).parent().parent().parent().find(".ui-dropdown-title").html($(this).html());
		})	
	}         
	module.exports=select;     
})