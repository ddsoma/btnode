define(function(require, exports, module) {
	var select = require("../util/select.js"),
	Patent = require("../util/patent.js");
	var template=require("../../tpl/patent");
	require("$");	
	var WdatePicker=require("datapicker");
	var patent = new Patent();
	
	$.pjax({
		  url: '/authors',
		  container: '#main'
		})
	//下拉
	select(function(t) {
		if (t.attr("data-type") == "in-ana") {
			patent.inanaInit();
		} else if (t.attr("data-type") == "patcontacter") {
			patent.contacterInit();
		}
	});
	
	//联系人选择
	$("body").delegate("#patcontacter-cont li", "click", function(e) {
		patent.changeContacter($(this).html());
		e.stopPropagation();
	}).delegate(".patcontacter-add", 'click', function() {
		patent.contacterAdd();
	})
	
	//发明人选择
	$("body").delegate("#in-ana-cont li", "click", function(e) {
		patent.inanaChange($(this));
		e.stopPropagation();
	}).delegate(".in-ana-add", 'click', function() {
		patent.inanaAdd();
	}).delegate("#prioritychk",'click',function(){//优先权
		var checked = $(this).prop("checked");		
		patent.priorityChange();		
		if (checked) {
			$(".priority-cont").show();
		} else {
			$(".priority-cont").hide();
		}
	}).delegate("#priorityDate",'focus',function(){			
		WdatePicker({skin:'whyGreen',maxDate:'%y-%M-%d'});
	})	
	
	var tabBtn = $(".cd-tab-btn"), tabloading = {}, pfilebtn = $(".cd-pfiletab-btn");
	stab = $(".cd-tab-sbtn"), stabid = $(".cd-tab-sbtn").attr("data-type");

	tTemplate(stab, "ui-case-liselected");
	$("#" + stabid).show();

	tabBtn.click(function() {
		var self = $(this);
		tTemplate(self, "cd-tab-sbtn");
	});
	pfilebtn.click(function() {
		var self = $(this);
		tTemplate(self, "ui-case-liselected");
	})

	function tTemplate(self, sclass) {
		if (!self.hasClass(sclass)) {
			tabBtn.removeClass(sclass);
			self.addClass(sclass);
			$(".cd-tab").hide();
			var selftype = self.attr("data-type"), selftab = $("#" + selftype);
			if (selftype == "pfile" || selftype == "myfile"
					|| selftype == "agentfile") {
				selftab = $("#pfile");
				selftab.parent().show();
				selftab.html(template($(".ui-case-liselected")  
						.attr("data-type"), {
					list : {}
				}))
			} else {
				selftab.show();				
				selftab.html(template(selftype , {             
					list : {}
				}))
			}
		}
	}

	// 查看文件详情
	$("#file-a").click(function() {
		patent.ofilepic();
	})
})