//#include core.js::apply
//#include lang/Function.js::bind

//#label getStyle
//#include lang/String.js::camelize
//#endlabel getStyle

//#label setStyle
//#include lang/String.js::camelize
//#endlabel setStyle

//#label offset
//#include core.js::getDocumentScroll::getRootElement
//#endlabel offset

//#label getParent
//#include core.js::createSelectorFilter
//#endlabel getParent

//#label on
//#include EventObject.js::base
//#endlabel on

//#label un
//#include lang/Array.js::filter
//#endlabel un

/**
 * Расширяет DOM-элемент методами из объекта $E.Methods. Все методы также доступны через $E.method(el, ...).
 * Таким образом, есть два способа работы: расширение элемента ($E('elId').remove(), $E(el).getStyle('width')) и
 * непосредственный доступ к методам ($E.remove('elId'), $E.getStyle(el, 'width')).
 * @param {Node/String} el DOM-элемент или id элемента.
 * @return {Node} Элемент с добавленными методами.
 */
function $E(el) {
    el = $(el);
    for (var method in $E.Methods) {
        if ($E.Methods.hasOwnProperty(method) && typeof $E.Methods[method] == 'function' && !el[method]) {
            el[method] = $E.Methods[method].bind($E.Methods, el);
        }
    }
    return el;
}

