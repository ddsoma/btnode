define(function(require,exports,module){
	
	require("$");
	
	require("jquery-validate");
	
	//邮编
	$.validator.addMethod("isZipCode", function(value, element) {
		var tel = /^[0-9]{6}$/;
		return this.optional(element) || (tel.test(value));
		}, "");
	
	//手机号码是否存在
	$.validator.addMethod("isExistMobile", function (value, element) {
		var flag = false;
		$.post("/admin_isExistMobile?t="+ new Date().getMilliseconds(),{phone:$.trim(value)},function(data){
			data=="True"? flag = true:flag = false;
		});
        return this.optional(element) || flag;
    }, "");
	
	//手机验证
	$.validator.addMethod("isMobile", function (value, element) {
        var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
        return this.optional(element) || mobile.test($.trim(value));
    }, "");
	
	//电话验证
	$.validator.addMethod("isTel", function (value, element) {
        var tel = /^\d{3,4}-\d{7,9}$/;
        return this.optional(element) || (tel.test($.trim(value)));
    }, "");
	//邮箱验证
	$.validator.addMethod("Email", function(value, element){
		var tel = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/;
		return this.optional(element)||(tel.test(value));
	}, "*");
	//客户姓名（不超过40个英文或汉字）
	$.validator.addMethod("cname", function(value, element){
		var name = /^[\u4e00-\u9fa5a-zA-Z]{2,40}$/;
		return this.optional(element)||(name.test(value));
	}, "*");
	//座机
	$.validator.addMethod("zj", function(value, element){
		var qh = $.trim($("#qh").val());
		var dhhm = $.trim($("#dhhm").val());
		var fj = $.trim($("#fj").val());
		$("#mobilePhone").val("");
		if(qh == "" && dhhm == "" && fj == "")
		{
			return true;
		}	
		if(qh == "" && dhhm != "" || qh != "" && dhhm == ""){
			return false;
		}
		if(!/^\d{3,6}$/.test(qh) || !/^\d{7,10}$/.test(dhhm) || fj != "" && !/^\d{3,6}$/.test(fj)){
			return false;
		}
		var mobilePhone = fj == "" ? qh + "-" + dhhm : qh + "-" + dhhm + "-" + fj;
		$("#mobilePhone").val(mobilePhone)
		return true;
	}, "*");
	
});