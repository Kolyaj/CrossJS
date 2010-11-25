/**
 * Возвращает DOM-элемент по его id, или переданный параметр.
 * @param {String/HTMLElement} element Если строка, то возвращается элемент с таким id, иначе переданный аргумент.
 * @return {Element}
 */
function $(element) {
    return typeof element == 'string' ? document.getElementById(element) : element;
}

//#label $$
//#include ::createSelectorFilter
/**
 * Выбирает элементы по селектору selector с дополнительными параметрами.
 * @param {String} selector Строка формата, соответствующего формату аргумента функции
 * {@link #createSelectorFilter}. Кроме того, первым символом возможно указать !, тогда будет возвращен
 * только первый элемент, после нахождения которого поиск будет прекращен.
 * @param {Object} options Объект с параметрами. Все параметры необязательны.
 *  <ul>
 *      <li>parent -- элемент, внутри которого осуществлять поиск. По умолчанию поиск ведется по всему текущему
 *          документу.</li>
 *      <li>filter -- функция, вызываемая для каждого найденного по селектору элемента. Если определена, то в
 *          результирующую выборку попадают только те элементы, для которых она вернет истинное значение.
 *          При вызове передается элемент и его индекс среди всех найденных по тегу.</li>
 *      <li>map -- функция, вызываемая для каждого найденного по селектору элемента и удовлетворяющего функции
 *          filter, если та определена. В результирующий массив попадают результаты работы этой функции.
 *          При вызове передается элемент и его индекс среди прошедших все фильтры.</li>
 *      <li>reduce -- функция, агрегирующая данные из разных элементов. При вызове передаются агрегированное
 *          значение, сам элемент (или результат работы map) и его индекс среди отфильтрованных элементов.
 *          Если параметр reduceInit не указан, то для первого найденного элемента reduce не вызывается.</li>
 *      <li>reduceInit -- инициализирующее значение для reduce. Если не задано, то подставляется первый найденный
 *          элемент или результат работы map, если она задана.</li>
 *      <li>scope -- контекст, внутри которого вызываются функции filter, map и reduce.</li>
 *  </ul>
 * Если в селекторе указан модификатор !, то функции map и reduce вызваны не будут, а будет возвращен найденный
 * элемент.
 * @return {Mixed} В зависимости от переданных параметров.
 */
function $$(selector, options) {
    options = options || {};
    var single = false;
    if (selector.indexOf('!') === 0) {
        single = true;
        selector = selector.substr(1);
    }
    var selectorFilter = createSelectorFilter(selector);
    var filter = function(element, index) {
        if (!selectorFilter(element)) {
            return false;
        }
        return typeof options.filter == 'function' ? options.filter.call(options.scope, element, index) : true;
    };
    var elements = $(options.parent || document).getElementsByTagName(selector.split('.')[0] || '*');
    var result = [], reduceValue = options.reduceInit, reduceInitialized = ('reduceInit' in options);
    for (var i = 0, j = 0; i < elements.length; i++) {
        var el = elements[i];
        if (filter(el, i)) {
            if (single) {
                return el;
            }
            var value = typeof options.map == 'function' ? options.map.call(options.scope, el, j) : el;
            if (typeof options.reduce == 'function') {
                reduceValue = reduceInitialized ? options.reduce.call(options.scope, reduceValue, value, j) : value;
                reduceInitialized = true;
            } else {
                result.push(value);
            }
            j++;
        }
    }
    return typeof options.reduce == 'function' ? reduceValue : result;
}
//#endlabel $$

//#label createSelectorFilter
/**
 * Создает функцию, проверяющую соответствие передаваемых dom-элементов селектору.
 * @param {String} selector Строка вида 'tagName.className1.className2.className3'. tagName опционален, если
 * не указан, будет подставлена *. Если указано несколько className, то выберутся элементы, которые содержат
 * их все.
 * @return {Function}
 */
