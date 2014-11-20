/*图片懒加载*/
define(function (require, exports, module) {

    //options.src 为img图片地址属性 
    //option.time 为加载图片的延时
    var LazyLoad = function (options) {
        var defaults = (arguments.length == 0) ? { src: 'xSrc', time: 100, context: ".imgscrolling"} :
        { src: options.src || 'xSrc', time: options.time || 100, context: ".imgscrolling" };
        var camelize = function (s) {
            return s.replace(/-(\w)/g, function (strMatch, p1) {
                return p1.toUpperCase();
            });
        };
        this.getStyle = function (element, property) {
            if (arguments.length != 2) return false;
            var value = element.style[camelize(property)];
            if (!value) {
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    var css = document.defaultView.getComputedStyle(element, null);
                    value = css ? css.getPropertyValue(property) : null;
                } else if (element.currentStyle) {
                    value = element.currentStyle[camelize(property)];
                }
            }
            return value == 'auto' ? '' : value;
        };
        var _init = function () {

            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

            var offsetPage = window.pageYOffset ? window.pageYOffset : scrollTop,
                offsetWindow = offsetPage + Number(window.innerHeight ? window.innerHeight : document.documentElement.clientHeight),
                docImg = $(defaults.context),
                _len = docImg.length;

            if (!_len) return false;
            for (var i = 0; i < _len; i++) {
                var attrSrc = docImg[i].getAttribute(defaults.src),
                    o = docImg[i], tag = o.nodeName.toLowerCase();
                if (o) {
                    postPage = o.getBoundingClientRect().top + scrollTop;
                    postWindow = postPage + Number(this.getStyle(o, 'height').replace('px', ''));
                    if ((postPage > offsetPage && postPage < offsetWindow) || (postWindow > offsetPage && postWindow < offsetWindow)) {
                        if (tag === "img" && attrSrc !== null) {
                            o.setAttribute("src", attrSrc);
                            $(o).removeClass("imgscrolling");
                        }
                        o = null;
                    }
                }
            }
        };

        window.onscroll = function () {
            setTimeout(function () {
                _init();
            }, defaults.time);
        };
        return _init();
    };
    module.exports = LazyLoad;
})