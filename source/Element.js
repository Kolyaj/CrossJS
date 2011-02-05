//#include document.js::$

//#label setStyle
//#include lang/String.js::camelize
//#endlabel setStyle

//#label offset
//#include document.js::getDocumentScroll::getRootElement
//#endlabel offset

//#label getParent
//#include document.js::createSelectorFilter
//#endlabel getParent

//#label classExists
//#include lang/String.js::trim
//#endlabel classExists

//#label on
//#include lang/Object.js::mixin
//#include lang/Array.js::filter
//#endlabel on

//#label initDrag
//#include EventObject.js::stop
//#endlabel initDrag

var $E = {};
(function($E) {
    //#label remove
    /**
     * Удаляет элемент из DOM-дерева.
     * @param {Node/String} el Удаляемый элемент или его id.
     */
    $E.remove = function(el) {
        el = $(el);
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    };
    //#endlabel remove

    //#label setStyle
    /**
     * Устанавливает CSS-свойства элементу. Прозрачно устанавливает opacity и cssFloat в IE.
     * @param {Node/String} el Элемент или его id.
     * @param {Object} styles Хэш-объект со свойствами, вида {width: '100px', height: '100px', ...}.
     */
    $E.setStyle = function(el, styles) {
        el = $(el);
        for (var name in styles) {
            if (name == 'opacity' && el.filters) {
                el.style.filter = styles[name] == 1 ? '' : 'Alpha(opacity=' + (styles[name] * 100) + ')';
            } else {
                el.style[name == 'cssFloat' && el.currentStyle ? 'styleFloat' : name.camelize()] = styles[name];
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
    $E.offset = function(el) {
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
    $E.classExists = function(el, cl) {
        return new RegExp('(^|\\s)' + cl.trim() + '(\\s|$)', '').test($(el).className);
    };
    //#endlabel classExists

    //#label addClass
    //#include ::classExists
    /**
     * Добавляет CSS-класс элементу.
     * @param {Node/String} el Элемент или его id.
     * @param {String} cl Имя добавляемого класса.
     */
    $E.addClass = function(el, cl) {
        if (!$E.classExists(el, cl)) {
            $(el).className += ' ' + cl;
        }
    };
    //#endlabel addClass

    //#label removeClass
    /**
     * Удаляет CSS-класс у элемента.
     * @param {Node/String} el Элемент или его id.
     * @param {String} cl Имя удаляемого класса.
     */
    $E.removeClass = function(el, cl) {
        el = $(el);
        var className = el.className.replace(new RegExp('(^|\\s)' + cl + '(?=\\s|$)', 'g'), ' ');
        if (className != el.className) {
            el.className = className;
        }
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
    $E.getParent = function(el, selector, depth, includeSelf) {
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
    //#include ::un
    var paramsRegex = /^(ctx|single)$/i, listeners = [];

    /**
     * Навешивает элементу element обработчик handler на событие name. Обработчик вызывается в контексте
     * ctx или params.ctx. Объект события передается аргументом всегда независимо от браузера и расширен
     * методами из объекта {@link EventObject}, если тот был подключен. Возможно навешивание сразу нескольких
     * обработчиков для нескольких событий
    $E.on('my-id', {
        click: this.onclick,
        mousedown: this.onmousedown,
        ctx: this
    });
     * Вместе с именами событий в таком формате можно передавать параметры ctx и single.
     * @param {Node/String} element Элемент или id элемента, событие которого обрабатывается.
     * @param {String} name Имя события.
     * @param {Function} handler Обработчик события.
     * @param {Object} ctx Контекст вызова обработчика.
     * @param {Object} params Параметры навешивания события. На данный момент возможен только параметр single,
     * если он равен true, то обрабочик будет вызван только при первом возникновении события, после чего сразу же
     * будет снят.
     */
    $E.on = function(element, name, handler, ctx, params) {
        if (typeof name == 'object') {
            for (var i in name) {
                if (name.hasOwnProperty(i) && !paramsRegex.test(i) && typeof name[i] == 'function') {
                    $E.on(element, i, name[i], name.ctx, name);
                }
            }
        } else {
            element = $(element);
            var callback = function(evt) {
                evt = evt || window.event;
                if (typeof EventObject != 'undefined') {
                    Object.mixin(evt, EventObject);
                }
                handler.call(ctx, evt);
                if (params && params.single) {
                    $E.un(element, name, handler, ctx, params);
                }
            };
            listeners.push([element, name, handler, ctx, callback]);
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
     * что и при назначении обработчика методом {@link #on}. Обработчики событий, назначенные не методом {@link #on},
     * этим методом не отменяются. Возможно групповое снятие обработчиков в том же формате, что и в {@link #on}.
     * @param {Node/String} element Элемент или id элемента, у которого отменяется событие.
     * @param {String} name Имя события.
     * @param {Function} handler Назначенный обработчик.
     * @param {Object} ctx Контекст вызова обработчика.
     */
    $E.un = function(element, name, handler, ctx) {
        if (typeof name == 'object') {
            for (var i in name) {
                if (name.hasOwnProperty(i) && !paramsRegex.test(i) && typeof name[i] == 'function') {
                    $E.un(element, i, name[i], name.ctx);
                }
            }
        } else {
            element = $(element);
            listeners = listeners.filter(function(listener) {
                if (listener[0] == element && listener[1] == name && listener[2] == handler && listener[3] == ctx) {
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

    //#label initDrag
    //#include ::on::un
    /**
     * Инициализирует возможность перетаскивания элемента. Метод предназначен лишь для автоматизации навешивания
     * обработчиков событий. Вся логика перетаскивания, ресайза или ещё чего реализуется в вызывающем коде.
     *
     * Вторым аргументом передаётся объект с тремя функциями: start, move, end, а также с контекстом вызова ctx.
     * Функция start вызывается в момент начала перетаскивания (т.е. при событии mousedown). В ней можно
     * произвести необходимую инициализацию. Если start вернёт false, то перетаскивание инициализировано не будет.
     * Функция move вызывается при передвижении курсора мыши с зажатой левой кнопкой.
     * Функция end вызывается при отпускании левой кнопки мыши.
     * Всем трём функциям первым и единственным аргументом передаётся объект события.
     *
     * @param {Element} element DOM-элемент или его id, mousedown на котором будет инициализировать перетаскивание.
     * @param {Object} listeners Объект с обработчиками start, move, end и контекстом их вызова ctx.
     */
    $E.initDrag = function(element, listeners) {
        var doc = $(element).ownerDocument;

        function onMouseMove(evt) {
            if (listeners.move) {
                listeners.move.call(listeners.ctx, evt);
            }
        }

        function onMouseUp(evt) {
            if (listeners.end) {
                listeners.end.call(listeners.ctx, evt);
            }
            $E.un(doc, 'mousemove', onMouseMove);
            $E.un(doc, 'mouseup', onMouseUp);
        }

        $E.on(element, 'mousedown', function(evt) {
            if (!listeners.start || listeners.start.call(listeners.ctx, evt) !== false) {
                $E.on(doc, 'mousemove', onMouseMove);
                $E.on(doc, 'mouseup', onMouseUp);
                evt.stop();
            }
        });
    };
    //#endlabel initDrag
})($E);