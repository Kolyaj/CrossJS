/**
 * @class XMLHttpRequest
 * Эмуляция XMLHttpRequest для IE, в результате которой работа с XHR во всех браузерах становится абсолютно
 * одинаковой (за исключением багов).
 */
var XMLHttpRequest = XMLHttpRequest || window.ActiveXObject && function() {
    return new ActiveXObject('Msxml2.XMLHTTP');
};