function createSelectorFilter(selector) {
    var selectorParts = selector.split('.'), classNameRegexps = [], tagName = selectorParts[0].toUpperCase() || '*';
    for (var i = 1; i < selectorParts.length; i++) {
        classNameRegexps.push(new RegExp('(^|\\s)' + selectorParts[i] + '(\\s|$)'));
    }
    return function(el) {
        if (tagName != '*' && el.tagName != tagName) {
            return false;
        }
        for (var i = 0; i < classNameRegexps.length; i++) {
            if (!classNameRegexps[i].test(el.className)) {
                return false;
            }
        }
        return true;
    };
}
//#endlabel createSelectorFilter

//#label random
/**
 * Генерирует случайное число в диапазоне от start до end. Если передан только один аргумент, то он считается
 * верхней границей, а нижняя при этом 0.
 * @param {Number} start Нижняя граница диапазона генерируемых значений.
 * @param {Number} end Верхняя граница диапазона.
 * @return {Number}
 */
function random(start, end) {
    if (arguments.length == 1) {
        end = start;
        start = 0;
    }
    return Math.round(Math.random() * (end - start)) + start;
}
//#endlabel random

//#label exec
/**
 * Выполняет код в глобальном контексте.
 * @param {String} str Код, который необходимо выполнить.
 */
function exec(str) {
    if (str.length) {
        if (typeof window.execScript == 'object' && String(window.execScript) == '\nfunction execScript() {\n    [native code]\n}\n') {
            window['execScript'](str);
        } else {
            eval.call(window, str);
        }
    }
}
//#endlabel exec

//#label getWindow
/**
 * Возвращает объект окна, в котором содержится переданный документ.
 * @param {Document} doc
 * @return {Window}
 */
function getWindow(doc) {
    return doc.parentWindow || doc.defaultView;
}
//#endlabel getWindow

//#label getRootElement
/**
 * Возвращает корневой элемент на странице. Если compatMode='CSS1Compat', то это documentElement, иначе body.
 * Если compatMode не определен, то можно считать, что это 'BackCompat'.
 * @param {Document} doc Необязательный. Передается в случае работы с другим документом.
 * @return {HTMLElement} documentElement или body
 */
function getRootElement(doc) {
    doc = doc || document;
    return doc.compatMode == 'CSS1Compat' ? doc.documentElement : doc.body;
}
//#endlabel getRootElement

//#label getDocumentScroll
//#include ::getWindow
/**
 * Возвращает позицию скрола документа.
 * @param {Document} doc Необязательный. Передается в случае работы с другим документом.
 * @return {Array} Массив из двух элементов [left, top].
 */
function getDocumentScroll(doc) {
    doc = doc || document;
    var win = getWindow(doc);
    return [
        win.pageXOffset || doc.documentElement.scrollLeft || doc.body.scrollLeft || 0,
        win.pageYOffset || doc.documentElement.scrollTop  || doc.body.scrollTop  || 0
    ];
}
//#endlabel getDocumentScroll

//#label getDocumentSize
//#include ::getViewportSize::getRootElement
//todo Если у body стоит overflow: auto, то высота не определяется в Firefox
/**
 * Возвращает размеры всего документа.
 * @param {Document} doc Необязательный. Передается в случае работы с другим документом.
 * @return {Array} Массив из двух элементов [width, height].
 */
function getDocumentSize(doc) {
    doc = doc || document;
    var viewport = getViewportSize(doc), elem = getRootElement(doc);
    return [Math.max(elem.scrollWidth, viewport[0]), Math.max(elem.scrollHeight, viewport[1])];
}
//#endlabel getDocumentSize

//#label getViewportSize
//#include ::getRootElement
/**
 * Возвращает размеры видимой части документа.
 * @param {Document} doc Необязательный. Передается в случае работы с другим документом.
 * @return {Array} Массив из двух элементов [width, height].
 */
function getViewportSize(doc) {
    doc = doc || document;
    var elem = getRootElement(doc);
    return [elem.clientWidth, elem.clientHeight];
}
//#endlabel getViewportSize

//#label fixBackground
// Фикс бага IE6, из-за которого не кэшируются фоновые изображения.
try { document.execCommand("BackgroundImageCache", false, true); } catch (ignore) {}
//#endlabel fixBackground