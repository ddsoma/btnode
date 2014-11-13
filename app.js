var http=require("http");
var fs=require("fs");
var url=require("url");
var querystring=require("querystring");
var path = require('path');


var mime={
	"css":"text/css",
	"js":"application/x-javascript"

}

http.createServer(function(req,res){
	var urlstr=req.url;
	if(urlstr.indexOf("??")==-1){
		urlstr = urlstr.replace('/', '/??');
    }
	var paths=urlstr.split("??");
	var pathnames=paths[1].split(",").map(function(value){
		return path.join( __dirname, value);
	})
	console.log(pathnames);
	var body="";
    (function next(i,len){
    	if(i<len){
		    fs.stat(pathnames[i],function(err,stats){
				if(err){
					res.write("文件不存在")
					res.end();
					return;
				}
				fs.readFile(pathnames[i],function(err,data){
					body+=data;
					next(i+1,len);
				})
			})
    		
    	}else{
    		console.log(body);
    		var extname=path.extname(pathnames[1]);
		    res.setHeader('Content-Type',mime[extname]+";charset=utf-8");
		    res.end(body);
    	}

    })(0,pathnames.length)
}).listen(3000)