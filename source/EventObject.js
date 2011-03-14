var EventObject = {};

//#label getTarget
//#include dom.js::getElementParent
/**
 * Возвращает источник события. Если указан selector, то производится проход вверх по дереву в поисках
 * элемента удовлетворяющего селектору. Селектор передается в {@link getElementParent}.
 *
 * @param {String} [selector] Строка селектора.
 * @param {Number} [depth] Если указан, то поиск производится не глубже этого значения.
 *
 * @return {Node} Найденный элемент или null, если ничего не найдено.
 */
EventObject.getTarget = function(selector, depth) {
    var target = this.target || this.srcElement;
    return arguments.length ? getElementParent(target, selector, depth, true) : target;
};
//#endlabel getTarget

//#label getPoint
//#include dom.js::getDocumentScroll::getRootElement
/**
 * Возвращает позицию события мыши.
 *
 * @return {Array} Массив целых чисел вида [left, top].
 */
EventObject.getPoint = function() {
    var doc = (this.target || this.srcElement).ownerDocument, scroll = getDocumentScroll(doc), rootElem = getRootElement(doc);
    return [this.pageX || (this.clientX + scroll[0] - (rootElem.clientLeft || 0)) || 0,
            this.pageY || (this.clientY + scroll[1] - (rootElem.clientTop  || 0)) || 0];
};
//#endlabel getPoint

//#label stop
/**
 * Останавливает всплытие события.
 */
EventObject.stop = function() {
    if (this.preventDefault) {
        this.preventDefault();
        this.stopPropagation();
    } else {
        this.returnValue = false;
        this.cancelBubble = true;
    }
};
//#endlabel stop

//#label isLeftClick
/**
 * Возвращает true, если нажата левая кнопка мыши.
 *
 * @return {Boolean}
 */
EventObject.isLeftClick = function() {
    return (this.which && this.which == 1) || (this.button && this.button == 1);
};
//#endlabel isLeftClick
