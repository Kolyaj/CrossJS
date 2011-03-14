//#include lang/String.js::fromQueryParams

/**
 * Отправляет асинхронный HTTP-запрос на сервер.
 *
 * @param {String} method Метод запроса.
 * @param {String} url URL запроса. Может быть как относительный, так и абсолютный.
 * @param {String/Object} params Строка с параметрами в произвольном формате, либо хэш параметров,
 *      который приведётся к строке в формате urlencoded.
 * @param {Object} headers Хэш с заголовками запроса.
 * @param {Function} callback Callback-функция, вызываемая после получения ответа от сервера. При
 *      вызове передаются два параметра: содержимое свойства responseText объекта XMLHttpRequest и
 *      сам объект XMLHttpRequest.
 * @param {Object} ctx Контекст вызова для callback-функции.
 *
 * @return {XMLHttpRequest} Созданный объект XMLHttpRequest.
 */
function xhrRequest(method, url, params, headers, callback, ctx) {
    url = url || location.href;
    params = params || '';
    if (typeof params != 'string') {
        params = String.fromQueryParams(params);
    }
    if (method.toLowerCase() == 'get') {
        url += (url.indexOf('?') > -1 ? '&' : '?') + params;
    }
    headers = headers || {};

    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (method.toLowerCase() == 'post' && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    for (var header in headers) {
        if (headers.hasOwnProperty(header)) {
            xhr.setRequestHeader(header, headers[header]);
        }
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback.call(ctx, xhr.responseText, xhr);
        }
    };
    xhr.send(method.toLowerCase() == 'post' ? params : null);
    return xhr;
}