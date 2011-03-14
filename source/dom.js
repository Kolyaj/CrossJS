//#label $
/**
 * Возвращает DOM-элемент по его id, или переданный параметр.
 *
 * @param {String/Node} el Если строка, то возвращается элемент с таким id, иначе переданный аргумент.
 * @param {Document} [doc] Документ, в котором осуществлять поиск. По умолчанию текущий.
 *
 * @return {Node}
 */
function $(el, doc) {
    doc = doc || document;
    return typeof el == 'string' ? doc.getElementById(el) : el;
}
//#endlabel $


//#label $$
//#include lang/Array.js::isArray
//#include ::createSelectorFilter
/**
 * Ищет элементы по простому селектору внутри нужных родителей.
 *
 * @param {String} [selector] Строка вида 'tagName.className'. Оба значения опциональны. Можно в начале селектора
 *      добавить !, тогда вернётся первый найденный элемент без поиска последующих.
 * @param {Node/Array} [parents] Элемент или массив элементов, внутри которых искать соответствующие селектору
 *      элементы. Если не указан, ищется внутри всего документа.
 *
 * @return {Node/Array} Массив элементов или один элемент, если в селекторе указан !.
 */
function $$(selector, parents) {
    if (!parents) {
        parents = [document];
    }
    if (!Array.isArray(parents)) {
        parents = [parents];
    }
    if (selector.charAt(0) == '!') {
        var once = true;
        selector = selector.substr(1);
    }
    var filter = createSelectorFilter(selector);
    var result = [];
    for (var i = 0; i < parents.length; i++) {
        var elements = parents[i].getElementsByTagName(selector.split('.')[0] || '*');
        for (var j = 0; j < elements.length; j++) {
            if (filter(elements[j])) {
                if (once) {
                    return elements[j];
                }
                result.push(elements[j]);
            }
        }
    }
    return once ? null : result;
}
//#endlabel $$


//#label createSelectorFilter
//#include lang/String.js::trim
/**
 * Возвращает функцию, проверяющую переданный ей элемент на соответствие селектору.
 *
 * @see $$
 * @see EventObject.getTarget
 *
 * @param {String} selector Селектор вида tagName.className
 *
 * @return {Function}
 */
