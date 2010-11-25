//#label mixin
/**
 * Копирует свойства из всех аргументов, начиная со второго, в dst.
 * @param {Object} dst Объект, в который копируются свойства.
 * @return {Object} Объект dst.
 */
Object.mixin = function(dst) {
    for (var i = 1; i < arguments.length; i++) {
        for (var prop in arguments[i]) {
            if (arguments[i].hasOwnProperty(prop)) {
                dst[prop] = arguments[i][prop];
            }
        }
    }
    return dst;
};
//#endlabel mixin

//#label keys
if (!Object.keys) {
    /**
     * Возвращает массив ключей объекта. В результирующем массиве присутствуют только те ключи, которые имеются
     * в самом объекте, а не в цепочке прототипов.
     * @param {Object} obj
     * @return {Array}
     */
    Object.keys = function(obj) {
        var keys = [];
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                keys.push(name);
            }
        }
        return keys;
    };
}
//#endlabel keys