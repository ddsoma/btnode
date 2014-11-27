module.exports={
	port:"8081",
	host:"static.baiten.cn",
	
    root:"/users/jade/documents/devworkspace/git/static",
	gruntFile:["js/bracelet/app/**/**.js","js/so/app/**/**.js"],
	spm:{
		"base":"/js/sea-modules",
		"alias":{
			"$":"gallery/jquery/jquery-1.10.2.min.js",
			"cookie":"gallery/jquery.cookie/jquery.cookie.js",
			"template":"gallery/template/template.min.js",
			"jquery-validate":"gallery/jquery.validate/jquery.validate.js",
			"datapicker":"gallery/My97DatePicker/WdatePicker.js"
		}
	}
}