define(function(require,exports,module){
  require("$");
var Class= require("../base/class");
var BLUIDialog = new Class({
    init: function(options) {
    	var t=this;
           this.w =(options&&options.width)||this.settting.width;
           this.h = (options && options.height) || this.settting.height;
           this.isBg = this.settting.isBg;
           if (options && typeof options.isBg == "boolean") {
               this.isBg = options.isBg;
           }
           this.errorMsg = (options && options.errorMsg) || this.settting.errorMsg;
      var position="position:fixed;"
      if(this.h>650){
    	   position = "position:absolute;"  
      }  
      var dialogHtml = '<div class="modal-win" style="'+ position +'width:' + this.w + 'px;height:' + this.h + 'px;">' +
       '<div class="modal-close" title="关闭"></div>' +
       '<div class="modal-content"></div>' +
       '</div>';
        
        if (this.isBg) {
            dialogHtml = '<div class="modal-bg"></div>' + dialogHtml;
        }
        
        this.close();
        $("body").append(dialogHtml);
        $("body").delegate(".modal-f-cancelBtn,.dialog-cancle", "click", function () {
        	 t.close();
        });
        this.position().closeClick().reisze();
        return this;
    },
    settting: {
        width: 200,
        height: 200,
        errorMsg: "非常抱歉，请求出错 ; )",
        appendDom: $("body"),
        defaultMsg: "您好，你可以添加自己的内容",
        isBg:true
    },
    
    open: function (content, callback) {
        if (typeof content != "string") {
            callback = content;
            content = this.settting.defaultMsg;
        }

        this.dhtml(content, callback);
        return this;
    },
    
    openajax: function(url,callback,data) {
        var ajaxloading = '<img class="modal-loading" src="../frontlib/content/style/blui/images/loading.gif" />',
            ajaxContent = "缺少url引用", t = this;
        
        if (typeof url === "string") {
            t.dhtml(ajaxloading).position();  
            $.ajax({
                url: url,
                type: "post",
                data:data,
                success: function(data) {                	
                    t.dhtml(data, callback);
                },
                error: function() {                	
                    t.dhtml(t.errorMsg);
                }
            });
        } else {
            t.dhtml(ajaxContent);
        }
       
        return this;
    },
    
    dhtml:function(content,callback) {
        $(".modal-content").html(content);
        
        if (typeof callback == "function") {
            callback(this);
        }
        return this;
    },
    
    closeClick: function () {
        var t = this;
        $("body").delegate(".modal-close", "click", function () {
            t.close();
        });
        return this;
    },
    

    close: function () {
        var _body = $("body");
        _body.children("div.modal-bg").remove();
        _body.children("div.modal-win").remove();
    },  
    
    showMsg: function (type, msg, callback) {
        var c = "modal-success-icon",
            m = "我是默认的消息提示",
            t = arguments[0] || 1,
            length = arguments.length;
            
        if (typeof t != "number") {
            callback = msg;
            msg = t;
            t = 1;
        }
        
        if (typeof msg == "function") {
            callback = msg;
        }

        if (typeof t == "number") {
            if (t == 2) {
                c = "modal-warn-icon";
            }
            if (t == 3) {
                c = "modal-error-icon";
            }
        }

        var msgHtml = "<div class='modal-msg " + c + "'>" + m + "</div>";
        this.dhtml(msgHtml);

       if (typeof callback=="function") {
           callback();
       }

    },
    
    position: function() {
        var win = $(window),
              winWidth = win.width(),
              winHeigh = win.height(),
              top = (winHeigh - this.h) / 2,
              left = (winWidth - this.w) / 2;
        if (top <= 0) {
            top = 10;
        }
        if (left <= 0) {
            left = 10;
        }
        $(".modal-win").css({ top: top, left: left + "px" });
      
        $(".modal-win .modal-loading").css({ top: (this.h / 2 - 32) + "px", left: (this.w / 2 - 32) + "px" });
        return this;
    },
    reisze: function () {
        var t = this;
        $(window).bind("resize", function () {
            t.position();
        }); 
    }
	})

module.exports=BLUIDialog;
});