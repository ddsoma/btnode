var http=require("http");
var fs=require("fs");
var url=require("url");
var querystring=require("querystring");
var path = require('path');
var mime=require("./config/mimeTypes");

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
	console.log(1);
    (function next(i,len){
    	if(i<len){
    		  var readstream=fs.createReadStream(pathnames[i]);

    		  readstream.pipe(res,{end:false});

    		  readstream.on("end",function(){
    		  	 next(i+1,len);
    		  })
    		 
    		}else{
    			res.end();
    		}
    })(0,pathnames.length)
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

    validatefile(pathnames,function(err,mtimes){
    	if(err){
    		res.writeHead(404);
    		res.end(err.message);
    		return;
    	}else{
    		 var ifModifiedSince="If-Modified-Since".toLowerCase();
    		 var lastmtime=new Date(Math.max.apply(null,mtimes)).toUTCString();
    		 res.setHeader("Last-Modified",lastmtime);
    		 var extname=path.extname(pathnames[0]);
    		 res.setHeader("Content-Type",mime[extname]);
    		 console.log(req.headers[ifModifiedSince])
    		 if(req.headers[ifModifiedSince]&&req.headers[ifModifiedSince]==lastmtime){

    		 		res.writeHead(304,"Not Modified");
    		 		res.end();
    		 		return;
    		 }
    		 outputFile(pathnames,res);
    	}
    });
}).listen(3001)