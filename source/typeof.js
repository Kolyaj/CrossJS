//#label isArray
/**
 * Возвращает true, если переданный аргумент является массивом, иначе false.
 * @param {Mixed} obj
 * @return {Boolean}
 */
function isArray(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
}
//#endlabel isArray

//#label isDate
/**
 * Возвращает true, если переданный аргумент является объектом даты, иначе false.
 * @param {Mixed} obj
 * @return {Boolean}
 */
function isDate(obj) {
    return Object.prototype.toString.call(obj) == '[object Date]';
}
//#endlabel isDate

//#label isRegExp
/**
 * Возвращает true, если переданный аргумент является регулярным выражением, иначе false.
 * @param {Mixed} obj
 * @return {Boolean}
 */
function isRegExp(obj) {
    return Object.prototype.toString.call(obj) == '[object RegExp]';
}
//#endlabel isRegExp