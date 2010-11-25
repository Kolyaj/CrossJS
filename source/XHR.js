//#include lang/XMLHttpRequest.js::base
//#include lang/String.js::fromQueryParams
//#include core.js::apply

var XHR = {
    /**
     * Отправляет запрос на сервер средствами XMLHttpRequest. Возможно, чтобы при каждом запросе посылался
     * заголовок X-Requested-With, для этого необходимо установить в true свойство XHR.useDefaultXhrHeader.
     * Значение заголовка хранится в свойстве XHR.defaultXhrHeader и если оно не определено, то подставляется
     * XMLHttpRequest.
     * @cfg {String} method Метод запроса, по умолчанию post.
     * @cfg {String} url Адрес, на который будет посылаться запрос, по умолчанию -- адрес текущей страницы.
     * @cfg {Object/String} params Строка или объект с get/post-параметрами. Если передан объект, то он преобразуется
     * в строку средствами {@link String#fromQueryParams}.
     * @cfg {Object} headers HTTP-заголовки в виде ключ-значение, отправляемые на сервер.
     * @cfg {Number} timeout Количество миллисекунд, в течение которых запрос должен завершиться, в противном
     * случае он прерывается и вызывается callback-функция failure, если она опрелена.
     * @cfg {Function} success Callback-функция, вызываемая после успешного завершения запроса. Передаваемый в нее
     * аргумент зависит от параметра responseType.
     * @cfg {Function} failure Callback-функция, вызываемая если код ответа сервера отличен от 200 или ответа не удалось
     * дождаться в течение timeout секунд. В первом случае аргументом будет объект XMLHttpRequest, во втором -- не
     * будет передано ничего.
     * @cfg {Function} complete Callback-функция, вызываемая после завершения запроса по любой причине: успешное,
     * с плохим кодом ответа или по таймауту. В последнем случае будет вызвана без аргументов, в всех остальных --
     * аргументом будет объект XMLHttpRequest.
     * @cfg {Object} scope Объект, в контексте которого вызываются функции success, failure и complete.
     * @cfg {String} responseType Параметр, от которого зависит аргумент вызова функции success. Возможны следующие
     * варианты <ul>
     *     <li>неопределен (по умолчанию) -- передается объект XMLHttpRequest.</li>
     *     <li>text -- передается ответ сервера в виде текста.</li>
     *     <li>json -- передается ответ сервера в виде json-объекта. Поддержка JSON должна быть подключена.</li>
     *     <li>xml -- передается ответ сервера в виде объекта XML.</li>
     * </ul>
     * @param {Object} options Хэш с параметрами запроса. Все параметры являются необязательными.
     *
     * @return {XMLHttpRequest} Объект XMLHttpRequest.
     */
    request: function(options) {
        options = options || {};

        function callback(name) {
            if (typeof options[name] == 'function') {
                options[name].apply(options.scope, arguments[1] || [])
            }
        }

        var method = (options.method || 'post').toLowerCase();

        var params = options.params || '';
        if (typeof params != 'string') {
            params = String.fromQueryParams(params);
        }

        var url = options.url || window.location.href;
        if (method == 'get' && params.length) {
            url += (url.indexOf('?') == -1 ? '?' : '&') + params;
        }

        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        var hs = options.headers || {};
        if (method == 'post' && !hs['Content-Type']) {
            hs['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if (XHR.useDefaultXhrHeader) {
            hs['X-Requested-With'] = XHR.defaultXhrHeader || 'XMLHttpRequest';
        }
        for (var i in hs) {
            if (hs.hasOwnProperty(i)) {
                xhr.setRequestHeader(i, hs[i]);
            }
        }
        xhr.send(method == 'get' ? null : params);
        var stopped, timeoutId = setTimeout(function() {
            stopped = true;
            xhr.abort();
            callback('failure');
            callback('complete');
        }, options.timeout || 30000);

        (function() {
            if (!stopped) {
                if (xhr.readyState == 4) {
                    clearTimeout(timeoutId);
                    if (xhr.status == 200) {
                        if (typeof options.success == 'function') {
                            var param = xhr;
                            switch (options.responseType) {
                                case 'text':
                                    param = xhr.responseText;
                                    break;
                                case 'json':
                                    param = JSON.parse(xhr.responseText);
                                    break;
                                case 'xml':
                                    param = xhr.responseXML;
                                    break;
                                default: break;
                            }
                            options.success.call(options.scope, param);
                        }
                    } else {
                        callback('failure', [xhr]);
                    }
                    callback('complete', [xhr]);
                } else {
                    setTimeout(arguments.callee, 10);
                }
            }
        })();

        return xhr;
    }
};