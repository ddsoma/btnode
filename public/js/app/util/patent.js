define(function(require,exports,module){
	var BLUIDialog=require("../blui/ui-dialog.js");
	var template=require("../../tpl/patent");     
	var Patent=function(){		
	}		
	Patent.patenteeInitList=[];	
	Patent.inanainitList=[];
	Patent.contacterdata=[];  
	Patent.prioritylist=[];//优先权项数据
	Patent.prototype={		
			  //申请人初始化状态
			  patenteeInitType:false,
			  patenteeSelectedList:[],
			  //申请人初始化
			  patenteeInit:function(){
				  var that=this,
				  		patenteecont= $("#pattentee-cont");
				  patenteecont.show().addClass("loading");
				  if(!that.patenteeInitType){  
					  $.ajax({
						  url:"/biz_getpatentee",
						  type:"post",
						  dataType:"json",
						  success:function(data){
							  var patenteeInfos=data&&data[0]&&data[0].infos;						  
							  if(patenteeInfos){
								  Patent.patenteeInitList= Patent.patenteeInitList.concat(patenteeInfos);
							  }
							  that.patenteeInitType=true;
							  patenteecont.html(template("patentee",{list:Patent.patenteeInitList})).removeClass("loading");	    
						  }
					  })
				  }else{
					  patenteecont.html(template("patentee",{list:Patent.patenteeInitList})).removeClass("loading");	    
				  }   
			  },				  
			  //申请人变化
			  patenteeChange:function(t){  
				 var that=this,
				      patentslist=that.patenteeSelectedList,
				      patenteeListLen=patentslist.length;
				 
				 if(patenteeListLen>2){   
				     $("#patentee").height(30*Math.ceil(patenteeListLen/2)+5);  
				 }else{
					 $("#patentee").height(35);      
				 }						
				 $("#patentee-list").html(template('patenteeList',{list:patentslist})); 			
				 $("#pattentee-cont").html(template('patentee',{list:Patent.patenteeInitList}));   
				 //that.setScale(); 
			  },
			  //申请人新增
			  patenteeAdd:function(){				
						var url ="/biz_public_editpatentee"
						    $("#pattentee-cont").hide(); 
							var width = 450,height = 410;
							var bluidialog = new BLUIDialog({   
									width:width,
									height:height
								}).openajax(url + "?t="+ new Date().getMilliseconds(),function(t){
									$("body").delegate(".modal-f-cancelBtn", "click", function () {
										t.close();
					      	        });								 
								},{"formurl":"biz_patapply_patform"});   
							e.stopPropagation();   
				  return this;
			  },				
			  contacterSelect:"",		 
			  contacterInitType:false,		
			  //联系人初始化
			  contacterInit:function(){
				  var that=this,
			  	       patcontacter= $("#patcontacter-cont");
				  patcontacter.show().addClass("loading");
				  if(!that.contacterInitType){
					  $.ajax({
						  url:"/biz_getcontacter",
						  type:"post",
						  dataType:"json",    
						  success:function(data){
							  var contacterInfos=data&&data[0]&&data[0].infos;  						 
							  that.contacterInitType=true;  
							  Patent.contacterdata= Patent.contacterdata.concat(contacterInfos);	   	  				 
							  patcontacter.html(template('patcontacter',{list:Patent.contacterdata})).removeClass("loading");	
						  }
					  })
				  }else{
					  patcontacter.html(template('patcontacter',{list:Patent.contacterdata})).removeClass("loading");	   
				  }
			  }, 
			  //联系人改变
			  changeContacter:function(str){  
				  $("#contacter-title").html(str);
			  },
			  //联系人添加
			  contacterAdd:function(){	
						var url ="/biz_public_editcontact"
							var width = 450,height = 410;
							var bluidialog = new BLUIDialog({
									width:width,
									height:height
								}).openajax(url + "?t="+ new Date().getMilliseconds(),function(t){
									$("body").delegate(".modal-f-cancelBtn", "click", function () {
										t.close();
					      	        });							 
								},{"formurl":"biz_patapply_patform"});
					return this;
			  },			  
			  inanainitType:false,
			  inanaselectedList:[],
			  inanaInit:function(){
	  			  var that=this,
	  					in_anac= $("#in-ana-cont");  
	  					in_anac.show().addClass("loading");  
	  			  if(!Patent.initType){  
	  				  $.ajax({
	  					  url:"/biz_getpatentee",
	  					  type:"post",
	  					  dataType:"json",
	  					  success:function(data){
	  						  var inanaInfos=data&&data[0]&&data[0].infos;						  
	  						  if(inanaInfos){  							
	  							Patent.inanainitList= Patent.inanainitList.concat(inanaInfos);   						
	  						  }  
	  						Patent.initType=true;
	  						in_anac.html(template('inventor',{list:Patent.inanainitList})).removeClass("loading"); 	    
	  					  }
	  				  })
	  			  }else{
	  				  in_anac.html(template('inventor',{list:Patent.inanainitList})).removeClass("loading");   
	  			  }   
	  		  },	  		
	  		  inanaChange:function(t){  
	  			 var  that=this,
	  			 	   item=Patent.inanainitList.splice(t.attr("data-i"),1);  	
	  			 	   that.inanaselectedList.push(item[0]); 
	  			 	  inslist=that.inanaselectedList,
	  			      insListLen=inslist.length;
	  			 
	  			 if(insListLen>2){   
	  			     $("#in-ana").height(30*Math.ceil(insListLen/2)+5);  
	  			 }else{
	  				 $("#in-ana").height(35);        
	  			 }				
	  			  
	  			 $("#inana-list").html(template('inventorList',{list:inslist}));   
	  			 $("#in-ana-cont").html(template('inventor',{list:Patent.inanainitList}));     
	  		  },
	  		  inanaAdd:function(){	  			
					var url ="/biz_public_editinana"
						var width = 450,height = 260;  
						var bluidialog = new BLUIDialog({
								width:width,
								height:height
							}).openajax(url + "?t="+ new Date().getMilliseconds(),function(t){
								$("body").delegate(".modal-f-cancelBtn", "click", function () {
									t.close();
				      	        });							 
							},{"formurl":"biz_patapply_patform"});
				
	  			return this;
	  		  },
	  		  //文件图片展示
	  		ofilepic:function(){
	  			var width = 970,height =650;
	    		var bluidialog = new BLUIDialog({
	    				width:width,
	    			    height:height
	    		}).open(template("ofile-pic-template",{list:null}),function(t){
	    					$("body").delegate(".modal-f-cancelBtn", "click", function () {
	    						t.close();
	    		      	     });
	    		},{"formurl":"biz_patapply_patform"});   
	  		},
	  	  //优先权
			  priorityChange:function(){
				  var that=this;
				  var priorityList= $("#priority-list"),
				  	priorityDate= $("input[name=priorityDate]"),
				  	prioritytxt=$(".priority-txt");
				  //添加优先权
				  $(".priority-addbtn").click(function(){
					  Patent.prioritylist.push({"patnum":prioritytxt.val(),"date":priorityDate.val()});  
					  console.log(Patent.prioritylist)  
					  priorityList.html(template('patent/priorityList',{list:Patent.prioritylist}));   
					  priorityDate.val("");
					  prioritytxt.val("");
				  });
				  //删除优先权
				  $("#priority-list").delegate('.priority-del-icon','click',function(){
					  Patent.prioritylist.splice($(this).attr("data-i"),1);       
					  priorityList.html(template('patent/priorityList',{list:Patent.prioritylist}));  
				  });
			  }  
	}	
	
	module.exports=Patent;	
})