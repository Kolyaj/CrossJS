//#include lang/Function.js::inherit
//#include lang/Array.js::some

/**
 * @class Observer
 * @extends Object
 * Класс, предоставляющий интерфейс для генерации событий и для добавления слушателей. Нет никакого жесткого
 * списка событий, которые может генерировать данный класс. Типом события является обычная строка.
 * Подписчики вызываются в обратном порядке, в котором они были подписаны. Если в одном из обработчиков
 * произойдет ошибка, вызовется метод {@link Observer._handleListenerError} текущего обсервера, которому будет передан
 * объект ошибки, остальные обработчики будут вызваны в штатном режиме.
 * Подписчикам передается объект класса {@link Observer.Event}, обязательными свойствами которого являются
 * target (источник события) и name (имя события), а также метод stop, прерывающий дальнейшую обработку. Также
 * могут быть определены любые другие произвольные параметры, передаваемые из метода fireEvent.
 */
var Observer = Object.inherit({
    /**
     * @constructor
     */
    constructor: function() {
        this.Observer$listeners = {};
    },

    /**
     * Подписывает на событие.
     *
     * @param {String} name Имя события.
     * @param {Function} fn Фукнция, вызываемая при возникновении события.
     */
    addEventListener: function(name, fn) {
        this.Observer$listeners[name] = this.Observer$listeners[name] || [];
        this.Observer$listeners[name].unshift(fn);
    },

    /**
     * Отписка от события. Параметры должны быть в точности теми же, что и при подписке.
     * @param {String} name Имя события.
     * @param {Function} fn Подписанный обработчик.
     */
    removeEventListener: function(name, fn) {
        if (this.Observer$listeners[name]) {
            for (var i = 0; i < this.Observer$listeners.length; i++) {
                if (this.Observer$listeners[i] == fn) {
                    this.Observer$listeners.splice(i, 1);
                    return;
                }
            }
        }
    },

    /**
     * Посылает событие name с параметрами data.
     *
     * @param {String} name Имя события.
     * @param {Object} data Параметры, расширяемые передаваемый в обработчики объект события.
     *
     * @return {Boolean} false, если событие было остановлено, иначе true.
     */
    fireEvent: function(name, data) {
        if (this.Observer$listeners[name] || this.Observer$listeners['*']) {
            var evt = new Observer.Event(this, name, data);
            return !(this.Observer$listeners[name] || []).concat(this.Observer$listeners['*'] || []).some(function(fn) {
                try {
                    fn.call(this, evt);
                } catch (e) {
                    this._handleListenerError(e);
                }
                return evt.stopped;
            }, this);
        }
        return true;
    },

    /**
     * Обработчик ошибок, возникающих в подписчиках. По умолчанию бросает исключение в отдельном потоке, не
     * прерывая текущий. При желании можно переопределить данный метод, чтобы, например, логировать ошибки.
     *
     * @param {Error} err Объект ошибки.
     */
    _handleListenerError: function(err) {
        setTimeout(function() { throw err; }, 10);
    }
});

/**
 * @class Observer.Event
 * @extends Object
 *
 * Класс события, экземпляры которого передаются обработчикам.
 */
Observer.Event = Object.inherit({
    /**
     * @constructor
     * @param {Object} target Объект, в котором произошло событие
     * @param {String} name Имя события.
     * @param {Object} data Данные, передаваемые вместе с событием.
     */
    constructor: function(target, name, data) {
        Object.mixin(this, {
            /**
             * @property target
             * @type Object
             * Объект, в котором произошло событие.
             */
            target: target,

            /**
             * @property name
             * @type String
             * Имя события.
             */
            name: name
        }, data || {});
    },

    /**
     * Останавливает дальнейшую обработку события.
     */
    stop: function() {
        this.stopped = true;
    }
});