function createSelectorFilter(selector) {
    createSelectorFilter.cache = createSelectorFilter.cache || {};
    selector = selector.trim();
    if (!createSelectorFilter.cache[selector]) {
        var selectorParts = selector.split('.');
        var tagName = selectorParts[0], className = selectorParts[1], conditions = [];
        if (tagName && tagName != '*') {
            conditions.push('e.tagName=="' + tagName.replace(/"/g, '\\u0022') + '"');
        }
        if (className) {
            conditions.push('e.className && e.className.match(/(^|\\s)' + className + '(\\s|$)/)');
        }
        createSelectorFilter.cache[selector] = new Function('e', 'return ' + (conditions.join('&&') || 'true'));
    }
    return createSelectorFilter.cache[selector];
}
//#endlabel createSelectorFilter


//#label removeElement
//#include ::$
/**
 * Удаляет элемент из DOM-дерева.
 *
 * @param {Node/String} el Удаляемый элемент или его id.
 */
function removeElement(el) {
    el = $(el);
    if (el.parentNode) {
        el.parentNode.removeChild(el);
    }
}
//#endlabel removeElement


//#label setElementStyle
//#include ::$
//#include css.js::base
/**
 * Устанавливает элементу el стили style. Стили передаются в виде объекта. Имена стилей, состоящие из нескольких
 * строк, пишутся в camelCase (fontSize, borderBottom, ...).
 *
 * @param {Node/String} el Элемент, которому устанавливаются стили, или его id.
 * @param {Object} style Хэш со стилями, например, {fontSize: '12px', width: '30px'}
 */
function setElementStyle(el, style) {
    el = $(el);
    for (var name in style) {
        var propValue = normalizeCSSProperty(name, style[name]);
        el.style[propValue[0]] = propValue[1];
    }
}
//#endlabel setElementStyle


//#label getElementOffset
//#include ::$::getDocumentScroll::getRootElement
/**
 * Возвращает смещение элемента относительно окна браузера.
 *
 * @param {Node/String} el Элемент или его id.
 *
 * @return {Array} Массив целых чисел вида [left, top].
 */
function getElementOffset(el) {
    el = $(el);
    var left = 0, top = 0;
    if (el.getBoundingClientRect) {
        var box = el.getBoundingClientRect(), doc = el.ownerDocument,
                scroll = getDocumentScroll(doc), rootEl = getRootElement(doc);
        left = box.left + scroll[0] - (rootEl.clientLeft || 0);
        top  = box.top  + scroll[1] - (rootEl.clientTop || 0);
    } else {
        while (el) {
            left += parseInt(el.offsetLeft);
            top  += parseInt(el.offsetTop);
            el = el.offsetParent;
        }
    }
    return [left, top];
}
//#endlabel getElementOffset


//#label classNameExists
//#include lang/String.js::trim
//#include ::$
/**
 * Возвращает true, если CSS-класс className установлен у элемента el.
 *
 * @param {Node/String} el Элемент или его id.
 * @param {String} className Имя проверяемого класса.
 *
 * @return {Boolean}
 */
function classNameExists(el, className) {
    return new RegExp('(^|\\s)' + className.trim() + '(\\s|$)', '').test($(el).className);
}
//#endlabel classNameExists


//#label addClassName
//#include ::$::classNameExists
/**
 * Добавляет CSS-класс элементу, если у элемента нет такого класса.
 *
 * @param {Node/String} el Элемент или его id.
 * @param {String} className Имя добавляемого класса.
 */
function addClassName(el, className) {
    if (!classNameExists(el, className)) {
        $(el).className += ' ' + className;
    }
}
//#endlabel addClassName


//#label removeClassName
//#include ::$
/**
 * Удаляет CSS-класс у элемента, если у элемента есть такой класс.
 *
 * @param {Node/String} el Элемент или его id.
 * @param {String} className Имя удаляемого класса.
 */
function removeClassName(el, className) {
    el = $(el);
    var newClassName = el.className.replace(new RegExp('(^|\\s)' + className + '(?=\\s|$)', 'g'), ' ');
    if (newClassName != el.className) {
        el.className = newClassName;
    }
}
//#endlabel removeClassName


//#label getElementParent
//#include ::$::createSelectorFilter
/**
 * Возращает родителя элемента. Если указан selector, то производит поиск вверх по цепочке родителей, пока
 * не будет найден элемент, удовлетворяющий условию. Селектор может иметь вид tagName.className.
 *
 * @param {Node/String} el Элемент или его id.
 * @param {String} selector Строка формата, соответствующего формату аргумента {@link createSelectorFilter}.
 * @param {Number} depth Глубина просмотра дерева, если указан selector.
 * @param {Boolean} includeSelf Если true, то на соответствие селектору проверяется и сам элемент.
 *
 * @return {Node} Найденный родитель или null.
 */
function getElementParent(el, selector, depth, includeSelf) {
    if (!depth || depth <= 0) {
        depth = 1000;
    }
    var parent = $(el);
    if (!includeSelf) {
        parent = parent.parentNode;
    }
    if (!selector) {
        return parent;
    }
    var filter = createSelectorFilter(selector), d = 0;
    do {
        if (filter(parent)) {
            return parent;
        }
    } while ((parent = parent.parentNode) && (++d < depth));
    return null;
}
//#endlabel getElementParent

//#label processEventArguments
/**
 * Обрабатывает аргументы функций {@link onEvent} и {@link unEvent}. А именно, разворачивает обработчики, переданные
 * посредством массива, разворачивает несколько имён событий, записанных через запятую.
 * Кроме этого, содержит в себе массив, куда сохраняются навешанные события.
 *
 * @param {Arguments} args Объект arguments из соответствующей функции.
 *
 * @return {Array} Массив, куда складывать навешанные события, или null, если ничего делать не надо.
 */
function processEventArguments(args) {
    if (typeof args[1] == 'object') {
        for (var i in args[1]) {
            if (args[1].hasOwnProperty(i) && i != 'ctx' && typeof args[1][i] == 'function') {
                args.callee(args[0], i, args[1][i], args[1]['ctx']);
            }
        }
        return null;
    }
    if (args[1].indexOf(',') > -1) {
        var events = args[1].split(',');
        for (var j = 0; j < events.lenght; j++) {
            args.callee(el, events[j], args[2], args[3]);
        }
        return null;
    }
    processEventArguments.listeners = processEventArguments.listeners || [];
    return processEventArguments.listeners;
}
//#endlabel processEventArguments


//#label onEvent
//#include ::processEventArguments::getWindow
//#include lang/Object.js::mixin
/**
 *
 *
 * @param el
 * @param event
 * @param fn
 * @param ctx
 */
function onEvent(el, event, fn, ctx) {
    var listeners = processEventArguments(arguments);
    if (listeners) {
        el = $(el);
        var win = getWindow(el.ownerDocument || el);
        var handler = function(evt) {
            evt = evt || win.event;
            if (typeof EventObject == 'object') {
                Object.mixin(evt, EventObject);
            }
            fn.call(ctx, evt);
        };
        listeners.push([el, event, fn, ctx, handler]);
        if (el.addEventListener) {
            el.addEventListener(event, handler, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + event, handler);
        }
    }
}
//#endlabel onEvent


//#label unEvent
//#include ::onEvent
/**
 *
 *
 * @param el
 * @param event
 * @param fn
 * @param ctx
 */
function unEvent(el, event, fn, ctx) {
    var listeners = processEventArguments(arguments);
    if (listeners) {
        el = $(el);
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            if (listener[0] == el && listener[1] == event && listener[2] == fn && listener[3] == ctx) {
                listeners.splice(i, 1);
                if (el.removeEventListener) {
                    el.removeEventListener(event, listener[4], false);
                } else if (el.detachEvent) {
                    el.detachEvent('on' + event, listener[4]);
                }
                return;
            }
        }
    }
}
//#endlabel unEvent


//#label initElementDrag
//#include ::onEvent::unEvent
//#include EventObject.js::getPoint
/**
 * Инициализирует возможность перетаскивания элемента. Метод предназначен лишь для автоматизации навешивания
 * обработчиков событий. Вся логика перетаскивания, ресайза или ещё чего реализуется в вызывающем коде.
 *
 * Вторым аргументом передаётся объект с тремя функциями: start, move, end, а также с контекстом вызова ctx.
 * Функция start вызывается в момент начала перетаскивания (т.е. при событии mousedown). В ней можно
 * произвести необходимую инициализацию. Если start вернёт false, то перетаскивание инициализировано не будет.
 * Функция move вызывается при передвижении курсора мыши с зажатой левой кнопкой.
 * Функция end вызывается при отпускании левой кнопки мыши.
 * Всем трём функциям первым и единственным аргументом передаётся объект события, в котором дополнительно
 * добавлено свойство delta, содержащее разницу с предыдущей позицией курсора.
 *
 * @param {Element} el DOM-элемент или его id, mousedown на котором будет инициализировать перетаскивание.
 * @param {Object} listeners Объект с обработчиками start, move, end и контекстом их вызова ctx.
 */
function initElementDrag(el, listeners) {
    var doc = $(el).ownerDocument;
    var lastPoint;

    function onMouseMove(evt) {
        var curPoint = evt.getPoint();
        evt.delta = [curPoint[0] - lastPoint[0], curPoint[1] - lastPoint[1]];
        lastPoint = curPoint;
        if (listeners.move) {
            listeners.move.call(listeners.ctx, evt);
        }
    }

    function onMouseUp(evt) {
        if (listeners.end) {
            listeners.end.call(listeners.ctx, evt);
        }
        unEvent(doc, 'mousemove', onMouseMove);
        unEvent(doc, 'mouseup', onMouseUp);
    }

    onEvent(el, 'mousedown', function(evt) {
        lastPoint = evt.getPoint();
        if (!listeners.start || listeners.start.call(listeners.ctx, evt) !== false) {
            $E.on(doc, 'mousemove', onMouseMove);
            $E.on(doc, 'mouseup', onMouseUp);
            evt.stop();
        }
    });
}
//#endlabel initElementDrag


//#label getWindow
/**
 * Возвращает объект окна, в котором содержится переданный документ.
 *
 * @param {Document} doc
 *
 * @return {window}
 */
function getWindow(doc) {
    return doc.parentWindow || doc.defaultView;
}
//#endlabel getWindow

//#label getRootElement
/**
 * Возвращает корневой элемент на странице. Если compatMode='CSS1Compat', то это documentElement, иначе body.
 * Если compatMode не определен, то можно считать, что это 'BackCompat'.
 *
 * @param {Document} [doc] Передается в случае работы с другим документом.
 *
 * @return {Node} documentElement или body
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
 *
 * @param {Document} [doc] Передается в случае работы с другим документом.
 *
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
/**
 * Возвращает размеры всего документа.
 *
 * @param {Document} [doc] Передается в случае работы с другим документом.
 *
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
 *
 * @param {Document} [doc] Передается в случае работы с другим документом.
 *
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