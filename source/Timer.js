//#include Observer.js::base

/**
 * Фабрика объектов таймеров. Для каждого интервала создает лишь один экземпляр таймера. Можно вызывать как с
 * ключевым словом new, так и без него.
 * @param {Number} period Интервал таймера.
 * @return {Timer}
 */
var Timer = (function() {
    var timers = {};
    return function(period) {
        if (!timers[period]) {
            timers[period] = new Timer.Timer(period);
            timers[period].on('destroy', function() {
                timers[period] = null;
            });
        }
        return timers[period];
    }
})();

/**
 * @class Timer.Timer
 * @extends Object
 * Класс, экземпляры которого генерируют события через заданный промежуток времени. Не рекомендуется создавать
 * объекты напрямую, лучше использовать фабрику {@link Timer}, чтобы не плодить запуск функции setInterval.
 * Работа с событиями производится через класс {@link Observer}.
 */
Timer.Timer = Object.inherit({
    /**
     * @event timer
     * Генерируется через каждые period миллисекунд.
     */

    /**
     * @event destroy
     * Генерируется при вызове метода destroy.
     */

    /**
     * @constructor
     * @param {Number} period Количество миллисекунд, через которые генерируются события.
     */
    constructor: function(period) {
        this.period = period;
        new Observer().bind(this);
        this.onTimer();
    },

    /**
     * Убивает таймер и генерирует событие destroy, на которое подписана фабрика {@link Timer}, удаляющая
     * в этот момент этот таймер из кэша.
     */
    destroy: function() {
        clearTimeout(this.timeoutId);
        this.fireEvent('destroy');
    },

    /**
     * Вызывается по таймауту и генерирует событие timer.
     */
    onTimer: function() {
        this.fireEvent('timer');
        this.timeoutId = setTimeout(this.onTimer.bind(this), this.period);
    }
});

//#label deferForEach
/**
 * Перебирает элементы массива с задержкой после каждого элемента.
 * @param {Number} delay Задержка в миллисекундах.
 * @param {Function} fn Функция, вызываемая во время каждой итерации. Передаются элемент массива, индекс и сам массив.
 * Если вернет false, то обработка массива прекращается.
 * @param {Object} ctx Контекст вызова функций fn.
 * @return {Object} Объект с методом complete, которому передаются функция и контекст для её вызова, которая будет
 * вызвана по окончании перебора элементов.
 */
Array.prototype.deferForEach = function(delay, fn, ctx) {
    var i = 0, completed = false, onComplete, onCompleteCtx;

    function complete() {
        completed = true;
        if (typeof onComplete == 'function') {
            onComplete.call(onCompleteCtx);
        }
    }

    if (this.length) {
        new Timer(delay).on('timer', function(evt) {
            if (fn.call(ctx, this[i], i, this) === false || ++i >= this.length) {
                evt.target.un('timer', arguments.callee, this);
                complete();
            }
        }, this);
    } else {
        complete();
    }

    return {
        complete: function(fn, ctx) {
            if (completed) {
                fn.call(ctx);
            } else {
                onComplete = fn;
                onCompleteCtx = ctx;
            }
        }
    };
};
//#endlabel deferForEach