//#include lang/Array.js::forEach

/**
 * Возвращает имя и значение CSS свойства, актуальное для текущего браузера. Свойство opacity, например, для IE
 * преобразует в filter:Alpha(...). В данный момент поддерживаются: opacity, float, boxShadow.
 * Потенциально обрабатываемых свойств может быть много, поэтому для уменьшения объёма кода лучше подключать
 * только необходимые блоки.
 *
 * @param {String} name Имя свойства.
 * @param {String} value Значение свойства.
 * @param {Node} [el] DOM-элемент, которому будет присваиваться свойство. Актуально только для свойства float,
 *      т.к. в свойстве style оно имеет имя cssFloat/styleFloat.
 *
 * @return {Array} Массив с двумя элементами: имя и значение.
 */
function normalizeCSSProperty(name, value, el) {
    var etalon = el ? el.style : document.documentElement.style;

    //#label opacity
    if (name == 'opacity' && typeof etalon['filter'] == 'string') {
        return ['filter', value == 1 ? '' : 'Alpha(opacity=' + (value * 100) + ')'];
    }
    //#endlabel opacity

    //#label float
    if (/^float|(style|css)Float$/.test(name)) {
        name = 'float';
        if (el) {
            name = typeof etalon['cssFloat'] == 'string' ? 'cssFloat' : 'styleFloat';
        }
        return [name, value];
    }
    //#endlabel float

    //#label boxShadow
    if (name == 'boxShadow') {
        ['boxShadow', 'MozBoxShadow', 'WebkitBoxShadow'].forEach(function(property) {
            if (typeof etalon[property] == 'string') {
                name = property;
            }
        });
        return [name, value];
    }
    //#endlabel boxShadow

    return [name, value];
}