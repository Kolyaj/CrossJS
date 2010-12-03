//#label inherit
//#include Object.js::mixin
//#endlabel inherit

/**
 * @class Function
 * Методы, расширяющие прототип Function.
 */
(function(Function_prototype) {
    //#label bind
    /**
     * Создает функцию, вызывающую оригинальную функцию в нужном контексте с нужными параметрами.
function foo(a, b, c, d, e, f) {
    alert([this[a], this[b], this[c], this[d], this[e], this[f]]);
}
var a = [1, 2, 3, 4, 5, 6];
var bar = foo.bind(a, 0, 1, 2);
bar(3, 4, 5);    // Выведет [1, 2, 3, 4, 5, 6]
     * @param {Object} ctx Объект, в контексте которого будет вызываться функция.
     * @return {Function} Новая функция.
     */
    Function_prototype.bind = function(ctx) {
        var that = this, args = [].slice.call(arguments, 1);
        return function() {
            return that.apply(ctx || this, args.concat([].slice.call(arguments, 0)));
        };
    };
    //#endlabel bind

    //#label debounce
    /**
     * Вызывает функцию с задержкой delay в контексте ctx. Если во время задержки функция была вызвана еще
     * раз, то предыдующий вызов отменяется, а таймер обновляется. Таким образом из нескольких вызовов,
     * совершающихся чаще, чем delay, реально будет вызван только последний.
     * @param {Number} delay
     * @param {Object} ctx
     */
    Function_prototype.debounce = function(delay, ctx) {
        var fn = this, timer;
        return function() {
            var args = arguments, that = this;
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(ctx || that, args);
            }, delay);
        };
    };
    //#endlabel debounce

    //#label throttle
    /**
     * Вызывает оригинальную функцию не чаще delay в контексте ctx. В отличие от {@link #debounce} первый вызов
     * происходит сразу.
     * @param delay
     * @param ctx
     */
    Function_prototype.throttle = function(delay, ctx) {
        var fn = this, timer, args, that;
        return function() {
            args = arguments;
            that = this;
            if (!timer) {
                (function() {
                    timer = null;
                    if (args) {
                        fn.apply(ctx || that, args);
                        args = null;
                        timer = setTimeout(arguments.callee, delay);
                    } 
                })();
            }
        };
    };
    //#endlabel throttle

    //#label defer
    /**
     * Вызывает функцию указанное количество миллисекунд в контексте ctx с аргументами args.
     * @param {Number} millis
     * @param {Object} ctx
     * @param {Array} args
     * @return {Number} Идентификатор таймаута.
     */
    Function_prototype.defer = function(millis, ctx, args) {
        var that = this;
        return window.setTimeout(function() {
            that.apply(ctx, args || []);
        }, millis);
    };
    //#endlabel defer

    //#label inherit
    /**
     * Создаёт конструктор, прототип которого наследует прототип текущего конструктора.
     * Для создания ничего не наследующего конструктора следует использовать Object.inherit({...}).
     * @param {Object} proto Объект с методами и свойствами, копирующимися в прототип создаваемого конструктора.
     * @return {Function} Созданный конструктор.
     */
    Function_prototype.inherit = function(proto) {
        var that = this;
        proto = proto || {};
        var constructor = proto.hasOwnProperty('constructor') ? proto.constructor : function() { that.apply(this, arguments); };
        var F = function() {};
        F.prototype = this.prototype;
        constructor.prototype = Object.mixin(new F(), proto);
        constructor.superclass = this.prototype;
        constructor.prototype.constructor = constructor;
        return constructor;
    };
    //#endlabel inherit
})(Function.prototype);