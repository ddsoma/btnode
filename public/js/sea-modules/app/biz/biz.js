define(function(require,exports,module){
	
	require("../blui/ui-validate.js");
	
	var UIPaging = require("../blui/ui-paging"),
		UIShow = require("../blui/ui-show"),
		BLUIDialog = require("../blui/ui-dialog"),
		addBtn = $(".g-body-add"),
		delBtn = $(".delBtn"),
		editBtn = $(".editBtn"),
		confirmBtnClass = ".modal-f-submitBtn",
		cancelBtnClass = ".modal-f-cancelBtn",
		Area = require("./area");
	
	
	exports.list = function(){
		
		UIPaging.paging();
		
		//添加
		addBtn.click(function(){
			var url = $.trim($(this).attr("data-url"));
			var width = $.trim($(this).attr("data-winWidth")),height = $.trim($(this).attr("data-winHeight"));
			var bluidialog = new BLUIDialog({
					width:width,
					height:height
				}).openajax(url + "?t="+ new Date().getMilliseconds(),function(t){
					$("body").delegate(cancelBtnClass, "click", function () {
						t.close();
	      	        });
				});
		});
		
		//编辑
		editBtn.click(function(){
			var url = $.trim($(this).attr("data-url")) + "?t=" + new Date().getMilliseconds();
			var id = $.trim($(this).attr("data-id"));
			url = url + "&id=" + id;
			var width = $.trim($(this).attr("data-winWidth")),height = $.trim($(this).attr("data-winHeight"));
			var bluidialog = new BLUIDialog({
					width:width,
					height:height
				}).openajax(url,function(t){
					$("body").delegate(".modal-f-cancelBtn", "click", function () {
						t.close();
	      	        });
				});
		});
		
		//删除
		delBtn.click(function(){
			var id = $.trim($(this).attr("data-id"));
			var delurl = $.trim($(this).attr("data-url"));
			var dataMes = $.trim($(this).attr("data-mes"));
			UIShow.show(dataMes, id, function(w){
				$("body").delegate(cancelBtnClass, "click", function () {
					w.close();
	  	        });
				$("body").delegate(confirmBtnClass,"click",function(){
					var delid = $.trim($(this).attr("data-id"));
					var url = delurl + "?t=" + new Date().getMilliseconds();
					$.post(url,{ id:delid },function(data){
						if(data=="true"){
							w.close();
							window.location.reload();
						}
					});
				});
	         });
		});
	};
	
	/**
	 * 添加、编辑申请人
	 */
	exports.patenteeEdit = function(){
		var paTypeSelectedObj = $("#typeSelect"),
			paType = $("#type"),
			validateForm = $("#validateForm"),type = $.trim($(".modal-title").attr("data-type"));
		Area.show(type);
		Area.selectEvent();
		
		paTypeSelectedObj.change(function(){
			var thisVal = $(this).find("option:selected").val();
			paType.val(thisVal);
			if(thisVal != ""){
				$(this).parent().find(".error").remove();
			}
		});
		
		validateForm.validate({
			focusInvalid: false,
			onkeyup:false,
			errorElement:"span",
			errorClass:"error",
	        rules: {
	        	type:{
	        		required:true
	        	},
	        	name: {
	        		required:true,
	        		maxlength:40
	            },
	            code:{
	            	required:true,
	            	maxlength:20
	            },
	            area:{
	            	required:true
	            },
	            address:{
	            	required:true,
	            	minlength:5,
	            	maxlength:100
	            },
	            postCode:{
	            	required:true,
	            	isZipCode:true
	            }
	        },
	        messages: {
	        	type:{
	        		required:"请选择您的申请人类型"
	        	},
	        	name: {
	        		required:"请输入姓名/名称，不超过40个字符",
	        		maxlength:"请输入姓名/名称，不超过40个字符"
	            },
	            code:{
	            	required:"请输入身份证号或组织机构代码证号，不超过20个字符",
	            	maxlength:"请输入个人身份证号或单位组织机构代码证号，不超过20个字符"
	            },
	            area:{
	            	required:"请您选择完整的所在地区"
	            },
	            address:{
	            	required:"请输入街道地址，5-100个字符",
	            	minlength:"请输入街道地址，5-100个字符",
	            	maxlength:"请输入街道地址，5-100个字符"
	            },
	            postCode:{
	            	required:"请输入6位邮政编码",
	            	isZipCode:"请输入6位邮政编码"
	            }
	        },
	        errorPlacement: function (error, element) {
	        	var placement = $(element.parents(".modal-f-item"));
	        	placement.append(error);
	        }
    	});
	};
	
	/**
	 * 添加、编辑发明人
	 */
	exports.inventorEdit = function(){
		var validateForm = $("#validateForm");
		validateForm.validate({
			focusInvalid: false,
			onkeyup:false,
			errorElement:"span",
			errorClass:"error",
            rules: {
            	name: {
            		required:true,
            		maxlength:40
                },
                code:{
                	required:true,
                	maxlength:20
                }
            },
            messages: {
            	name: {
            		required:"请输入姓名，不超过40个字符",
            		maxlength:"请输入姓名，不超过40个字符"
                },
                code:{
                	required:"请输入身份证号，不超过20个字符",
                	maxlength:"请输入个人身份证号，不超过20个字符"
                }
            },
            errorPlacement: function (error, element) {
            	var placement = $(element.parents(".modal-f-item"));
            	placement.append(error);
            }
        });
	};
	
	/**
	 * 添加、编辑联系人
	 */
	exports.contactEdit = function(){
		
		var generalManager = $("#generalManager"),
			engineer = $("#engineer"),
			appellation = $("#appellation"),
			dhhm = $("#dhhm"),
			fj = $("#fj"),
			validateForm = $("#validateForm");
		
		generalManager.click(function(){
			appellation.val(1);
		});
		engineer.click(function(){
			appellation.val(2);
		});
		
		dhhm.blur(function(){
			validateForm.submit();
		});
		
		fj.blur(function(){
			validateForm.submit();
		});
		validateForm.validate({
			focusInvalid: false,
			onkeyup:false,
			errorElement:"span",
			errorClass:"error",
            rules:{
            	name:{
            		required:true,
            		maxlength:40
                },
                area:{
                	required:true
                },
                mobilePhone:{
                	required:true,
                	isMobile:true
                },
                email:{
                	Email:true
                },
                qq:{
                	number:true,
                	maxlength:20
                },
                qh:{
                	zj:true
                }
            },
            messages:{
            	name:{
            		required:"请输入姓名，不超过40个字符",
            		maxlength:"请输入姓名，不超过40个字符"
                },
                area:{
                	required:"请您选择完整的所在地区"
                },
                mobilePhone:{
                	required:"请输入11位有效手机号",
                	isMobile:"请输入11位有效手机号"
                },
                email:{
                	Email:"您输入的邮箱格式有误"
                },
                qq:{
                	number:"请输入正确的QQ，不超过20个数字",
                	maxlength:"请输入正确的QQ，不超过20个数字"
                },
                qh:{
                	zj:"格式错误"
                }
            },
            errorPlacement: function (error, element) {
            	var placement = $(element.parents(".modal-f-item"));
            	placement.append(error);
            }
		});
	};
});

