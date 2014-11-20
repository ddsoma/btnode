define(function(require,exports,module){
	
	require("$");
	require("gallery/template/template.min.js");
	var getChirdAreaUrl = "/area_getarea",
		getCityAreaUrl = "/area_getcityarea",
		getTownAreaUrl = "/area_gettownarea",
		templateId = "area-template",
		paramType = "name",
		provinceObj = "#area-province",
		cityObj = "#area-city",
		townObj = "#area-town",
		province = "province",
		city = "city",
		town = "town",
		areaInputObj = "#areaInput",
		areaObj = "#area";
	
	/**
	 * 获取省级下拉Html
	 * currentName :当前省份名称（编辑时使用）
	 * callback :回调函数
	 */
	var getProvinceHtml = function(currentName,callback){
		var params = [];
		var provinceJson = getAreaJson(getChirdAreaUrl,params,paramType,function(result){
			var templateJson = {id:province,name:province,currentName:currentName,dataList:eval(result)};
			if(typeof callback === 'function'){
				callback(template(templateId,templateJson));
			}
		})
	};
	
	/**
	 * 获取市级下拉Html
	 * area :获取市级下拉关键参数（type为id时为省级id,type为name时为省级区域名称）
	 * currentName :当前市级名称（编辑时使用）
	 * type :(null:返回数据下拉,id:通过省级区域ID获取市级区域下拉,name:通过省级区域名称获取市级区域下拉)
	 * callback :回调函数
	 */
	var getCityHtml = function(area,currentName,type,callback){
		if(type === "null"){
			var templateJson = {id:city,name:city,currentName:currentName,dataList:""};
			if(typeof callback === 'function'){
				callback(template(templateId,templateJson));
			}
		}else{
			var params = [area];
			var url = type === "id" ? getChirdAreaUrl : getCityAreaUrl;
			var cityJson = getAreaJson(url,params,type,function(result){
				var templateJson = {id:city,name:city,currentName:currentName,dataList:eval(result)};
				if(typeof callback === 'function'){
					callback(template(templateId,templateJson));
				}
			})
		}
	};
	
	/**
	 * 获取区级下拉Html
	 * area :获取区级下拉关键参数（type为id时为市级id,type为name时为省级和区级区域名称数组）
	 * currentName :当前区级名称（编辑时使用）
	 * type :(null:返回数据下拉,id:通过市级区域ID获取区级区域下拉,name:通过省级和区级区域名称获取区级区域下拉)
	 * callback :回调函数
	 */
	var getTownHtml = function(area,currentName,type,callback){
		if(type === "null"){
			var templateJson = {id:town,name:town,currentName:currentName,dataList:""};
			if(typeof callback === 'function'){
				callback(template(templateId,templateJson));
			}
		}else{
			var params = toString.call(area) === '[object Array]' ?area :[area];
			var url = type === "id" ? getChirdAreaUrl : getTownAreaUrl;
			var townJson = getAreaJson(url,params,type,function(result){
				var templateJson = {id:town,name:town,currentName:currentName,dataList:eval(result)};
				if(typeof callback === 'function'){
					callback(template(templateId,templateJson));
				}
			})
		}
	};
	
	/**
	 * 获取区域json
	 * url :请求地址
	 * params :当参数个数小于等于0时表示获取省级下拉数据
	 * 		   当参数个数等于1时表示获取子集下拉（当type为id时表示通过id获取区域数据，type为name时表示通过区域名称获取区域数据）	
	 * 		   当参数个数等于2时表示通过省级区域名称和市级区域名称获取区级下拉数据
	 * callback :回调函数
	 */
	var getAreaJson = function(url,params,type,callback){
		var data;
		if(params.length < 0){
			data = {param:0};
		}else if(params.length === 1){
			data = type === "id"?{id:params[0]}:{provinceName:params[0]};
		}else if(params.length === 2){
			data = {provinceName:params[0],cityName:params[1]};
		}
		$.post(url + "?t=" + new Date().getMilliseconds(),data,function(result){
			if(typeof callback === 'function'){
				callback(result);
			}
		});
	};
	
	/**
	 * 显示下拉
	 * type :区分添加还是编辑(add:添加,edit:编辑)
	 */
	exports.show = function(type){
		if(type === "add"){
			getProvinceHtml("",function(html){
				$(provinceObj).html(html);
			});
			getCityHtml("","","null",function(html){
				$(cityObj).html(html);
			});
			getTownHtml("","","null",function(html){
				$(townObj).html(html);
			});
		}else if(type === "edit"){
			var provinceName = $(areaObj).attr("data-province"),
			    cityName = $(areaObj).attr("data-city"),
			    townName = $(areaObj).attr("data-town");
			getProvinceHtml(provinceName,function(html){
				$(provinceObj).html(html);
			});
			getCityHtml(provinceName,cityName,"name",function(html){
				$(cityObj).html(html);
			});
			var areaParams = [provinceName,cityName];
			getTownHtml(areaParams,townName,"name",function(html){
				$(townObj).html(html);
			});
		}
	};
	
	/**
	 * html select下拉
	 */
	exports.selectEvent = function(){
		$('body').delegate("#area-province option","click",function(){
			alert("3");
			$(areaInputObj).val("");
			var selectOptionValue = $.trim($(this).val());
			if(selectOptionValue != ""){
				getCityHtml(selectOptionValue,"","id",function(html){
					$(cityObj).html(html);
				});
			}else{
				getCityHtml("","","null",function(html){
					$(cityObj).html(html);
				});
			}
			getTownHtml("","","null",function(html){
				$(townObj).html(html);
			});
		});
		$(cityObj).delegate("option","click",function(){
			$(areaInputObj).val("");
			var selectOptionValue = $.trim($(this).val());
			if(selectOptionValue != ""){
				getTownHtml(selectOptionValue,"","id",function(html){
					$(townObj).html(html);
				});
			}else{
				getTownHtml("","","null",function(html){
					$(townObj).html(html);
				});
			}
		});
		$(townObj).delegate("option","click",function(){
			$(areaInputObj).val($.trim($(this).val()));
			if($.trim($(this).val()) != ""){
				$(this).parents(".modal-f-item").find(".error").remove();
			}else{
				$("#validateForm").submit();
			}
		});
	};
	
	
});