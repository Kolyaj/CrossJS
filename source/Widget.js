//#include Component.js::base
//#include dom.js::$::$$::onEvent::unEvent
//#include lang/String.js::compile::uncamelize
//#include lang/Object.js::keys
//#include lang/Array.js::map
//#include css.js::base

/**
 * @class Widget
 * @extends Component
 *
 * Класс для создания виджетов, содержащий внутри и JavaScript, и HTML, и CSS.
 */
var Widget = Component.inherit({
    /**
     * @type String
     * Имя тега корневого элемента.
     */
    tagName: 'div',

    /**
     * @type String
     * CSS-класс корневого элемента.
     */
    className: '',

    /**
     * @type String
     * HTML шаблон виджета.
     */
    html: '',

    /**
     * @type Node/String
     * Элемент, куда отрендерить виджет.
     */
    renderTo: null,

    /**
     * @type Document
     * Родительский документ для виджета.
     */
    doc: null,

    /**
     * @type Object
     * Стили для виджета.
     */
    css: {},

    initComponent: function() {
        Widget.superclass.initComponent.apply(this, arguments);
        if (this.renderTo) {
            this.renderTo = $(this.renderTo);
        }
        if (!this.doc) {
            this.doc = this.renderTo ? this.renderTo.ownerDocument : document;
        }
        this.el = this.doc.createElement(this.tagName);
        if (this.className) {
            this.el.className = this.grabPrototypeChain('className').join(' ');
        }
        if (this.html) {
            this.el.innerHTML = this.applyTemplate(this.html);
        }
        if (this.renderTo) {
            this.renderTo.appendChild(this.el);
        }
        this.elementsCache = {};
        this.buildCss();
    },

    /**
     * Уничтожает виджет и посылает событие destroy.
     */
    destroy: function() {
        removeElement(this.getEl());
        this.fireEvent('destroy');
    },

    /**
     * Бежит по цепочке прототипов и собирает в них значения нужного свойства.
     *
     * @param {String} prop Имя свойства.
     * @param {Boolean} [removeProps] Удалять ли свойства после взятия значения.
     *
     * @return {Array} Массив значений переданного свойства из цепочки прототипов.
     */
    grabPrototypeChain: function(prop, removeProps) {
        var proto = this.constructor.prototype, result = [];
        while (proto != Widget.prototype) {
            if (proto.hasOwnProperty(prop)) {
                result.push(proto[prop]);
                if (removeProps) {
                    delete proto[prop];
                }
            }
            proto = proto.constructor.superclass;
        }
        return result;
    },

    /**
     * Компилирует и добавляет в документ CSS текущего виджета.
     */
    buildCss: function() {
        var cssText = this.grabPrototypeChain('css', true).reverse().map(function(css) {
            return this.compileCSS(css);
        }, this).join('');
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
    },

    /**
     * Компилирует в строку переданные CSS селекторы.
     *
     * @param {Object} selectors
     *
     * @return {String}
     */
    compileCSS: function(selectors) {
        return Object.keys(selectors).map(function(selector) {
            return this.compileCSSRule(selector, selectors[selector]);
        }, this).join('');
    },

    /**
     * Компилирует в строку CSS правило.
     *
     * @param {String} rule
     * @param {Object} properties
     *
     * @return {String}
     */
    compileCSSRule: function(rule, properties) {
        var cascades = [];
        return '${0} {\n${1}}\n'.format(rule, Object.keys(properties).map(function(property) {
            var value = properties[property];
            if (typeof value == 'object') {
                cascades.push(this.compileCSSRule(rule + ' ' + property, value));
                return '';
            } else {
                var propname = normalizeCSSProperty(property, value);
                return '    ${0}: ${1};\n'.format(propname[0].uncamelize(), propname[1]);
            }
        }, this).join('')) + cascades.join('');
    },

    /**
     * Вызывает шаблон в контексте виджета.
     *
     * @param {Function} tpl Скомпилированный шаблон.
     *
     * @return {String}
     */
    applyTemplate: function(tpl) {
        return tpl ? tpl.compile().call(this) : '';
    },

    /**
     * Возвращает первый DOM-элемент из виджета, соответствующий селектору. Если селектор не указан, возвращается
     * корневой элемент.
     *
     * @param {String} selector
     * @param {Boolean} force Если true, то элемент ищется заново, а не берётся из кэша.
     *
     * @return {Node}
     */
    getEl: function(selector, force) {
        if (selector) {
            if (selector.charAt(0) != '!') {
                selector = '!' + selector;
            }
            if (!this.elementsCache[selector] || force) {
                this.elementsCache[selector] = $$(selector, this.el);
            }
            return this.elementsCache[selector];
        }
        return this.el;
    }
});