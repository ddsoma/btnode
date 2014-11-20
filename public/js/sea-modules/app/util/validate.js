define(function(require,exports,module){
	require("$");
	require("$cookie")
	var validateRegExp={
		  num: "^([+-]?)\\d*\\.?\\d+$",
		    // 数字
		    num1: "^[1-9]\\d*|0$",
		    // 正数（正整数 + 0）
		    num2: "^-[1-9]\\d*|0$",
		    // 负数（负整数 + 0）	 
		    email: "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$",
		    // 邮件
		    mobile: "^0?(13|15|18|14|17)[0-9]{9}$",
		    // 手机
		    notempty: "^\\S+$",
		    // 非空
		    password: "^.*[A-Za-z0-9\\w_-]+.*$",
		    // 密码
		    fullNumber: "^[0-9]+$",
		    // 数字		  
		    qq: "^[1-9]*[1-9][0-9]*$",		
		    //邀请码
		    invitationCode:"(^[a-zA-Z0-9]{6}$)",		    
		    // 户名
		    userName: "^[A-Za-z]+?[A-Za-z0-9_-]*$",
		    //区号
		    tepqh:"^[0-9]{3,6}$",
		    //电话号码
		    tepnum:"^[0-9]{7,10}$",
		    //分机
		    tepfjnum:"^[0-9]{3,6}$"      
		    
	};
	
	function BtValidate(ele,options,defaultoptions){
		return new BtValidate.prototype.init(ele,options,defaultoptions);		
	}
	
	BtValidate.prototype={
		init:function(ele,options,defaultoptions){	
			
			if(typeof ele!=="string")
				return this;
			if(typeof options!=="object")
				return this;
			
			var formele=$(ele),
			     ipteles=[],
			 	 that=this;
			this.form=formele;
			this._options=options;
			this._showDefault=defaultoptions&&defaultoptions.showDefault||false;
			this.success=options.success;
			
			for(var i in options.rules){
				ipteles.push(i);			    
				(function(i){		
					var inputele="input[name="+i+"]";
					if(that._showDefault){//默认提示显示下的验证
						 formele.delegate(inputele,"blur",function(){								
						    	if($(this).val()!=""){							    		
						    		that.validateInit(i);	
						    	}else{
						    	   that.showDefault($(this),i);
						    	}				    	 
						    }).delegate(inputele,"keyup",function(){
						    	if($(this).val()!=""){
						    		 that.hideDefault($(this),i);	
						    	}else{
						    		  that.showDefault($(this),i);
						    	}						    						    	
						    }).delegate(inputele,"keydown",function(){						    	
						    	that.hideDefault($(this),i);
						    }).delegate(inputele,'focus',function(){
						    	that.hideError($(this)); 
						    })
					}else{//默认提示不现实下的验证
						  formele.delegate("input[name="+i+"]",'focus',function(){	
						    	that.showDefault($(this),i);				    	
						    	if(i=="password"){
						    		$(".pwStrong").hide(); 						    		
						    	}
						    	that.hasValidate=false; 
						    }).delegate("input[name="+i+"]","blur",function(){					    	
						    	if($(this).val()!=""){
						    		that.validateInit(i);	
						    	}else{
						    	   that.hideDefault($(this),i);
						    	}
						    })						 
						    if(i=="userName"||i=="email"||i=="phoneCode"||i=="emailCode"||i=="oldPassword"){  
						    	formele.delegate("input[name="+i+"]","change",function(){
							    		that[i+"pending"]="default";						      
									    that.showDefault($(this),i);
							    })
						    }
						    
						    if(i=="phone"){
						    	 formele.delegate("input[name=phone]",'propertychange input',function(){
						    		 	if(that[i+"pending"]!="pending"){
							    			that[i+"pending"]="default";
							    		}
						    		 	if($(this).val().length==11){
								    		that.validateInit("phone");	
								    	}else{		
								    		that.hideSuccess($("input[name=phone]"));	
								    		$("#get-validatePhone").addClass("g-reg-vp-disabledBtn");
								    	}
								 })
						    }
						   
					}	
				})(i);
			}	
			that.ipteles=ipteles;
			$(ele).submit(function(e){	
				that.hasValidate=true;//是否已经全部验证
				formele.find("input[type=submit]").attr("disabled",true);  
				that.formsubmit(e);	
				e.preventDefault();
			})
		   	return this;
		},
	    formsubmit:function(){
	    	var that=this;	    
	    	if(that.hasValidate){//是否点击
	    		if(that.validateInit(that.ipteles)>0){
	    			this.form.find("input[type=submit]").removeAttr("disabled");  
	    		}else{
	    			var isAjaxV=0;
	    			for(var j=0;j<that.ipteles.length;j++){
						if(that[that.ipteles[j]+"pending"]!=undefined&&that[that.ipteles[j]+"pending"]!="success"){
							this.form.find("input[type=submit]").removeAttr("disabled"); 
							isAjaxV++;  
						}						
					}
	    			if(isAjaxV==0){
	    				that.success(that);
	    			}
	    		}
	    	}
	    		
			return false;
	    },
	    ajaxsubmit:function(sucfun,errfun){
	    	var form=this.form;
	    	jQuery.ajax({
				url:form.attr("action"),
				type:form.attr("method"),
				dataType:"json",
				data:form.serialize(),
				success:function(data){  
					form.find("input[type=submit]").removeAttr("disabled"); 
					if(typeof sucfun=="function"){
						sucfun(data);
					}
				},
				error:function(){
					form.find("input[type=submit]").removeAttr("disabled");  
					if(typeof errfun=="function"){
						errfun();
					}
				}
			})
	    },
		validateInit:function(ipteles,isValidate){		
			var options=this._options,
			   that=this,
			   flag=0;			
			if(typeof ipteles=="string"){		
				flag=that.validate(ipteles); 
			}else{			
				for(var i in options.rules){
					if(that.validate(i,true)){
						flag++;
					}; 				
				}
			}
			return flag; 
		},
		validate:function(i,isValidate){
			var _self=this;
			    options=_self._options,
			    that=$("input[name="+i+"]"),
			    flag=0,
			    pendingRequest=0;
			    if(that.css("display")!="none"){
			    	 for(var j in options.rules[i]){	
		    	    	 (function(j){
					    		if(typeof  options.rules[i][j]=="boolean"){				    		
							    	if(!_self.validateRules[j](that.val())){					    				
							    		flag++;					    		
							    		_self.showError(that,options.msg[i][j]);					    	
							    	}else{
							    		_self.hideDefault(that);		
							    	}			    			
							    }else{ 		
							    		if(options.rules[i][j]=="pending"){
							    			_self[j](_self);						    			
							    		}else if(!options.rules[i][j](_self,that.val())){
								        	flag++;						        
								        	_self.showError(that,options.msg[i][j]);						    
								       }				        
							    }
					  
					      })(j);
		    	    	  if(flag>0){
						       break;
						  }		 
			    	 }	
		       if(flag==0){
			    	   if((typeof _self[i+"pending"]!="undefined"&&_self[i+"pending"]=="success")||typeof _self[i+"pending"]=="undefined"){
			    		   _self.showSuccess(that);	
			    		   if(i=="password"){
					    		$(".pwStrong").show();   						    		
					    	}
			    	   }
			    	   if(_self[i+"pending"]=="error"){
			    		   _self.showError($("input[name="+i+"]"),_self._options.msg[i].isExit);
			    	   }
			       }	
			  }
		      
		       
		       return flag;
		},		
		//展示默认消息
		showDefault:function(context,i){
			context.removeClass("g-reg-txt-error").removeClass("g-reg-txt-success").next().removeClass("input-icon-success");			
			var defaultMsg=this._options.msg[i].defaultm||"";
			var defaultTag=$("."+context.attr("data-tipTag"));		
			if($("."+context.attr("data-tipDefault")).length>0){
				defaultTag=$("."+context.attr("data-tipDefault"));
			}						
	    	defaultTag.show().removeClass("code-error").html(defaultMsg);
		},
		//验证loading效果
		validateLoading:function(context,msg){
			var defaultTag=$("."+context.attr("data-tipTag"));	
			defaultTag.show().removeClass("code-error").html(msg);
		},
		//成功消息展示
		showSuccess:function(that){
			var _self=this;
		    that.addClass("g-reg-txt-success").removeClass("g-reg-txt-error").next().addClass("input-icon-success");
		    _self.hideDefault(that);
		},
		hideSuccess:function(that){
			var _self=this;
		    that.removeClass("g-reg-txt-success").removeClass("g-reg-txt-error").next().removeClass("input-icon-success");
		    _self.hideDefault(that);
		},
		//隐藏默认消息
		hideDefault:function(context){
			context.removeClass("g-reg-txt-error");	    	
	    	var defaultTag=$("."+context.attr("data-tipTag"));		
			if($("."+context.attr("data-tipDefault")).length>0){
				defaultTag=$("."+context.attr("data-tipDefault"));
			}	
			defaultTag.hide();	
		},
		//展示错误消息
		showError:function(context,msg){
			var tipTag=  $("."+context.attr("data-tipTag")),
			 	options=this._options;			
			context.addClass("g-reg-txt-error").removeClass("g-reg-txt-success").next().removeClass("input-icon-success");
	    	tipTag.show().removeClass("code-error").addClass("code-error").html(msg);
		},
		//隐藏错误消息
		hideError:function(context){
			context.removeClass("g-reg-txt-error");
			defaultTag=$("."+context.attr("data-tipTag"));
			defaultTag.hide();	
		},
		//密码强度
		pwStrong:function(){	
			var btValidate=this,
			     password=$("input[name=password]");
					
			password.keyup(function(){
    			var pwStrong=$(".pwStrong"),
    			    pwStrongb=$(".pwStrong b");      
    			btValidate.hideDefault($(this));
    			if(jQuery.trim($(this).val()).length>=6&&!btValidate.validate("password")){
    				pwStrong.show();
    				btValidate.showSuccess(password);
    				pwStrongb.removeClass("lv0 lv1 lv2 ")
    				if(checkStrong()==3){
    					pwStrongb.addClass("lv2");
    				}
    				else if(checkStrong()==2){
    					pwStrongb.addClass("lv1");
    				}
    				else{
    					pwStrongb.addClass("lv0");
    				}
    				if($("input[name=passwordRepeat]").val()!=""){
    					btValidate.validate("passwordRepeat");
    				}
    				
    			}else{    				
    				btValidate.hideSuccess(password);
    				pwStrong.hide();
    			}        			
    		}) 
			function checkStrong() {
			    var sPW = $('input[name=password]').val();
			    if (sPW.length < 1)
			        return 0;
			    Modes = 0;
			    for (i = 0; i < sPW.length; i++) {
			        Modes |= Evaluate(sPW.charCodeAt(i));
			       
			       }
			    var num = bitTotal(Modes);
			    return num;
			}
			function Evaluate(character) {
			    if (character >= 48 && character <= 57)
			        return 1;
			    if (character >= 65 && character <= 90)
			        return 2;
			    if (character >= 97 && character <= 122)
			        return 4;
			    else
			        return 8;
			}

			function bitTotal(num) {
			    modes = 0;
			    for (i = 0; i < 4; i++) {
			        if (num & 1) modes++;
			        num >>>= 1;
			    }
			    return modes;
			}
			return this;
		},
		//手机验证码
		validatePhoneCode:function(callback){
			var btValidate=this;
		
			$("#get-validatePhone").click(function(){
				if($(this).hasClass("g-reg-vp-disabledBtn")){
					return false;
				}				
    			var phone=$("input[name=phone]"),
    			     that=$(this);
    			if(phone.val()==""){  
    				btValidate.showError(phone,btValidate._options.msg.phone.isNull);
    			}else{
    				if(!window.hasPostPhoneCode){
    					window.hasPostPhoneCode=true;
    					
        				if(!btValidate.validate("phone")){
        					jQuery.ajax({
	       						url:"/reg/getPhoneCode",
	       						type:"post",	 
	       					    dataType: 'json',
	       						data:{phone:jQuery.trim(phone.val())},
	       						success:function(data){
	       							$("#phoneCodeTicket").val(data.ticket);
	       							var mobileOptip=$(".mobile-optip");
	       							if(mobileOptip.length>0){
	       								mobileOptip.css({"visibility": "visible"});
	       							}
	       							if(typeof callback=="function"){
	       								callback();
	       							}
	       						},
	       						error:function(){
	       							
	       						}
       					    }) 
        				   that.html("<span class='phoneCode-times'>120</span>秒后重新获取").addClass("g-reg-vp-disabledBtn");
        					 window.setIntervalPhoneTime=setInterval(function(){ 
        				 		var phoneCode=$(".phoneCode-times"),
        				     	     codeTimes=phoneCode.html();
        				 		if(codeTimes>1){
        				 			phoneCode.html(codeTimes-1);
        				 		}else{
        				 			window.hasPostPhoneCode=false;
        				 			that.html("获取短信验证码").removeClass("g-reg-vp-disabledBtn"); 
        				 			clearInterval(window.setIntervalPhoneTime);            				 		
        				 		}
        					},1000)   
        				}      	
    				}
    			}     
    		});
		},
		//用户重名
		userNamepending:"default",		
		isUserNameExit:function(_self){		
				if(_self.userNamepending=="default"){
					var userName=$("input[name=userName]");
					_self.validateLoading(userName,"检验中...");            						
					jQuery.ajax({
						url:"/validate/userNameEqual",
						type:"post",
						data:{userName:userName.val()},
						beforeSend:function(){
							_self.userNamepending="pending";
						},
						success:function(data){
        					data=="false"? flag = true:flag = false;                 					
        					if(flag){	
        						_self.userNamepending="success";
        						_self.formsubmit();
        						$("#get-validatePhone").removeClass("g-reg-vp-disabledBtn");
        						_self.showSuccess(userName);                						
        					}else{      
        						_self.userNamepending="error";
        						_self.showError(userName,_self._options.msg.userName.isExit)
        					} 
        			    },
        			    error:function(){
        			    	_self.userNamepending="error";
        			    }
					})            
				}
			    return "pending";			
		},
		//电话重名
		phoneValidateSType:"false",
		phonepending:"default",		
		isphoneExit:function(_self){	
			var phone=$("input[name=phone]");
			if($("#oldPhone").length==0||!_self.validateRules.isEquail(phone.val(),$("#oldPhone").val())){
				if(_self.phonepending=="default"){					
					_self.validateLoading(phone,"检验中...");            						
					jQuery.ajax({
						url:"/validate/userPhoneEqual",            							
						type:"post",
						data:{phone:phone.val()},
						beforeSend:function(){
							_self.phonepending="pending";
						},
						success:function(data){
	    					data==_self.phoneValidateSType? flag = true:flag = false;  
	    					if(flag){
	    						_self.phonepending="success";
	    						window.hasPostPhoneCode=false
	    						clearInterval(window.setIntervalPhoneTime);  
	    						$("#get-validatePhone").removeClass("g-reg-vp-disabledBtn").html("获取短信验证码");
	    						_self.formsubmit();
	    						_self.showSuccess(phone);
	    					}else{      			
	    						_self.phonepending="error";
	    						_self.showError(phone,_self._options.msg.phone.isExit)
	    					}
						},
					   error:function(){
							_self.phonepending="error";
					   }
					})
				}
			}else{
				_self.phonepending="success";
				$("#get-validatePhone").removeClass("g-reg-vp-disabledBtn");
			}
			
		    return "pending";
		},	
		//邮箱重名
		emailValidateSType:"false",
		emailpending:"default",
		isemailExit:function(_self){
			if(_self.emailpending=="default"){
				var email=$("input[name=email]");
				_self.validateLoading(email,"检验中...")   						
				jQuery.ajax({
					url:"/validate/userEmailEqual",            							
					type:"post",
					data:{email:email.val()},
					beforeSend:function(){						
						_self.emailpending="pending";
					},
					success:function(data){
						data==_self.emailValidateSType? flag = true:flag = false;                					
    					if(flag){       
    						_self.emailpending="success";
    						_self.formsubmit();  
    						clearInterval(window.setIntervalEmailTime);      
    						$("#get-validateEmail").removeClass("g-reg-vp-disabledBtn").html("获取验证码");
    						_self.showSuccess(email);
    					}else{       					
    						_self.emailpending="error";
    						_self.showError(email,_self._options.msg.email.isExit)
    					}
				},
				 error:function(){
					 _self.emailpending="error";
				  }
				})
			}
		    return "pending";
		},
		//验证密码是否存在
		oldPasswordpending:"default",
		isoldPasswordExit:function(_self){  
			if(_self.oldPasswordpending=="default"){
				var oldPassword=$("input[name=oldPassword]");
				_self.validateLoading(oldPassword,"检验中...")   						
				jQuery.ajax({
					url:"/validate/checkPw",            							
					type:"post",
					data:{password:oldPassword.val()},
					beforeSend:function(){						
						_self.oldPasswordpending="pending";
					},
					success:function(data){
						data=="true"? flag = true:flag = false;                  					
    					if(flag){       
    						_self.oldPasswordpending="success";
    						_self.formsubmit();
    						_self.showSuccess(oldPassword);
    					}else{       					
    						_self.oldPasswordpending="error";
    						_self.showError(oldPassword,_self._options.msg.oldPassword.isExit)
    					}
				},
				 error:function(){
					 _self.oldPasswordpending="error";
				  }
				})
			}
		    return "pending";
		},
		phoneCodepending:"default",	
		checkPhoneValidateCode:function(_self){
			if(_self.phoneCodepending=="default"){				
				var phoneCode=$("input[name=phoneCode]");
				_self.validateLoading(phoneCode,"检验中...")   						
				jQuery.ajax({
					url:"/validate/phoneValidateCode",            							
					type:"post",					
					data:{phoneCode:phoneCode.val(),phoneCodeTicket:$("#phoneCodeTicket").val()},
					dataType:"json",
					beforeSend:function(){
						_self.phoneCodepending="pending";
					},
					success:function(data){	
    					if(data.success==1){       
    						_self.phoneCodepending="success";
    						_self.formsubmit();
    						_self.showSuccess(phoneCode);
    					}else{       					
    						_self.phoneCodepending="error";
    						_self.showError(phoneCode,_self._options.msg.phoneCode.isExit);
    					}
				},
				 error:function(){
					 _self.phoneCodepending="error";
				  }
				})
			}
		    return "pending";
		},
		emailCodepending:"default",	
		checkEmailValidateCode:function(_self){
			if(_self.emailCodepending=="default"){				
				var emailCode=$("input[name=emailCode]");
				_self.validateLoading(emailCode,"检验中...")   						
				jQuery.ajax({
					url:"/validate/checkEmailValidateCode",            							
					type:"post",					
					data:{emailCode:emailCode.val(),ticket:$("#ticket").val()},
					dataType:"json",
					beforeSend:function(){
						_self.emailCodepending="pending";
					},
					success:function(data){	
    					if(data.success==1){       
    						_self.emailCodepending="success";
    						_self.formsubmit();
    						_self.showSuccess(emailCode);
    					}else{       					
    						_self.emailCodepending="error";
    						_self.showError(emailCode,_self._options.msg.emailCode.isExit)
    					}
				},
				 error:function(){
					 _self.emailCodepending="error";
				  }
				})
			}
		    return "pending";
		},
			//验证函数
	    validateRules:{				   
				    isNull: function(str) {
				        return str != "";
				    },
				    isLength:function(str,len){
				    	return str.length==len;
				    },
				    isEquail:function(str,str1){
				    	return str==str1;
				    },
				    betweenLength: function(str, _min, _max) {				    
				        return (str.length >= _min && str.length <= _max);
				    },
				    fullNumber: function(str) {
				        return new RegExp(validateRegExp.fullNumber).test(str);
				    },
				    isPwd: function(str) {
				        return /^.*([\W_a-zA-z0-9-])+.*$/i.test(str);
				    },
				    isPwdRepeat: function(str1, str2) {
				    	
				        return (str1 == str2);
				    },
				    isEmail: function(str) {
				        return new RegExp(validateRegExp.email).test(str);
				    },	   
				    isMobile: function(str) {				    	
				        return new RegExp(validateRegExp.mobile).test(str);
				    },
				    isInvitationCode:function(str){
				    	 return new RegExp(validateRegExp.invitationCode).test(str);
				    },
				    isUserName:function(str){
				    	return new RegExp(validateRegExp.userName).test(str);
				   },
				    isTepqh: function(str) {
				        return new RegExp(validateRegExp.tepqh).test($.trim(str));
				    },
				    isTepnum:function(str){				    	
				    	 return new RegExp(validateRegExp.tepnum).test($.trim(str));
				    },
				    isTepfjnum:function(str){				    	 
				    	return new RegExp(validateRegExp.tepfjnum).test($.trim(str));
				   }
	    }
	}	
	
	BtValidate.prototype.init.prototype=BtValidate.prototype;
	
	module.exports=BtValidate;
	
})