//#include Component.js::base
//#include dom.js::$::$$::onEvent::unEvent::removeElement
//#include lang/String.js::compile::uncamelize::trim
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

    _initComponent: function() {
        Widget.superclass._initComponent.apply(this, arguments);
        if (this.renderTo) {
            this.renderTo = $(this.renderTo);
        }
        if (!this.doc) {
            this.doc = this.renderTo ? this.renderTo.ownerDocument : document;
        }
        this._el = this.doc.createElement(this.tagName);
        if (this.className) {
            this._el.className = this._grabPrototypeChain('className').join(' ');
        }
        if (this.html) {
            this._el.innerHTML = this._applyTemplate(this.html);
        }
        if (this.renderTo) {
            this.renderTo.appendChild(this._el);
        }
        this._buildCss();
    },

    /**
     * Уничтожает виджет и посылает событие destroy.
     */
    destroy: function() {
        removeElement(this.getEl());
        this.fireEvent('destroy');
    },

    /**
     * Возвращает первый DOM-элемент из виджета с соответствующим CSS-классом. Если класс не указан, возвращается
     * корневой элемент.
     *
     * @param {String} className
     * @param {Boolean} [force] Если true, то элемент ищется заново, а не берётся из кэша.
     *
     * @return {Node}
     */
    getEl: function(className, force) {
        this.Widget__elementsCache = this.Widget__elementsCache || {};
        if (className) {
            if (!this.Widget__elementsCache[className] || force) {
                this.Widget__elementsCache[className] = $$('!.' + className, this._el);
            }
            return this.Widget__elementsCache[className];
        }
        return this._el;
    },

    /**
     * Бежит по цепочке прототипов и собирает в них значения нужного свойства.
     *
     * @param {String} prop Имя свойства.
     * @param {Boolean} [removeProps] Удалять ли свойства после взятия значения.
     *
     * @return {Array} Массив значений переданного свойства из цепочки прототипов.
     */
    _grabPrototypeChain: function(prop, removeProps) {
        var result = this.hasOwnProperty(prop) ? [this[prop]] : [];
        var proto = this.constructor.prototype;
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
    _buildCss: function() {
        var cssText = this._grabPrototypeChain('css', true).reverse().map(function(css) {
            return this._compileCSSRule('', css);
        }, this).join('').trim();
        if (cssText) {
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
    },

    /**
     * Компилирует в строку CSS правило.
     *
     * @param {String} rule
     * @param {Object} properties
     *
     * @return {String}
     */
    _compileCSSRule: function(rule, properties) {
        var cascades = [];
        return '${0} {\n${1}}\n'.format(rule, Object.keys(properties).map(function(property) {
            var value = properties[property];
            if (typeof value == 'object') {
                if (/^[?^] /.test(property)) {
                    var propertySupported = typeof this.doc.documentElement.style[normalizeCSSProperty(property.substr(2), '')[0]] == 'string';
                    var isValidSelector = (property.charAt(0) == '?' && propertySupported) || (property.charAt(0) == '^' && !propertySupported);
                    if (isValidSelector) {
                        cascades.push(this._compileCSSRule(rule, value));
                    }
                } else {
                    cascades.push(this._compileCSSRule(rule + ' ' + property, value));
                }
                return '';
            } else {
                var propname = normalizeCSSProperty(property, String(value).format(this));
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
    _applyTemplate: function(tpl) {
        return tpl ? tpl.compile().call(this) : '';
    }
});