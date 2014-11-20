define(function(require,exports,module){
	var BLUIDialog=require("../blui/ui-dialog.js"),
		check=require("../util/check");		
	
	var id,thisele,bluidialog;
	$(".cart-del").click(function(){
		id=$(this).attr("data-id");
		thisele=$(this).parent().parent();
		  bluidialog = new BLUIDialog({  
				width:325,     
				height:200
			}).open("<div class='cart-del-cont font-yahei'>您确定删除该专利申请吗？</div>"+
				"<div><a class='del-confir'>确定</a><a class='del-cancle'>取消</a></div>",function(t){  
				$("body").delegate(".modal-f-cancelBtn,.del-cancle", "click", function () {
					t.close();
	  	        });					  
			});			 
	})
	
	$("body").delegate(".del-confir",'click',function(){			
		$.ajax({
			url:"/biz_patapply_delapply",
			type:"post",
			data:{id:id},
			success:function(data){
				thisele.remove(); 
				resettotal();
				bluidialog.close();
			}
		})
	})
	
	check(resettotal)	
	//重置合计
	function resettotal(){
		$("#checkednum").html($("input[name=checkitem]:checked").length);
		var totalrmb=0;		
		$("input[name=checkitem]:checked").each(function(){			
			totalrmb=parseInt(totalrmb)+parseInt($(this).attr("data-fee"));			
		})
		$("#totalrmb").html(totalrmb);	
	}
	
	$(".blz-tabSub-btn").click(function(){
		var ids=""; 
		if(!$(this).hasClass("blz-btn-disabled")){			
			$("input[name=checkitem]:checked").each(function(){			
				ids+=$(this).attr("data-id")+",";	
			})
			 $.ajax({
				 url:"/biz_patapply_cartcache",
				 type:"post",
				 data:{ids:ids},
				 success:function(data){					 
					 var result=$.parseJSON(data);    
					 location.href="http://"+location.host+"/biz_patapply_confirmorder_"+result.r;    
				 }
			 })
			//location.href="http://"+location.host+"/biz_patapply_confirmorder_"+md5(ids);
		}

	})
})