(function(M) {
    //#label remove
    /**
     * Удаляет элемент из DOM-дерева.
     * @param {Node/String} el Удаляемый элемент или его id.
     */
    M.remove = function(el) {
        el = $(el);
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    };
    //#endlabel remove

    //#label getStyle
    /**
     * Возвращает значение css-свойства элемента.
     * @param {Node/String} el Элемент или его id.
     * @param {String} style Имя свойства
     * @return {String} Значение свойства.
     */
    M.getStyle =  function(el, style) {
        el = $(el);
        var value = el.style[style.camelize()], doc = el.ownerDocument;
        if (!value) {
            if (doc.defaultView && doc.defaultView.getComputedStyle) {
                var css = doc.defaultView.getComputedStyle(el, null);
                value = css ? css.getPropertyValue(style) : null;
            } else if (el.currentStyle) {
                value = el.currentStyle[style.camelize()];
            }
        }
        return value == 'auto' ? null : value;
    };
    //#endlabel getStyle

    //#label setStyle
    //#include_once "lang/String.js::camelize"
    /**
     * Устанавливает CSS-свойства элементу. Прозрачно устанавливает opacity и cssFloat в IE.
     * @param {Node/String} el Элемент или его id.
     * @param {Object} style Хэш-объект со свойствами, вида {width: '100px', height: '100px', ...}.
     */
    M.setStyle = function(el, style) {
        el = $(el);
        for (var name in style) {
            if (name == 'opacity' && el.filters) {
                el.style.filter = style[name] == 1 ? '' : 'Alpha(opacity=' + (style[name] * 100) + ')';
            } else {
                el.style[name == 'cssFloat' && el.currentStyle ? 'styleFloat' : name.camelize()] = style[name];
            }
        }
    };
    //#endlabel setStyle

    //#label offset
    /**
     * Возвращает смещение элемента относительно окна браузера.
     * @param {Node/String} el Элемент или его id.
     * @return {Array} Массив целых чисел вида [left, top].
     */
    M.offset = function(el) {
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
    };
    //#endlabel offset

    //#label classExists
    /**
     * Возвращает true, если CSS-класс cl установлен у элемента el.
     * @param {Node/String} el Элемент или его id.
     * @param {String} cl Имя проверяемого класса.
     * @return {Boolean}
     */
    M.classExists = function(el, cl) {
        return new RegExp('(^|\\s)' + cl + '(\\s|$)', '').test($(el).className);
    };
    //#endlabel classExists

    //#label addClass
    /**
     * Добавляет CSS-класс элементу.
     * @param {Node/String} el Элемент или его id.
     * @param {String} cl Имя добавляемого класса.
     * @return {Node} Переданный узел.
     */
    M.addClass = function(el, cl) {
        $(el).className += ' ' + cl;
        return el;
    };
    //#endlabel addClass

    //#label removeClass
    /**
     * Удаляет CSS-класс у элемента.
     * @param {Node/String} el Элемент или его id.
     * @param {String} cl Имя удаляемого класса.
     * @return {Node} Переданный узел.
     */
    M.removeClass = function(el, cl) {
        el = $(el);
        var className = el.className.replace(new RegExp('(^|\\s)' + cl + '(?=\\s|$)', 'g'), ' ');
        if (className != el.className) {
            el.className = className;
        }
        return el;
    };
    //#endlabel removeClass

    //#label getParent
    /**
     * Возращает родителя элемента. Если указан selector, то производит поиск вверх по цепочке родителей, пока
     * не будет найден элемент, удовлетворяющий условию.
     * @param {Node/String} el Элемент или его id.
     * @param {String} selector Строка формата, соответствующего формату аргумента {@link #createSelectorFilter}.
     * @param {Number} depth Глубина просмотра дерева, если указан selector.
     * @param {Boolean} includeSelf Если true, то на соответствие селектору проверяется и сам элемент.
     * @return {Node} Найденный родитель или null.
     */
    M.getParent = function(el, selector, depth, includeSelf) {
        if (!depth || depth <= 0) {
            depth = 1000;
        }
        var parent = $(el);
        if (!includeSelf) {
            parent = parent.parentNode;
        }
        if (selector) {
            var filter = createSelectorFilter(selector), d = 0;
            do {
                if (filter(parent)) {
                    return parent;
                }
            } while ((parent = parent.parentNode) && (++d < depth));
            return null;
        } else {
            return parent;
        }
    };
    //#endlabel getParent

    //#label on
    var paramsRegex = /^(scope|single)$/i, listeners = [];

    /**
     * Навешивает элементу element обработчик handler на событие name. Обработчик вызывается в контексте
     * scope или params.scope. Объект события передается аргументом всегда независимо от браузера и расширен
     * методами из объекта {@link EventObject}. Возможно навешивание сразу нескольких обработчиков для нескольких
     * событий
    $E.on('my-id', {
        click: this.onclick,
        mousedown: this.onmousedown,
        scope: this
    });
     * Или, если расширить объект этим методом
    var el = $E('my-id');
    el.on({
        click: this.onclick,
        mousedown: this.onmousedown,
        scope: this
    });
     * Вместе с именами событий в таком формате можно передавать параметры scope и single.
     * @param {Node/String} element Элемент или id элемента, событие которого обрабатывается.
     * @param {String} name Имя события.
     * @param {Function} handler Обработчик события.
     * @param {Object} scope Контекст вызова обработчика.
     * @param {Object} params Параметры навешивания события. На данный момент возможен только параметр single,
     * если он равен true, то обрабочик будет вызван только при первом возникновении события, после чего сразу же
     * будет снят.
     */
    M.on = function(element, name, handler, scope, params) {
        if (typeof name == 'object') {
            for (var i in name) {
                if (name.hasOwnProperty(i) && !paramsRegex.test(i) && typeof name[i] == 'function') {
                    M.on(element, i, name[i], name.scope, name);
                }
            }
        } else {
            element = $(element);
            var callback = function(evt) {
                handler.call(scope, apply(evt || window.event, EventObject));
                if (params && params.single) {
                    M.un(element, name, handler, scope, params);
                }
            };
            listeners.push([element, name, handler, scope, callback]);
            if (element.addEventListener) {
                element.addEventListener(name, callback, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + name, callback);
            }
        }
    };
    //#endlabel on

    //#label un
    //#include ::on
    /**
     * Снимает обработчик handler события name у элемента element. Все четыре параметра должны быть теми же,
     * что и при назначении обработчика методом {@link M#on}. Обработчики событий, назначенные не методом {@link M#on},
     * этим методом не отменяются. Возможно групповое снятие обработчиков в том же формате, что и в {@link M#on}.
     * @param {Node/String} element Элемент или id элемента, у которого отменяется событие.
     * @param {String} name Имя события.
     * @param {Function} handler Назначенный обработчик.
     * @param {Object} scope Контекст вызова обработчика.
     */
    M.un = function(element, name, handler, scope) {
        if (typeof name == 'object') {
            for (var i in name) {
                if (name.hasOwnProperty(i) && !paramsRegex.test(i) && typeof name[i] == 'function') {
                    M.un(element, i, name[i], name.scope);
                }
            }
        } else {
            element = $(element);
            listeners = listeners.filter(function(listener) {
                if (listener[0] == element && listener[1] == name && listener[2] == handler && listener[3] == scope) {
                    if (element.removeEventListener) {
                        element.removeEventListener(name, listener[4], false);
                    } else if (element.detachEvent) {
                        element.detachEvent('on' + name, listener[4]);
                    }
                    return false;
                }
                return true;
            });
        }
    };
    //#endlabel un

    //#label initHover
    //#include ::addClass::removeClass::on
    /**
     * Инициализирует реакцию на наведение и убирание мыши на элементе. После вызова этой функции при наведении
     * указателя мыши на элемент ему добавляется класс className, при убирании указателя с элемента класс,
     * соответственно, удаляется.
     * @param {Node/String} el Элемент или id элемента, у которого инициализируется hover.
     * @param {String} className Добавляемое/удаляемое имя класса. 
     */
    M.initHover = function(el, className) {
        $E.on(el, {
            mouseover: $E.addClass.bind($E, el, className),
            mouseout: $E.removeClass.bind($E, el, className)
        });
    };
    //#endlabel initHover
})($E.Methods = {});
apply($E, $E.Methods);