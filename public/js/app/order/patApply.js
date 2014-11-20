define(function(require,exports,module){
	require("$");  
	var BLUIDialog=require("../blui/ui-dialog.js");  	
	var template =require("../../tpl/patent");     
	var select=require("../util/select.js");
	
	select();
	function Apply(pattype){	
		return new Apply.prototype.init(pattype);
	}
	
	Apply.patenteeInitList=[];  
	Apply.changepattentee=function(){  
		 $("#pattentee-cont").html(template('patentee',{list:Apply.patenteeInitList}));	        
	};
	Apply.contacterdata=[];
	Apply.changepatcontacter=function(data){
		 $("#patcontacter-cont").html(template('patcontacter',{list:Apply.contacterdata}));	        
	};	
	
	module.exports=Apply;  
	Apply.prototype={
		  init:function(pattype){			
			  Apply.pattype=pattype;
			  var that=this;
			  $(".ui-select-pattype").click(function(){
				  if(!$(this).hasClass("ui-selbtn-selected")){
					  that.changePattype($(this));
				  }
				  return false;
			  })
			  
			  $(".ui-select-slow").click(function(){
				  if(!$(this).hasClass("ui-selbtn-selected")){					  
					  that.changeSlow($(this));
				  }				  
				  return false;
			  })
		
				/*input默认信息显示与隐藏*/
				$("input[data-dtag]").focus(function(){   
					$("."+$(this).attr("data-dtag")).hide();
					$("."+$(this).attr("data-errortag")).hide();   
				}).blur(function(){
					if($.trim($(this).val())=="")
					$("."+$(this).attr("data-dtag")).show();
				});
				$(".pat-form-default").click(function(){
					var name=$(this).attr("data-name");
					if(name){
						$("input[name="+name+"]").focus();   
					}
				})
				  
				/*dropdown li hover*/
				var pattype="inpat";
				$(".ui-dropdown-menu").delegate('li','click',function(e){  
					var parent=$(this).parent(),  
					    type=parent.attr("data-type");				
					$(this).parents(".ui-dropdown").find(".ui-dropdown-title").html($(this).html());
					$(this).parents(".ui-dropdown").find(".ui-dropdown-menu").hide().next().val($(this).attr("data-value"))
					
					 if(type=="pattentee"){	
						that.patenteeChange($(this));	  
					 }  else if(type=="contacter") {  	
					    that.contacterId=$(this).attr("data-id");
						parent.parent().hide(); 
					}
					 
					e.stopPropagation();  
				})
				
				//费用减缓
				$("#retardchk").change(function(){		
					if(!$(this).prop("checked")){
						 that.scale=1;
					}
					else{
						that.setScale();  
					}				     
					that.changeOfficer($("#pattype").val());  
				});	
				
				//申请人添加
				$("#pattentee-cont").delegate('.patentee-add','click',function(e){
					var url ="/biz_public_editpatentee"
					    $("#pattentee-cont").hide(); 
						var width = 450,height = 410;
						var bluidialog = new BLUIDialog({   
								width:width,
								height:height
							}).openajax(url + "?t="+ new Date().getMilliseconds(),function(t){
								$("body").delegate(".modal-f-cancelBtn", "click", function () {
									t.close();
				      	        });								 
							},{"formurl":"biz_patapply_patform"});   
						e.stopPropagation();   
				});
				//联系人添加
				$("#patcontacter-cont").delegate('.patcontacter-add','click',function(){
					var url ="/biz_public_editcontact"
						var width = 450,height = 410;
						var bluidialog = new BLUIDialog({
								width:width,
								height:height
							}).openajax(url + "?t="+ new Date().getMilliseconds(),function(t){
								$("body").delegate(".modal-f-cancelBtn", "click", function () {
									t.close();
				      	        });							 
							},{"formurl":"biz_patapply_patform"});
				});
				
				//优先权
				$("#prioritychk").change(function(){
					var checked=$(this).prop("checked");
					that.prioritychecked=checked;
					that.changeOfficer(pattype); 
					if(checked){
						$(".priority-cont").show(); 
					}else{
						$(".priority-cont").hide();
					}
				});
				
				//申请人删除
				$("#patentee").delegate(".priority-del-icon",'click',function(e){
				  var delitem=that.patenteeSelectedList.splice($(this).attr("data-i"),1);
				  Apply.patenteeInitList.push(delitem[0]);     
				  that.patenteeChange(true);
				  e.stopPropagation();   
				})  
				
				//技术联系人
				$(".pat-contacter").click(function(e){
					var patcontacter=$("#patcontacter-cont");											
						if($(this).attr("data-type")=="others"){  
							that.contacterInit();						
							patcontacter.show();  
						}else{
							patcontacter.hide();  
						}
						$(".pat-contacter").removeClass("ui-selbtn-selected");
						$(this).addClass("ui-selbtn-selected")
									
					e.stopPropagation();   
				})  
				this.initForm().priorityChange();
		  },
		  
		  initForm:function(){
			  var type=$("#pattype").val();
			  this.changeOfficer(type);  
			  return this;
		  },
		  //重置表单
		  resetForm:function(){
			  var type=Apply.pattype;//添加时为inpat，修改的时候为获取hidden的值
			  //重置专利类型
			  $(".ui-select-pattype").removeClass("ui-selbtn-selected");
			 $("[data-pattype="+Apply.pattype+"]").addClass("ui-selbtn-selected")
			  $("#pattype").val(type);
			  
			  //重置专利名称
		
			  var patname= $("input[name=patName]");
			  patname.val("");
			  $("."+patname.attr("data-dtag")).show();
			  
			 $(".ui-dropdown-title").html("请选择")
			/*  //重置申请人
			  Apply.patenteeInitList=Apply.patenteeInitList.concat(this.patenteeSelectedList);			
			  this.patenteeSelectedList=[];
			  this.patenteeChange();*/
			  
			/*  //重置技术联系人
			  $("#self").prop("checked",true);  			
			  $("#patcontacter").hide();  */
			  	
			/*  //改变案件要求
			  this.changeCase(type);
			  this.changeretardchk(false);*/  
			  
		/*	  //优先权改变 
			  this.prioritylist=[];
			  $(".priority-cont").hide();     
			  $("#prioritychk").prop("checked",false);  */
			  
		  },	
		  fee:{//金额 需要后台读取读取
			inpat:{
				applyfee:{
					fee:900
				},
				substancefee:{
					fee:2500				
				},
				printfee:{
					fee:50
				},				
				agencyfee:{
					fee:4000
				} ,
				agencyoldpay:{
					fee:5000
				}
			},
			utpat:{
				applyfee:{
					fee:500
				},					
				agencyfee:{
					fee:1600  
				},
				agencyoldpay:{
					fee:2000
				}
			},
			apppat:{
				applyfee:{
					fee:500
				},
				agencyfee:{
					fee:600
				}  ,
				agencyoldpay:{
					fee:1000
				}
			},
			inupat:{
				applyfee:{
					fee:900
				},
				utapplyfee:{
					fee:500
				},
				substancefee:{
					fee:2500
				},
				printfee:{
					fee:50
				},			
				agencyfee:{
					fee:4000   
				},
				agencyoldpay:{
					fee:5000
				}
			}
		  },
		
		  //申请人初始化状态
		  patenteeInitType:false,
		  patenteeSelectedList:[],//添加
		 
		  prioritychecked:false,//优先权是否选中
		  prioritylist:[],//优先权项数据
		  scale:1,//减缓比例
		  
		  //专利类型
		  changePattype:function(_self){  			
			  var type=_self.attr("data-pattype"); 
			  $(".ui-select-pattype").removeClass("ui-selbtn-selected");
			  _self.addClass("ui-selbtn-selected");
			 
			  $("#pattype").val(type);   
			  this.changeOfficer(type);
		  },
		  
		  changeSlow:function(_self){  			
			  var type=_self.attr("data-slow"); 
			  $(".ui-select-slow").removeClass("ui-selbtn-selected");  
			  _self.addClass("ui-selbtn-selected");			 
			  if(type=="true"){
				  $("#patentee-li").show();
				  $(".patapply-warn").html("我们的客服将联系您处理减缓事宜")
			  }else{
				  $("#patentee-li").hide();
				  $(".patapply-warn").html("99%的客户选择了是，若选择否，国知局的费用很高哦！")
			  }
			  $("#slow").val(type);
		  },
		    
		  //申请人初始化
		  patenteeInit:function(){
			  var that=this,
			  		patenteecont= $("#pattentee-cont");
			  patenteecont.show().addClass("loading");
			  if(!that.patenteeInitType){  
				  $.ajax({
					  url:"/biz_getpatentee",
					  type:"post",
					  dataType:"json",
					  success:function(data){
						  var patenteeInfos=data&&data[0]&&data[0].infos;						  
						  if(patenteeInfos){
							  Apply.patenteeInitList= Apply.patenteeInitList.concat(patenteeInfos);
						  }
						  that.patenteeInitType=true;
						  patenteecont.html(template('patentee',{list:Apply.patenteeInitList})).removeClass("loading");	    
					  }
				  })
			  }   
		  },
		  //申请人变化
		  patenteeChange:function(t){  
			$("#pattentee-title").html(t.html());
			this.scale=t.attr("data-scale");
			this.changeOfficer($("#pattype").val());
			t.parent().parent().hide();
		  },		  
		  contacterSelect:"",		 
		  contacterInitType:false,		
		  //联系人初始化
		  contacterInit:function(){
			  var that=this,
		  	       patcontacter= $("#patcontacter-cont");
			  patcontacter.show().addClass("loading");
			  if(!that.contacterInitType){
				  $.ajax({
					  url:"/biz_getcontacter",
					  type:"post",
					  dataType:"json",    
					  success:function(data){
						  var contacterInfos=data&&data[0]&&data[0].infos;  						 
						  that.contacterInitType=true;  
						  Apply.contacterdata= Apply.contacterdata.concat(contacterInfos);	 	  				 
						  patcontacter.html(template('patcontacter',{list:Apply.contacterdata})).removeClass("loading");	
					  }
				  })
			  }
		  }, 
		  //联系人改变
		  changeContacter:function(str){  
			  $("#others").html(str+"<i></i>");  
		  },
		  
		  //优先权
		  priorityChange:function(){
			  var that=this;
			  var priorityList= $("#priority-list"),
			  	priorityDate= $("input[name=priorityDate]"),
			  	prioritytxt=$(".priority-txt");
			  //添加优先权
			  $(".priority-addbtn").click(function(){
				  that.prioritylist.push({"patnum":prioritytxt.val(),"date":priorityDate.val()});  
				  priorityList.html(template('priorityList',{list:that.prioritylist}));   
				  priorityDate.val("");
				  prioritytxt.val("");
			  });
			  //删除优先权
			  $("#priority-list").delegate('.priority-del-icon','click',function(){
				  that.prioritylist.splice($(this).attr("data-i"),1);   
				  priorityList.html(template('priorityList',{list:that.prioritylist}));  
			  });
		  },
		/*  //改变案件要求
		  changeCase:function(type){			 
			  var pubchk= $("#pubchk"),
			  	  substancechk=$("#substancechk");
			  if(type!="inpat"&&type!="inupat"){
				  pubchk.hide().next().hide();    
				  substancechk.hide().next().hide();				  
			  }else{ 
				  pubchk.show().next().show();    
				  substancechk.show().next().show();   				  
			  }			  
			  return this;  
		  },*/
		  //费用减缓状态
		  changeretardchk:function(b){
			  var retardchk=$("#retardchk");
			  if(b){
				  retardchk.removeAttr("disabled").prop("checked",true);
			  }else{
				  retardchk.attr("disabled","disabled").prop("checked",false);
			  }
		  },
		  //设置减缓比例
		  setScale:function(){
			  var that=this,
		     	  patentslist=that.patenteeSelectedList,
		          patenteeListLen=patentslist.length;			
				  if(patenteeListLen==1){
						 if(patentslist[0].type==1){							 
							 that.scale=0.15;
							 that.changeretardchk(true);   
						 }else{
							 that.scale=0.3;
							 that.changeretardchk(true);
						 }
				   }else if(patenteeListLen>1){
						for(var i in patentslist){
							if(patentslist[i].type==1){
								 that.scale=0.3;
								 that.changeretardchk(true);
								 break;
						    }
						}
				   }else{
					 that.scale=1;
					 that.changeretardchk(false);  
				   }					  
			  that.changeOfficer($("#pattype").val());   
		  },
		  //计算官费与代理费
		  changeOfficer:function(type){
			  var pat=this.fee[type];			  
			  $("#patfee").html(template('patenteefee',{list:pat,prioritychecked:this.prioritychecked,type:type,    
				  scale:this.scale})); 			
			  $("#agencyfee").html(pat.agencyfee.fee); 
			  $("#agencyoldpay").html(pat.agencyoldpay.fee);
			  this.total(pat)    
			  return this;   
		  },
		  //总价
		  total:function(pat){
			  var fee=0,
			  	   scale=this.scale;
			  for(var i in pat){
				  if(i=="agencyoldpay"){      
					  continue;  
				  }  
				  if(i=="applyfee"||i=="substancefee"||i=="utapplyfee"){
					  fee+=pat[i].fee*scale;   
				  } else{
					  fee+=pat[i].fee;         
				  }
				  
			  }  
			  $("#total-fee").html(fee);
		  }
	}	
	Apply.prototype.init.prototype=Apply.prototype;
})
