//#include_once "core.js::apply"
/**
 * @class Class
 * Namespace с функциями для создания и наследования классов.
 * @singleton
 */
var Class = {
    /**
     * Создание класса. Создает конструктор класса, который при запуске проверяет наличие в this
     * метода init, при нахождении которого передает управление ему. В результате конструктором можно
     * считать метод init. Прототипом созданного класса устанавливает переданный аргумент.
     * @param {Object} proto Прототип класса.
     * @return {Function} Конструктор класса.
     */
    create: function(proto) {
        var klass = function() {
            if (typeof this.init == 'function')
                this.init.apply(this, arguments);
        };
        klass.prototype = proto || {};
        return klass;
    },

    //#label singleton
    /**
     * Создает синглтон, конструктором которого является метод init. Получение экземпляра класса доступно
     * как с помощью ключевого слова new, так и без него.
var S = Class.singleton({
    init: function() {

    },

    method: function() {

    }
});
var s1 = new S();
alert(S() === s1);   // true
     * @param {Object} proto Прототип синглтона.
     * @return {Function} Конструктор синглтона.
     */
    singleton: function(proto) {
        var that = this, instance;
        return function() {
            return instance = instance || new (that.create(proto))();
        };
    },
    //#endlabel singleton

    /**
     * Создание класса, наследованного от baseClass с прототипом proto.
     * @param {Function} baseClass Базовый класс.
     * @param {Object} proto Прототип создаваемого класса.
     * @return {Function} Конструктор наследованного класса.
     */
    extend: function(baseClass, proto) {
        var F = function() {};
        F.prototype = baseClass.prototype;
        var klass = Class.create(apply(new F(), proto || {}));
        klass.superclass = baseClass.prototype;
        return klass;
    }
};