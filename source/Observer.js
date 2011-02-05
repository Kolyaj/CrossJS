//#include lang/Array.js::map::filter::some
//#include lang/Function.js::bind::inherit
//#include lang/Object.js::mixin

/**
 * @class Observer
 * @extends Object
 * Класс, предоставляющий интерфейс для генерации событий и для добавления слушателей. Нет никакого жесткого
 * списка событий, которые может генерировать данный класс. Типом события является обычная строка.
    obs.fireEvent('eventname');
 * Подписчики вызываются в обратном порядке, в котором они были подписаны. Если в одном из обработчиков
 * произойдет ошибка, вызовется метод {@link #errorHandler} текущего обсервера, которому будет передан
 * объект ошибки, остальные обработчики будут вызваны в штатном режиме.
 * Подписчикам передается объект класса {@link Observer.Event}, обязательными свойствами которого являются
 * target (источник события) и name (имя события), а также метод stop, прерывающий дальнейшую обработку. Также
 * могут быть определены любые другие произвольные параметры, передаваемые из метода fireEvent.
 * Для добавления функциональности обсервера любому классу или объекту предназначен метод {@link bind}, после
 * вызова которого у соответствующего объекта появляются методы on, un и fireEvent. Таким образом необязательно
 * наследовать классы от Observer, а достаточно в конструкторе вызвать код
    new Observer().bind(this);
 */
var Observer = Object.inherit({
    _paramNames: ['ctx', 'args', 'single'],

    /**
     * @constructor
     * @param {Object} listeners Необязательный параметр, содержащий список событий и параметров. Передается
     * методу {@link on}.
     */
    constructor: function(listeners) {
        this._listeners = {};
        this._paramsRegex = new RegExp('^(' + this._paramNames.join('|') + ')$', 'i');
        this.on(listeners || {});
    },

    /**
     * Подписывает на событие. Если первым параметром передан объект, то все его методы будут подписчиками
     * на события, соответствующие их ключам, а весь объект будет передан, как параметры подписки. Например,
     obs.on({
        event1: function1,
        event2: function2,
        ctx: obj
     });
     * При такой подписке, на событие event1 будет вызвана функция funciton1 в контексте obj, на событие event2
     * будет вызвана функция function2 в контексте obj.
     * @param {String/Object} name Имя события.
     * @param {Function} fn Фукнция, вызываемая при возникновении события. Последним параметров сюда всегда
     * передается объект события, остальные параметры зависят от свойства args четвертого аргумента.
     * @param {Object} ctx Контекст вызова функции fn.
     * @param {Object} params Параметры:
     *  <ul>
     *      <li>ctx - контекст вызова обработчика.</li>
     *      <li>single - если установлен, то данный обработчик вызывается лишь единожды.</li>
     *      <li>args - массив имен параметров, которые необходимо извлечь из объекта события и передать
     *          обработчику. Например, если args установлен в ['name', 'target'], то первым параметром в
     *          обработчик события будет передано имя события, вторым -- источник, а третьим -- сам объект
     *          события.</li>
     *  </ul>
     */
    on: function(name, fn, ctx, params) {
        params = params || {};
        if (typeof name == 'object') {
            for (var i in name) {
                if (name.hasOwnProperty(i) && !this._paramsRegex.test(i) && typeof name[i] == 'function') {
                    this.on(i, name[i], null, name);
                }
            }
        } else {
            params.ctx = ctx || params.ctx;
            this._listeners[name] = this._listeners[name] || [];
            this._listeners[name].unshift([fn, params]);
        }
    },

    /**
     * Отписка от события. Параметры должны быть в точности теми же, что и при подписке. Также возможна передача
     * первым параметром объекта, аналогично вызову {@link on}.
     * @param {String/Object} name Имя события.
     * @param {Function} fn Подписанный обработчик.
     * @param {Object} ctx Контекст вызова.
     * @param {Object} params Параметры, аналогичные параметрам, передаваемым в {@link on}.
     */
    un: function(name, fn, ctx, params) {
        params = params || {};
        if (typeof name == 'object') {
            for (var i in name) {
                if (name.hasOwnProperty(i) && !this._paramsRegex.test(i) && typeof name[i] == 'function') {
                    this.un(i, name[i], null, name);
                }
            }
        } else {
            if (this._listeners[name]) {
                params.ctx = ctx || params.ctx;
                this._listeners[name] = this._listeners[name].filter(function(listener) {
                    return listener[0] != fn || !this._paramsEquals(listener[1], params);
                }, this);
            }
        }
    },

    /**
     * Посылает событие name с параметрами data.
     * @param {String} name Имя события.
     * @param {Object} data Параметры, расширяемые передаваемый в обработчики объект события.
     * @return {Boolean} false, если событие было остановлено, иначе true.
     */
    fireEvent: function(name, data) {
        if (this._listeners[name] || this._listeners['*']) {
            var evt = new Observer.Event(this.target || this, name, data);
            return !(this._listeners[name] || []).concat(this._listeners['*'] || []).some(function(listener) {
                try {
                    var fn = listener[0], options = listener[1];
                    var args = (options.args || []).map(function(arg) {
                        return evt[arg];
                    }, this);
                    args.push(evt);
                    fn.apply(options.ctx || evt.target, args);
                    if (options.single) {
                        this.un(name, fn, null, options);
                    }
                } catch (e) {
                    this.errorHandler(e);
                }
                return evt.stopped;
            }, this);
        }
        return true;
    },

    /**
     * Ассоциировать данный обсервер с объектом object. После выполнения фунции у object появляются методы
     * on, un и fireEvent.
     * @param {Object} object Расширяемый объект.
     */
    bind: function(object) {
        this.target = object;
        object.on = this.on.bind(this);
        object.un = this.un.bind(this);
        object.fireEvent = this.fireEvent.bind(this);
    },

    /**
     * Обработчик ошибок, возникающих в подписчиках. По умолчанию бросает исключение в отдельном потоке, не
     * прерывая текущий. При желании можно переопределить данный метод, чтобы, например, логировать ошибки.
     * @param {Error} e Объект ошибки.
     */
    errorHandler: function(e) {
        setTimeout(function() { throw e; }, 10);
    },

    _paramsEquals: function(p1, p2) {
        return (!p1.ctx && !p2.ctx) || p1.ctx == p2.ctx;
    }
});

/**
 * @class Observer.Event
 * @extends Object
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