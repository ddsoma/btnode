define(function(require,exports,module){
	require("$");  
 
    function Area(options){
    	return new Area.prototype.init(options);
    }	
	
    Area.prototype={
    		init:function(options){
    			var that=this;
    			that.purl=(options&&options.purl)||"/area_getprovincialarea";
    			that.curl=(options&&options.curl)||"/area_getcityarea";
    			that.turl=(options&&options.turl)||"/area_gettownarea";    
    		 
    			$("body").delegate("#province",'change',function(){    				 
    				if($(this).val()=="请选择"){    					 
    					  $("#city").html(template('area-city-template',{list:null}))
    				}else{
    					that.cityinit(function(data){
    	    			$("#city").html(template('area-city-template',{list:data}))
    	    		   })  
    				}  
    				$("#county").html(template('area-town-template',{list:null}))
    			          	
    			}).delegate("#city",'change',function(){
    				if($(this).val()!="请选择"){  
    					that.towninit(function(data){
        					$("#county").html(template('area-town-template',{list:data}))  
        				})  
    				}else{
    					$("#county").html(template('area-town-template',{list:null}))
    				}
    				   				     
    			}).delegate("#county",'change',function(data){
    				var currentAreaId = $.trim($(this).find("option:selected").val());         	  			
    			});
    		},
    		
    		provincialinit:function(callback){
    			var that=this;
    			$.ajax({
    				url:that.purl,
    				type:"post",    	  
    				dataType:"json", 
    				success:function(data){    				
    					if(typeof callback=="function"){
    						callback(data);     
    					}      					
    				}
    			})
    		},
    		cityinit:function(callback){    		
    			 var that=this;
    			 var provinceSelectObj = $("#province"); 
    			 if($.trim(provinceSelectObj.val())!=""){
    				 $.ajax({
    	    				url:that.curl,
    	    				type:"post",   
    	    				data:{id:provinceSelectObj.find("option:selected").attr("data-id")},
    	    				dataType:"json", 
    	    				success:function(data){    				
    	    					if(typeof callback=="function"){
    	    						callback(data);     
    	    					}      					
    	    				}
    	    			})
    			 }
    		},
    		towninit:function(cityName,callback){    		
    			var that=this;
    			var provinceSelectObj = $("#province"),
    			citySelectObj = $("#city");
    			cityVal=$.trim(citySelectObj.find("option:selected").attr("data-id"));  
    			if(typeof cityName=="function"){
    				callback=cityName;    				
    			}
    			if(typeof cityName=="string"){
    				//cityVal=cityName;  
    			}      		
    			if(citySelectObj.val()!=""){     
    				$.ajax({    
        				url:that.turl,
        				type:"post",    
        				data:{id:cityVal},       
        				dataType:"json",   
        				success:function(data){    				
        					if(typeof callback=="function"){
        						callback(data);     
        					}      					
        				}
        			})
    			}
    		} 
    		
    }
    module.exports=Area; 
    
    
    Area.prototype.init.prototype=Area.prototype;
    
    
    
})