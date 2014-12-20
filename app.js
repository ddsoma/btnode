#! /usr/bin/env node

var http=require("http");
var fs=require("fs");
var url=require("url");
var querystring=require("querystring");
var path = require('path');
var mime=require("./config/mimeTypes");
var logger=require("./log.js");
var config=require("./config");

//icon内容获取
var ico="";	
fs.readFile("./favicon.ico",function(err,data){
	ico=data;
})

function validatefile(pathnames,callback){
	var mtimes=[];
	(function next(i,len){
		if(i<len){
			fs.stat(pathnames[i],function(err,stats){
				if(err){
					callback(err);
					return;
				}else if(!stats.isFile()){
					callback(new Error());
					return;
				}
				mtimes.push(new Date(stats.mtime.toUTCString()).getTime());
				next(i+1,len);
			})
		}else{
			callback(null,mtimes);
		}
	
	})(0,pathnames.length)
}

function outputFile(pathnames,res){
	var body="";
    (function next(i,len){
    	if(i<len){
    		  var readstream=fs.createReadStream(pathnames[i]);
	    		  readstream.pipe(res,{end:false});
	    		  	readstream.on("end",function(){
	    		  		res.write("\r\n");
	    		  	 	next(i+1,len);
	    		  	});
    		}else{
    			res.end(body);
    		}
    })(0,pathnames.length)
}

var host=config.host||"localhost",
    port=config.port||"8080",
    root=config.root||"public";

http.createServer(function(req,res){
	var urlstr=req.url;
	if(urlstr!="/favicon.ico"){
		if(urlstr.indexOf("??")==-1){
			urlstr = urlstr.replace('/', '/??');
    	}
		var paths=urlstr.split("??");
		var pathnames=paths[1].split(",").map(function(value){
			if(value.indexOf("?")!=-1){
				value=value.split("?")[0];
			}
			return path.join(root, paths[0],value);
		})

	    validatefile(pathnames,function(err,mtimes){
	    	if(err){
	    		logger.getLogger("err").info(req.method+req.url+"\r\n"+err.message);
	    		res.writeHead(404);
	    		res.end("error");
	    		return;
	    	}else{
	    		 logger.getLogger("info").info(req.method+req.url+"\r\n");

	    		 var ifModifiedSince="If-Modified-Since".toLowerCase();
	    		 var lastmtime=new Date(Math.max.apply(null,mtimes)).toUTCString();
	    		 var extname=path.extname(pathnames[0]);
	    		 var expires = new Date();
   				 expires.setTime(expires.getTime() + 3600 * 1000);

   				 var r=/.ttf|.ttc|.otf|.eot|.woff/;
   				 if(r.test(extname)){
   				 	res.setHeader("Access-Control-Allow-Origin","http://localhost:8080");  
   				 }

   				 res.setHeader("Expires", expires.toUTCString());
	    		 res.setHeader("Cache-Control","max-age=3600");
	    		 res.setHeader("Content-Type",mime[extname]);

	    		 if(req.headers[ifModifiedSince]&&req.headers[ifModifiedSince]==lastmtime){
	    		 		res.writeHead(304,"Not Modified");
	    		 		res.end();
	    		 		return;
	    		 }
	    		 
	    		 res.setHeader("Last-Modified",lastmtime);
	    		 outputFile(pathnames,res);
	    	}
   		 });
	 }
}).listen(port)