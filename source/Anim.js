//#include_once "lang/Array.js::forEach::filter"
//#include_once "Component.js::base"
//#include_once "typeof.js::isArray"
//#include_once "Element.js::setStyle"

var Anim = Class.extend(Component, {
    duration: 500,
    delay: 20,
    items: [],

    strategy: function(x) {
        return x;
    },
    
    initComponent: function() {
        Anim.superclass.initComponent.apply(this, arguments);
        if (!isArray(this.items)) {
            this.items = [this.items];
        }
        this.items = this.items.filter(function(item) {
            return item.el;
        });
    },

    run: function(fn, scope) {
        var iterCount = this.duration / this.delay, delta = 1 / iterCount, i = 0, that = this;
        (function() {
            var value = that.strategy(Math.min(1, i * delta));
            that.items.forEach(function(item) {
                var style = {};
                for (var name in item.styles) {
                    var s = item.styles[name];
                    style[name] = ((s[1] - s[0]) * value + s[0]) + (s[2] || '');
                }
                $E.setStyle(item.el, style);
            });
            if (i < iterCount) {
                i++;
                setTimeout(arguments.callee, that.delay);
            } else {
                if (typeof fn == 'function') {
                    fn.call(scope);
                }
            }
        })();
    }
});