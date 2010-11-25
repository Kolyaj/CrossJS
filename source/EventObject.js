//#label getTarget
//#include Element.js::getParent
//#endlabel getTarget

//#label pointer
//#include document.js::getDocumentScroll::getRootElement
//#endlabel pointer

var EventObject = {};
(function(E) {
    //#label getTarget
    /**
     * Возвращает источник события. Если указан selector, то производится проход вверх по дереву в поисках
     * элемента удовлетворяющего селектору. Селектор передается в {@link $E#getParent}.
     * @param {String} selector Необязателен. Строка селектора.
     * @param {Number} depth Необязателен. Если указан, то поиск производится не глубже этого значения.
     * @return {Element} Найденный элемент или null, если ничего не найдено.
     */
    E.getTarget = function(selector, depth) {
        var target = this.target || this.srcElement;
        return arguments.length ? $E.getParent(target, selector, depth, true) : target;
    };
    //#endlabel getTarget

    //#label pointer
    /**
     * Возвращает позицию события мыши.
     * @return {Array} Массив целых чисел вида [left, top].
     */
    E.pointer = function() {
        var doc = (this.target || this.srcElement).ownerDocument, scroll = getDocumentScroll(doc), rootElem = getRootElement(doc);
        return [this.pageX || (this.clientX + scroll[0] - (rootElem.clientLeft || 0)) || 0,
                this.pageY || (this.clientY + scroll[1] - (rootElem.clientTop  || 0)) || 0];
    };
    //#endlabel pointer

    //#label stop
    /**
     * Останавливает всплытие события.
     */
    E.stop = function() {
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
    E.isLeftClick = function() {
        return (this.which && this.which == 1) || (this.button && this.button == 1);
    };
    //#endlabel isLeftClick
})(EventObject);