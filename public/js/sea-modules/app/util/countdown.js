/*
 * 倒计时html结构
 * <span style="display:inline-block;position: relative;top: 4px;">   
		<span id="day" class="time"></span><span class="timeunit">天</span>
		<span id="hour" class="time"></span><span class="timeunit">:</span>
		<span id="mini" class="time"></span><span class="timeunit">:</span>
		<span id="sec" class="time"></span>
	</span>
	js使用
	a=new Date("2014/10/15")//到期时间
	dom= {
			 sec: $("#sec"),
			 mini: $("#mini"),
			 hour: $("#hour"),
			 day: $("#day")
		} 显示时间变化的dom 
	fnTimeCountDown(a, zlgj.obj);
	
		/* var countDown = {
			    futureDate: new Date("2014/10/15"),
			    dom: {
			            sec: $("#sec"),
			            mini: $("#mini"),
			            hour: $("#hour"),
			            day: $("#day")
			        }
			};
		fnTimeCountDown(countDown.futureDate, countDown.dom); */
 

/*倒计时*/
define(function(require,exports,module){
	require("$");
	var fnTimeCountDown = function (d, o) {
	    var f = {
	        zero: function (n) {
	            var n = parseInt(n, 10);
	            if (n > 0) {
	                if (n <= 9) {
	                    n = "0" + n;
	                }
	                return String(n);
	            } else {
	                return "00";
	            }
	        },
	        dv: function () {
	            d = d || new Date("2050/0/01"); //如果未定义时间，设定倒计时日期是2050年1月1日
	            var future = new Date(d), now = new Date();
	            var dur = Math.round((future.getTime() - now.getTime()) / 1000), pms = {
	                sec: "00",
	                mini: "00",
	                hour: "00",
	                day: "00",              
					month: "00",
					year: "0"
	            };
	            if (dur > 0) {
	                pms.sec = f.zero(dur % 60);
	                pms.mini = Math.floor((dur / 60)) > 0 ? f.zero(Math.floor((dur / 60)) % 60) : "00";
	                pms.hour = Math.floor((dur / 3600)) > 0 ? f.zero(Math.floor((dur / 3600)) % 24) : "00";
	                pms.day = Math.floor((dur / 86400)) > 0 ? f.zero(Math.floor((dur / 86400)) % 30) : "00";
	            	pms.month = Math.floor((dur / 2629744)) > 0? f.zero(Math.floor((dur / 2629744)) % 12) : "00";				
					pms.year = Math.floor((dur / 31556926)) > 0? Math.floor((dur / 31556926)) : "0";
	            }
	            return pms;
	        },
	        ui: function () {
	            if (o.sec) {
	                o.sec.html(f.dv().sec);
	            }
	            if (o.mini) {
	                o.mini.html(f.dv().mini);
	            }
	            if (o.hour) {
	                o.hour.html(f.dv().hour);
	            }
	            if (o.day) {
	                o.day.html(f.dv().day);
	            }
	            if(o.month){
					o.month.html(f.dv().month);
				}
				if(o.year){
					o.year.html(f.dv().year);
				}
	            setTimeout(f.ui, 1000);
	        }
	    };
	    f.ui();
	};
	module.exports=fnTimeCountDown;
})
