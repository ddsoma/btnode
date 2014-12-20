module.exports={
	port:"8081",
	host:"static.baiten.cn",
    root:"D:/temp/test",   
    js:"js",
    css:"connect/css",
    img:"connect/images/**/*.{png,jpg,gif}",
    templateHtml:"templateHtml",
    template:"templateHtml/patent/**/*.html",
	gruntFile:["bra/**/**.js"],       
	tpldest:"../tpl",
	dest:"assets",  
	spm:{
		"base":"/js/sea-modules",  
		"alias":{
		   "seajs-debug": "seajs/seajs-debug/1.1.1/seajs-debug",
		  '$': 'gallery/jquery/jquery-1.10.2.min.js',        
		  'jquery-validate': 'gallery/jquery.validate/jquery.validate.js',		
		  "cookie":"gallery/jquery.cookie/jquery.cookie.js",
		  "datapicker":"gallery/My97DatePicker/WdatePicker.js",
		  "template":"gallery/template/template.min.js",
		  "placeholder":"gallery/jquery.placeholders/placeholder.js",
		  "json":"gallery/json2.js",
		  "jquery-ui":"gallery/jquery.ui/jquery-ui.min.js",
		  "then":"gallery/then/then.min.js"
		}
	}
}