define(function(require,exports,module){
	var helpCont='<div class="case-help-cont dn">'+  
		'<div class="case-help-triangleup">' +	
		'<em></em>' +
		'<span></span>'+
		"</div>"+		
		'<p class="case-help-info"></p>'+
		'</div>',helptimeout;	
	
    $("body").append(helpCont); 
    
    function Tip(target){
    	return Tip.prototype.init(target);
    }   
    
    Tip.prototype.init=function(target){   
    	var that=this;
    	$(target).hover(function(){
    		var offset=$(this).offset(),
    			help=$(this).attr("data-help");
    		clearTimeout(helptimeout);
    		helptimeout=setTimeout(function(){
    			that.html(help);
    			that.show(offset.left-22,offset.top-$(".case-help-cont").height()-18)   
    		},200); 
    	},function(){helptimeout=setTimeout(function(){$(".case-help-cont").hide();},200);    
    	}) 
    	return this;
    }
    
    Tip.prototype.html=function(str){
    	$(".case-help-info").html(str);
    	return this;
    }
    Tip.prototype.show=function(left,top){    	 	
    	$(".case-help-cont").css({left:left,top:top}).show();  
    	return this;
    }
    
	$("body").delegate(".case-help-cont","mouseenter",
			function(){    
			clearTimeout(helptimeout);		
	})   
	.delegate(".case-help-cont","mouseleave",function(){
			helptimeout=setTimeout(function(){$(".case-help-cont").hide();},200)
	})   
	module.exports=Tip;
})