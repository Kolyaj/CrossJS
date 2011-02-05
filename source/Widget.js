//#include document.js::$$
//#include Component.js::base
//#include lang/String.js::compile::uncamelize
//#include Element.js::on::un::remove
//#include lang/Object.js::keys

/**
 * @class Widget
 * @extend Component
 * Компонент-заготовка для создания виджетов. Обеспечивает создание DOM-элемента, присвоение ему CSS-класса,
 * заполнение его HTML-кодом и добавление его в DOM-дерево, если требуется.
 */
var Widget = Component.inherit({
    /**
     * @type String
     * Корневой тег виджета. По умолчанию div.
     */
    tagName: 'div',

    /**
     * @type String
     * Имя CSS-класса корневого элемента.
     */
    className: '',

    /**
     * @type String
     * Шаблон содержимого виджета в формате функции {@link S#compile}. В качестве данных шаблон получает сам объект
     * виджета, таким образом можно "зашивать" в виджет конфигурационные свойства. 
     */
    tpl: '',

    /**
     * @type Element|String
     * DOM-элемент или его id. Если указан, то корневой элемент после создания добавляется в этот элемент.
     */
    renderTo: null,

    /**
     * @type Document
     * Документ, в котором создается виджет. Если параметр не указан и указан {@link #renderTo}, то берется
     * свойство renderTo.ownerDocument, иначе текущий документ.
     */
    doc: null,

    //#label css
    /**
     * @type Object
     * Объект с селекторами CSS. Преобразуется в строку и вставляется в head документа в виде обычной таблицы стилей.
     */
    css: null,
    //#endlabel css

    initComponent: function() {
        Widget.superclass.initComponent.apply(this, arguments);
        this.doc = this.doc || (this.renderTo && this.renderTo.ownerDocument) || document;
        this.el = this.doc.createElement(this.tagName);
        if (this.className) {
            this.el.className = this.className;
        }
        if (this.tpl) {
            this.el.innerHTML = this.tpl.compile().call(this);
        }
        if (this.renderTo) {
            $(this.renderTo).appendChild(this.el);
        }

        //#label css
        if (this.css) {
            var cssText = '';
            var proto = this.constructor.prototype;
            while (proto != Widget.prototype) {
                if (proto.hasOwnProperty('css')) {
                    cssText = this.compileCss(proto.css) + cssText;
                    delete proto.css;
                }
                proto = proto.constructor.superclass;
            }

            var styleEl = this.doc.createElement('style');
            styleEl.type = 'text/css';
            if (styleEl.styleSheet) {
                styleEl.styleSheet.cssText = cssText;
            } else if (styleEl.innerText == '') {
                styleEl.innerText = cssText;
            } else {
                styleEl.innerHTML = cssText;
            }
            this.doc.getElementsByTagName('head')[0].appendChild(styleEl);
        }
        //#endlabel css

        this._elsCache = {};
    },

    destroy: function() {
        $E.remove(this.getEl());
        this.fireEvent('destroy');
    },

    //#label css
    /**
     * Составляет строку с CSS-селекторами из объекта с CSS-селекторами.
     * @param {Object} selectors
     * @return {String}
     */
    compileCss: function(selectors) {
        return Object.keys(selectors).map(function(rule) {
            return '${0} {\n${1}}'.format(rule, Object.keys(this.css[rule]).map(function(property) {
                return '    ${0}: ${1};\n'.format(property.uncamelize(), this.css[rule][property]);
            }, this).join('')) + '\n';
        }, this).join('');
    },
    //#endlabel css

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
                this._elsCache[selector] = el;
            }
            return this._elsCache[selector];
        }
        return this.el;
    }
});
