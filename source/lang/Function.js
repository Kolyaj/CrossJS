/**
 * @class Function
 * Методы, расширяющие прототип Function.
 */
(function(F) {
    //#label bind
    /**
     * Создает функцию, вызывающую оригинальную функцию в нужном контексте с нужными параметрами.
function foo(a, b, c, d, e, f) {
    alert([this[a], this[b], this[c], this[d], this[e], this[f]]);
}
var a = [1, 2, 3, 4, 5, 6];
var bar = foo.bind(a, 0, 1, 2);
bar(3, 4, 5);    // Выведет [1, 2, 3, 4, 5, 6]
     * @param {Object} scope Объект, в контексте которого будет вызываться функция.
     * @return {Function} Новая функция.
     */
    F.bind = function(scope) {
        var that = this, args = [].slice.call(arguments, 1);
        return function() {
            return that.apply(scope || this, args.concat([].slice.call(arguments, 0)));
        };
    };
    //#endlabel bind

    //#label debounce
    /**
     * Вызывает функцию с задержкой delay в контексте scope. Если во время задержки функция была вызвана еще
     * раз, то предыдующий вызов отменяется, а таймер обновляется. Таким образом из нескольких вызовов,
     * совершающихся чаще, чем delay, реально будет вызван только последний.
     * @param {Number} delay
     * @param {Object} scope
     */
    F.debounce = function(delay, scope) {
        var fn = this, timer, args, that;
        return function() {
            args = arguments;
            that = this;
            if (timer)
                clearTimeout(timer);
            timer = setTimeout(function() {
                timer = null;
                fn.apply(scope || that, args);
            }, delay);
        };
    };
    //#endlabel debounce

    //#label throttle
    /**
     * Вызывает оригинальную функцию не чаще delay в контексте scope. В отличие от {@link #debounce} первый вызов
     * происходит сразу.
     * @param delay
     * @param scope
     */
    F.throttle = function(delay, scope) {
        var fn = this, timer, args, that;
        return function() {
            args = arguments;
            that = this;
            if (!timer) {
                (function() {
                    timer = null;
                    if (args) {
                        fn.apply(scope || that, args);
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
     * Вызывает функцию указанное количество миллисекунд в контексте scope с аргументами args.
     * @param {Number} millis
     * @param {Object} scope
     * @param {Array} args
     */
    F.defer = function(millis, scope, args) {
        var that = this;
        window.setTimeout(function() {
            that.apply(scope, args || []);
        }, millis);
    };
    //#endlabel defer
})(Function.prototype);