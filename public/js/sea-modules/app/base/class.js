/**
 * 
 */
define(function(require,exports,module){
var Class = function (parent, properties) {

    if (!isFunction(parent)) {
        properties = parent;
        parent = null;
    }

    var klass = function () {

        //调用实例初始化方法
        if (this.init && klass.prototype.hasOwnProperty('init')) {
            this.init.apply(this, arguments);
        }

        //从其他类混入属性
        if (this.include && klass.prototype.hasOwnProperty('include')) {
            mix(this.include, klass.prototype);
        }
    };

    //继承父类
    if (parent) {

        var subClass = function () { };
        subClass.prototype = parent.prototype;
        klass.prototype = new subClass;
        klass.prototype.constructor = klass;

        klass._super = parent.prototype;
    }

    //扩展实例属性
    klass.include = function (properties) {

        for (var p in properties) {
            if (properties.hasOwnProperty(p)) {
                klass.prototype[p] = properties[p];
            }
        }
    };

    //混入属性
    if (properties) {
        klass.include(properties);
    }

    //扩展子类
    klass.extend = function (properties) {
        return new Class(klass, properties);
    };

    return klass;
};



//复制属性
function mix(includes, receiver) {
    if (isArray(includes)) {
        var i, l;
        for (i = 0, l = includes.length; i < l; i++) {
            copyProperties(includes[i]);
        }
    } else {
        copyProperties(includes);
    }

    function copyProperties(include) {
        var giver = isFunction(include) ? include.prototype : include;
        for (var p in giver) {
            if (giver.hasOwnProperty(p)) {
                receiver[p] = giver[p];
            }
        }
    }
}

//helper
var toString = Object.prototype.toString;

function isFunction(val) {
    return toString.call(val) === '[object Function]';
}

var isArray = Array.isArray || function (val) {
    return toString.call(val) === '[object Array]';
}
 module.exports=Class;
})