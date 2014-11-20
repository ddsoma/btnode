/**
 * 定时跳转 
 * */
define(function(require,exports,module){
	require("$");
	function timeJump(ele,url,times,rate){
		if(arguments.length<3)
		    return false;		
		if(!rate)
			rate=1000;
		setInterval(function(){
			times--;		
			if(times==0){
				location.href=url;
				return false;
			}
			
			ele.html(times);
		},rate)		
	}
	module.exports=timeJump;
})