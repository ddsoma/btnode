define(function(require,exports,module){
	var BtValidate=require("../util/validate.js"),
		Area=require("./areaselect.js"),
		BLUIDialog=require("../blui/ui-dialog.js");
	var bluidialog;
	 $(".addressee-h-addbtn").click(function(){  
		 consigneeDialog(null)
	  })
	
	function consigneeDialog(list){		 
		 var addressfHtml=template("address-form-template",{list:list});
		  var addressHtml=template("address-dialog-template",{addressfHtml:addressfHtml});	
	      bluidialog = new BLUIDialog({   
			width:600,
			height:550
		}).open(addressHtml,function(t){
			areafun();
			$("body").delegate(".modal-f-cancelBtn", "click", function () {
				t.close();
  	        });								   
		},{"formurl":"biz_patapply_patform"});
	}
	  
	var consigneesList=[],
	area=Area(),
	provincialarry=[],
	cityarry=[],
	townarry=[];
	
	//区域初始化
	area.provincialinit(function(data){ 
		provincialarry=data;			
	});   
	
	function areafun(){			
		var pselect=cselect=stown="请选择",
		regionPath=[];
	
		/*if(consigneesList&&consigneesList.area){ 
			regionPath=consigneesList.area.split("-"); 
			pselect=regionPath[0];
			cselect=regionPath[1];
			stown=regionPath[2];      
		}	*/				
		
		$("#province option").remove();	
		$("#province").append(template('area-template',{list:provincialarry})).val($("#province").attr("data-value"));
		
		if(	$("#city").attr("data-value")){
			area.cityinit(function(data){
				$("#city option").remove();     
				$("#city").append(template('area-city-template',{list:data})).val($("#city").attr("data-value"));				
				if($("#county").attr("data-value")){           
					area.towninit(cselect,function(data){    
						$("#county option").remove();  					
						$("#county").append(template('area-town-template',{list:data})).val($("#county").attr("data-value"));      
					});   
				}
			});
		}
	}
	var btValidate= BtValidate("#address-form-cont",{  
		rules:{
			addressee:{
				isNull:true,				
				isLength:function(t,str){
					return t.validateRules.betweenLength(str,1,20)
				}
			},
			detailaddress:{
				isNull:true,
				isLength:function(t,str){
					return t.validateRules.betweenLength(str,5,100)
				}
			},
			zipcode:{
				isNull:true,
				isLength:function(t,str){
					return t.validateRules.isLength(str,6)  
				},
				fullNumber:function(t,str){
					return t.validateRules.fullNumber(str)
				}
			}
		},
		msg:{
			addressee:{
				defaultm:'请输入收件人姓名，不超过20个字',
				isNull:"请输入收件人姓名",
				isLength:"格式不正确"
			},
			detailaddress:{        					
				defaultm:"请输入街道地址，最少5个字，最多不能超过100个字",
				isNull:"请输入街道地址，5-100个字",
				isLength:"请输入街道地址，5-100个字"  
			},
			mobile:{
				defaultm:"请输入收件人手机或电话",
				isNull:"请输入收件人手机", 
				isMobile: "请输入11位有效手机号"
			},				
			zipcode:{
				defaultm:"请输入6位邮政编码",   
				isNull:"请输入6位邮政编码",
				fullNumber:"格式不正确"        			
		     },	
			telephoneqh:{
				defaultm:"请输入收件人手机或电话",
				isTepqh:"请输入正确的区号"
			},
			telephonedhhm:{
				defaultm:"请输入收件人手机或电话",
				isTepnum:"请输入正确的电话号码"
			},
			telephonefj:{
				defaultm:"请输入收件人手机或电话",
				isTepfjnum:"请输入正确的分机号"
			}
		}
	}); 
	$("body").delegate(".address-submit-btn",'click',function(){      
		var consigneesType=false,
		     form=$("#address-form-cont"),
		     flag=0;  
		
		var mobile=$("input[name=mobile]"),
			mobileval=$.trim(mobile.val()), 
		    telephoneqh=$("input[name=telephoneqh]"),
		    telephonedhhm=$("input[name=telephonedhhm]"),
			telephonefj=$("input[name=telephonefj]"),
			province=$("#province"),
			city=$("#city"),
			town=$("#town");
		btValidate.hideError(mobile);
		btValidate.hideError(telephoneqh);  
		btValidate.hideError(telephonedhhm);    
		btValidate.hideError(telephonefj);   
		$(".address-error").hide(); 
		 
		 if(mobileval==""&&(telephoneqh.val()==""||telephonedhhm.val()=="")){
			 btValidate.showError(mobile,btValidate._options.msg.mobile.defaultm);  
			 flag++;
		 }else{
			if(mobileval!=""&&!btValidate.validateRules.isMobile(mobileval)){
				btValidate.showError(mobile,btValidate._options.msg.mobile.isMobile);
				flag++;  
			 }			 
			 if((telephoneqh.val()!=""&&!btValidate.validateRules.isTepqh(telephoneqh.val()))){
				 btValidate.showError(telephoneqh,btValidate._options.msg.telephoneqh.isTepqh);
				 flag++; 
			 }else if(telephoneqh.val()!=""&&telephonedhhm.val()==""){
				 btValidate.showError(telephonedhhm,btValidate._options.msg.telephonedhhm.isTepnum);  
					flag++;
			 }			 
			if((telephonedhhm.val()!=""&&!btValidate.validateRules.isTepnum(telephonedhhm.val()))){
				btValidate.showError(telephonedhhm,btValidate._options.msg.telephonedhhm.isTepnum);  
				flag++;  
			}else if(telephonedhhm.val()!=""&&telephoneqh.val()==""){
				 btValidate.showError(telephoneqh,btValidate._options.msg.telephoneqh.isTepqh);
				 flag++; 
			}
			if(telephonefj.val()!=""&&!btValidate.validateRules.isTepfjnum(telephonefj.val())){  
				btValidate.showError(telephonedhhm,btValidate._options.msg.telephonefj.isTepfjnum);    
				flag++;  
			}
		 } 			 		
		  
		 if(province.val()=="请选择"||city.val()=="请选择"||town.val()=="请选择"){
			 $(".address-error").html("请选择区域信息").show();
			 flag++;  
		 }			 
		 
		 if(btValidate.validateInit(btValidate.ipteles)>0||flag>0){ 		 		
		 }else{
			if(!consigneesType){
			/*	$("#regionPath").val(province.find("option:selected").text()+"-"+
						city.find("option:selected").text()+"-"+town.find("option:selected").text()); */      
				$.ajax({
					url:form.attr("action"),
					type:form.attr("method"),					
					data:form.serialize(),
					beforeSend:function(){
						consigneesType=true;
					},
					success:function(data){  						
						consigneesType=false;  
						if(data=="true"){
							//consigneesList=data.consigneeInfo[0];  							
							//$("#address-list").html(template('address-list-template',{list:data.consigneeInfo[0]}));
							//hideError(addressTab,data.msg);
							location.href=location.href;  
							   
						}else{  
							//showError(baseInfoTab,data.msg);
						}  
					},    
					error:function(){
						consigneesType=false;
						//showError(addressTab,"系统异常");  
					}
				})
			} 
		}  
	});
	
	function showError(context,msg){
		context.addClass("blz-tab-error").find(".error-tip").html(msg).show();
	}
	
	function hideError(context){
		context.removeClass("blz-tab-error").find(".error-tip").hide();
	}	
	
	 $("body").delegate(".consignee-del-btn","click",function(){
		 var id=$(this).attr("data-id");
		    bluidialog = new BLUIDialog({   
				width:500,
				height:200
			}).open(delwarn,function(t){
				$("body").delegate(".address-del-subbtn",'click',function(){
					$.ajax({
				 		url:"/uc/delconsignee",
				 		type:"post",
				 		data:{id:id},
				 		success:function(data){  
				 			if(data=="true"){
				 				location.href=location.href;
				 			}else{
				 				
				 			}
				 		}
				 	})
				})
				$("body").delegate(".modal-f-cancelBtn", "click", function () {
					t.close();
	  	        });								   
			},{"formurl":"biz_patapply_patform"});
	 })	  
	 
	 $("body").delegate(".consignee-edit-btn",'click',function(){		
		 consigneesList=$.parseJSON($(this).attr("data-consignee"));
		 var tel=consigneesList.tel;
		 if(tel){
			var telarray = tel.split("-");
			consigneesList.qh=telarray[0];
			consigneesList.hm=telarray[1];
			consigneesList.fj=telarray[2]||""
		 }		
		 consigneeDialog(consigneesList);
	 })  
	 
	var delwarn='<div style="margin-top: 40px;line-height: 40px;text-align:center;color:#565B5F;font-size:16px;">您确定要删除该收件信息吗？</div>'+	 
	   '<div>'+ 
		'<a class="dialog-confirm address-del-subbtn">确定</a>'+
		'<a class="dialog-cancle">取消</a>'
		'</div>';
	 
})