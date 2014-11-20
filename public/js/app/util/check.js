define(function(require,exports,module){
		
	require("$");    
	function check(callback){  
		$("input[name=checkall]").change(function(){
			$("input[name=checkitem]").prop("checked",$(this).prop("checked"));	
			$("input[name=checkall]").prop("checked",$(this).prop("checked"));  
			btndisable();
			if(typeof callback=="function"){
				callback();
			}
		});
		
		$("input[name=checkitem]").change(function(){  
			var checked=$("input[name=checkitem]").length==$("input[name=checkitem]:checked")?true:false;
			$("input[name=checkall]").prop("checked",checked);	
			btndisable();
			if(typeof callback=="function"){
				callback();
			}
		})
	}
	
	function btndisable(){
		var chkitemlen=$("input[name=checkitem]:checked").length;  
		if(chkitemlen==0){
			$(".blz-tabSub-btn").addClass("blz-btn-disabled");
		}else{
			$(".blz-tabSub-btn").removeClass("blz-btn-disabled");  
		}
	}
	
	module.exports=check;
})