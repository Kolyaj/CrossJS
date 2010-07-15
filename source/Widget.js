//#include_once "core.js::$$"
//#include_once "Component.js::base"
//#include_once "lang/String.js::format"
//#include_once "Element.js::on::un::remove"

/**
 * @class Widget
 * @extend Component
 * Компонент-заготовка для создания виджетов. Обеспечивает создание DOM-элемента, присвоение ему CSS-класса,
 * заполнение его HTML-кодом и добавление его в DOM-дерево, если требуется.
 */
var Widget = Component.inherit({
    /**
     * @cfg {String} tagName
     * Корневой тег виджета. По умолчанию div.
     */
    tagName: 'div',

    /**
     * @cfg {String} className
     * Имя CSS-класса корневого элемента.
     */

    /**
     * @cfg {String} tpl
     * Шаблон содержимого виджета в формате функции {@link S#format}. В качестве данных шаблон получает сам объект
     * виджета, таким образом можно "зашивать" в виджет конфигурационные свойства. 
     */

    /**
     * @cfg {Element/String} renderTo
     * DOM-элемент или его id. Если указан, то корневой элемент после создания добавляется в этот элемент.
     */

    /**
     * @cfg {Document} doc
     * Документ, в котором создается виджет. Если параметр не указан и указан {@link #renderTo}, то берется
     * свойство renderTo.ownerDocument, иначе текущий документ.
     */

    initComponent: function() {
        Widget.superclass.initComponent.apply(this, arguments);
        this.doc = this.doc || (this.renderTo && this.renderTo.ownerDocument) || document;
        this.el = $E(this.doc.createElement(this.tagName));
        if (this.className) {
            this.el.className = this.className;
        }
        if (this.tpl) {
            this.el.innerHTML = this.tpl.format(this);
        }
        if (this.renderTo) {
            $(this.renderTo).appendChild(this.el);
        }
        this._elsCache = {};
    },

    destroy: function() {
        this.getEl().remove();
        this.fireEvent('destroy');
    },

    /**
     * Возвращает корневой элемент виджета или, если указан selector, первого из его детей, удовлетворяющего
     * этому селектор. Селектор передается в функцию {@link $$} и должен удовлетворять ее синтаксису.
     * Результаты выборок кэшируются, но если указан force, то выборка будет произведена заново.
     * @param {String} selector Необязательный. Если указан, возвращается первый элемент из виджета, удовлетворяющий
     * селектору.
     * @param {Boolean} force Необязательный. Если true, выборка по селектору будет производится, не смотря на
     * наличие этого селектора в кэше.
     * @return {Element}
     */
    getEl: function(selector, force) {
        if (selector) {
            if (selector.charAt(0) != '!') {
                selector = '!' + selector;
            }
            if (!this._elsCache[selector] || force) {
                var el = $$(selector, {parent: this.el});
                if (!el) {
                    throw new Error('Elements by ' + selector + ' not found.');
                }
                this._elsCache[selector] = $E(el);
            }
            return this._elsCache[selector];
        }
        return this.el;
    }
});
