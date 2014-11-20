define(function(require,exports,module){
	var BtValidate=require("../util/validate.js"),
	     Area=require("./areaselect.js"),
	     BLUIDialog=require("../blui/ui-dialog.js");
		
		//发票
	    var invoiceInfo= $("#invoice-info"),
	    	invoiceInfoarry=[];	  
	    //获取已选中的发票信息
		$.ajax({
			url:"/order/get_selinvoice",
			type:"post",
			dataType:"json",   
			success:function(data){     
				if(data.success==1){
					invoiceInfoarry=data.invoiceInfo[0];  					
					$("#invoice-info").html(template('invoice-info-template',{list:invoiceInfoarry})).removeClass("loading");
				}else if(data.success==2){
					$("#invoice-info").html(template('invoice-infolist-template',{list:data.invoiceInfo})).removeClass("loading");
				}
				else{
					$("#invoice-info").html(template('invoice-infolist-template',{list:null})).removeClass("loading");
				}				
			},
			error:function(){			
				$("#invoice-info").html(template('invoice-info-template',{list:null})).removeClass("loading");    
			}  			
		});		
		
		$("#invoice-info").delegate('#invoice-radio-new','change',function(){   
			if($(this).prop("checked")){
				$("#invoice-form-box").html(template("invoice-form-template",{list:null}));
			}  
		}).delegate(".invoice-editor-a",'click',function(){
			$.ajax({
				url:"/order/get_invoice_list",
				type:"post",
				dataType:"json",   
				success:function(data){     
					invoiceInfoarry=data.invoiceInfo;  
					if(invoiceInfoarry.length>0){				
						$("#invoice-info").html(template('invoice-infolist-template',{list:invoiceInfoarry})).removeClass("loading");
					}
					else{  
						$("#invoice-info").html(template('invoice-info-template',{list:null})).removeClass("loading");
					}
				},  
				error:function(){			
					$("#invoice-info").html(template('invoice-info-template',{list:null})).removeClass("loading");    
				}  			
			}); 
		}).delegate(".invoice-d-editor-a",'click',function(){
			$("#invoice-form-box").html(template("invoice-form-template",{list:invoiceInfoarry[$(this).attr("data-id")]}));
		}).delegate(".invoice-d-del-a",'click',function(){
			var id=$(this).attr("data-id");
			$.ajax({
				url:"/order/delinvoice",  
				type:"post",
				data:{id:id},
				dataType:"json",   
				success:function(data){     
					invoiceInfoarry=data.invoiceInfo;  
					if(invoiceInfoarry.length>0){				
						$("#invoice-info").html(template('invoice-infolist-template',{list:invoiceInfoarry})).removeClass("loading");
					}
					else{  
						$("#invoice-info").html(template('invoice-infolist-template',{list:null})).removeClass("loading");
					}  
				},  
				error:function(){			
					$("#invoice-info").html(template('invoice-info-template',{list:null})).removeClass("loading");    
				}  			
			});
		}).delegate("[name=invoice]","change",function(){			
			if($(this).prop("checked")){   
				$(".invoice-item").removeClass("invoice-item-current");
				$(this).parent().addClass("invoice-item-current");
			}
		});		
		
		$("#invoice-info").delegate(".invoice-editor",'click',function(){
			 $("#invoice-info").html(template('invoice-form-template',{list:invoiceInfoarry}))    
		}).delegate('.invoice-form-submit,.invoice-save-a','click',function(){
			var form=$("#invoice-form"); 
			if(form.length>0){
			var invoiceheader=$("input[name=invoiceheader]:checked").val(),    
				error="请输入个人姓名，不超过20个字符",len=20,
				flag=0;
			
			var headerInfo=$("input[name=headerinfo]");
			var errortag=$("."+headerInfo.attr("data-error"));
			if($.trim(headerInfo.val())==""){  
				errortag.html(error).show();    
				flag++;
			}else if($.trim(headerInfo.val()).length>len){
				errortag.html(error).show();   
				flag++;
			}else{
				errortag.hide();     
			}
			if(flag==0){				 			
					$.ajax({
						url:form.attr("action"),
						type:form.attr("method"),
						dataType:"json",
						data:form.serialize(),  
						beforeSend:function(){
							consigneesType=true;
						},
						success:function(data){ 
							if(data.success==1){   
								$("#invoice-info").html(template('invoice-info-template',{list:data.invoiceInfo[0]}))  								
							}else if(data.success==-1){								
							} else{								
							} 
						},  
						error:function(){
							showError(invoiceTab,"系统异常");
						}
					}) 
				}	
			}else{
				var id=$("[name=invoice]:checked").attr("data-id");
				$.ajax({
					url:"/order/setInvoiceSel",
					type:"post",
					data:{id:id},
					dataType:"json",
					success:function(data){
						if(data.success==1){
							$("#invoice-info").html(template('invoice-info-template',{list:data.invoiceInfo[0]})).removeClass("loading"); 
						}
					}
				})
			}
		}).delegate("[data-name]",'click',function(){
			var name=$(this).attr("data-name");
			$("input[name=]"+name).click();  
		}).delegate('input[name=headerinfo]','click',function(){
			 $("."+$(this).attr("data-dtag")).hide();   
		}).delegate('input[name=headerinfo]','blur',function(){
			if($.trim($(this).val())==""){
				$("."+$(this).attr("data-dtag")).show();     
			}
		}) 		
		
		//收件人信息			
		var consigneesList=[],
		    addressList=$("#address-list"),
			area=Area();
		//初始化
		$.ajax({
			url:"/order/get_selposter",
			type:"post",
			dataType:"json",
			success:function(data){			
				if(data.success==1){								
					addressList.html(template('address-info-template',{list:data.poster[0]})).removeClass("loading");
				}else if(data.success==2){				
					addressList.html(template('address-list-template',{list:data.poster})).removeClass("loading");
				}
			},
			error:function(){				
				addressList.html(template('address-info-template',{list:null})).removeClass("loading");  
			}    
		})
		
		//区域初始化
		area.provincialinit(function(data){ 
			provincialarry=data;			
		});   
		
		function areafun(){			
			var pselect=cselect=stown="请选择",
			regionPath=[];
		
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
		
		addressList.delegate('.address-d-editor-a','click',function(){	
			var thisAddress=consigneesList[$(this).attr("data-id")];
			var tel=thisAddress.tel;  
			if(tel){
				var telarray = tel.split("-");
				thisAddress.qh=telarray[0];
				thisAddress.hm=telarray[1];
				thisAddress.fj=telarray[2]||""
			}	
			$("#address-form-box").html(template("address-form-template",{list:thisAddress}));  
			areafun();
			
		}).delegate("#address-radio-new","change",function(){
			$("#address-form-box").html(template('address-form-template',{list:null})); 
			areafun();
		}).delegate(".address-editor-a",'click',function(){
			$.ajax({
				url:"/order/get_poster_list",  
				type:"post",
				dataType:"json",
				success:function(data){			
					if(data.success==1){	
						consigneesList=data.poster;
						addressList.html(template('address-list-template',{list:data.poster})).removeClass("loading");
					}  
				},
				error:function(){				
					addressList.html(template('address-info-template',{list:null})).removeClass("loading");  
				}    
			})
		}).delegate(".address-d-del-a",'click',function(){			
			var id=$(this).attr("data-id");
			$.ajax({
				url:"/order/delposter",  
				type:"post",
				data:{id:id},  
				dataType:"json",
				success:function(data){			
					if(data.success==1){								
						addressList.html(template('address-list-template',{list:data.poster})).removeClass("loading");
					}  
				},  
				error:function(){				
					addressList.html(template('address-info-template',{list:null})).removeClass("loading");  
				}    
			})   
		});   
		
		var btValidate= BtValidate("#address-list",{  
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
		addressList.delegate(".address-submit-btn",'click',function(){ 
			var consigneesType=false,
			     form=$("#address-form-cont"),
			     flag=0;  
			if(form.length>0){
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
					 if(telephoneqh.val()!=""&&!btValidate.validateRules.isTepqh(telephoneqh.val())){
						 btValidate.showError(telephoneqh,btValidate._options.msg.telephoneqh.isTepqh);
						 flag++; 
					 }
					if(telephonedhhm.val()!=""&&!btValidate.validateRules.isTepnum(telephonedhhm.val())){
						btValidate.showError(telephonedhhm,btValidate._options.msg.telephonedhhm.isTepnum);  
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
						$("#regionPath").val(province.val()+"-"+city.val()+"-"+town.val());    
						$.ajax({
							url:form.attr("action"),
							type:form.attr("method"),
							dataType:"json",
							data:form.serialize(),
							beforeSend:function(){
								consigneesType=true;
							},
							success:function(data){  						
								consigneesType=false;  
								if(data.success==1){
									consigneesList=data.poster;  	  						
									addressList.html(template('address-info-template',{list:data.poster[0]})).removeClass("loading");								
								}else if(data.success==-1){  
									
								}else{
									
								}	  
							},  
							error:function(){
								consigneesType=false;
								showError(addressTab,"系统异常");  
							}
						})
					} 
				} 
			}else if($("[name=address]:checked").length>0){		   		
				
				var id=$("[name=address]:checked").attr("data-id");
				$.ajax({
					url:"/order/setposter",
					type:"post",
					data:{id:id},
					dataType:"json",
					success:function(data){
						if(data.success==1){
							addressList.html(template('address-info-template',{list:data.poster[0]})).removeClass("loading");
						}
					}
				})  
			}
		});
		
		function showError(context,msg){
			context.addClass("blz-tab-error").find(".error-tip").html(msg).show();
		}
		
		function hideError(context){
			context.removeClass("blz-tab-error").find(".error-tip").hide();
		}
		
		$(".blz-tabSub-btn").click(function(){
			var pId=$("#selPosterId").val(),
				iId=$("#selInvoceId").val();			
			if(pId&&iId){
				$.ajax({
					url:"/biz_patapply_postorder",
					type:"post",
					data:{r:$("#postid").val(),iId:iId,pId:pId},
					success:function(data){
						var result=$.parseJSON(data);
						if(result.success=="1"){
							location.href=location.origin+"/biz_patapply_pay_"+result.orderNo;
						}
					}
				})
			}			
		})
})