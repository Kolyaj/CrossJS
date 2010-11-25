// todo Добавить createTemplate

//#label toQueryParams
//#include_once "Array.js::forEach"
//#endlabel toQueryParams

//#label queryCodecOptions
String.queryCodecOptions = {
    encode: encodeURIComponent,
    decode: decodeURIComponent,
    arraySuffix: '[]'
};
//#endlabel queryCodecOptions

//#label fromQueryParams
//#include_once "self::queryCodecOptions"
/**
 * Статический метод. Преобразует хэш параметров object в строку параметров в формате урла. Если значение параметра
 * является массивом, то к имени параметра добавляется значение настраиваемого свойства
 * String.queryCodecOptions.arraySuffix (по умолчанию '[]') и параметр повторяется столько раз, сколько элементов
 * в массиве. Функцию кодирования можно установить в параметре String.queryCodecOptions.encode.
 * @param {Object} object Хэш с параметрами.
 * @return {String} строка в форме параметров URL.
 */
String.fromQueryParams = function(object) {
    var pairs = [], encode = String.queryCodecOptions.encode, arraySuffix = String.queryCodecOptions.arraySuffix;
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var value = object[key];
            if (Object.prototype.toString.call(value) == '[object Array]') {
                for (var i = 0; i < value.length; i++) {
                    pairs.push(encode(key) + arraySuffix + '=' + encode(String(value[i])));
                }
            } else {
                pairs.push(encode(key) + '=' + encode(String(value)));
            }
        }
    }
    return pairs.join('&');
};
//#endlabel fromQueryParams

(function(S) {
    //#label ScriptFragment
    var scriptFragmentPattern = '(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)';
    var allScriptFragmentsPattern = new RegExp(scriptFragmentPattern, 'img');
    var oneScriptFragmentPattern  = new RegExp(scriptFragmentPattern, 'im');
    //#endlabel ScriptFragment

    //#label stripScripts
    //#include_once "self::ScriptFragment"
    /**
     * Удаляет скрипты из HTML-кода.
     * @return {String} Строка без вхождений тегов script и их содержимого.
     */
    S.stripScripts = function() {
        return this.replace(allScriptFragmentsPattern, '');
    };
    //#endlabel stripScripts

    //#label extractScripts
    //#include_once "Array.js::map"
    //#include_once "self::ScriptFragment"
    /**
     * Возвращает содержимое тегов script из исходной строки с HTML-кодом.
     * @return {Array} Массив строк, содержащих содержимое тегов script.
     */
    S.extractScripts = function() {
        return this.match(allScriptFragmentsPattern).map(function(script) {
            return (script.match(oneScriptFragmentPattern) || ['', ''])[1];
        });
    };
    //#endlabel extractScripts

    //#label strip
    /**
     * Удаляет пробельные символы из начала и конца строки.
     * @return {String} Копия строки без начальных и конечных пробельных символов.
     */
    S.strip = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
    //#endlabel strip

    //#label truncate
    /**
     * Обрезает строку до длины length справа, слева или в центре, в зависимости от параметра mode. Вместо вырезанного
     * куска вставляет строку truncation.
     * @param {Number} length (Optional) Длина результирующей строки (по умолчанию 30).
     * @param {String} truncation (Optional) Строка, добавляемая вместо вырезанной части (по умолчанию '...').
     * @param {String} mode (Optional) Режим работы. left -- отрезает слева, right -- справа, center -- в центре.
     * (по умолчанию right).
     * @return {String} Обрезанная строка.
     */
    S.truncate = function(length, truncation, mode) {
        length = length || 30;
        if (this.length <= length) {
            return this.valueOf();
        }
        truncation = truncation || '...';
        switch (mode) {
            case 'left':
                return truncation + this.slice(truncation.length - length);
            case 'center':
                var l = Math.floor((length - truncation.length) / 2);
                return this.slice(0, l) + truncation + this.slice(-l);
            default:
                return this.slice(0, length - truncation.length) + truncation;
        }
    };
    //#endlabel truncate

    //#label stripTags
    /**
     * Удаляет HTML-теги из строки.
     * @return {String}
     */
    S.stripTags = function() {
        return this.replace(/<\/?[^>]+>/gi, '');
    };
    //#endlabel stripTags

    //#label escapeHTML
    /**
     * Экранирует HTML-теги в HTML-сущности.
     * @return {String}
     */
    S.escapeHTML = function() {
        var div = document.createElement('DIV');
        var text = document.createTextNode(this);
        div.appendChild(text);
        return div.innerHTML;
    };
    //#endlabel escapeHTML

    //#label unescapeHTML
    //#include_once "self::stripTags"
    /**
     * Переводит HTML-сущности в соответствующие теги.
     * @return {String}
     */
    S.unescapeHTML = function() {
        var div = document.createElement('DIV');
        div.innerHTML = this.stripTags();
        return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
    };
    //#endlabel unescapeHTML

    //#label camelize
    /**
     * Переводит строки из dash-style в camelStyle.
     * @return {String}
     */
    S.camelize = function() {
        return this.replace(/-([a-z])/g, function() {
            return arguments[1].toUpperCase();
        });
    };
    //#endlabel camelize

    //#label toQueryParams
    //#include_once "self::strip"
    //#include_once "self::queryCodecOptions"
    /**
     * Преобразует строку в формате параметров URL в объект. Повторяющиеся элементы и элементы, имена которых
     * заканчиваются на настраиваемый параметр String.queryCodecOptions.arraySuffix, преобразуются в массив
     * с удалением arraySuffix из имени. Функцию декодирования можно установить в параметре
     * String.queryCodecOptions.decode.
     * @return {Object}
     */
    S.toQueryParams = function() {
        var self = this.strip(), result = {};
        var decode = String.queryCodecOptions.decode, arraySuffix = String.queryCodecOptions.arraySuffix;
        if (self.length) {
            self.split('&').forEach(function(part) {
                var pair = part.split('=');
                var key = decode(pair[0]), value = decode(pair[1].replace(/\+/g, '%20'));
                if (arraySuffix.length && arraySuffix.length < key.length && key.lastIndexOf(arraySuffix) == key.length - arraySuffix.length) {
                    key = key.slice(0, -arraySuffix.length);
                    if (!(key in result)) {
                        result[key] = [];
                    }
                }
                if (key in result) {
                    if (Object.prototype.toString.call(result[key]) == '[object Array]') {
                        result[key].push(value);
                    } else {
                        result[key] = [result[key], value];
                    }
                } else {
                    result[key] = value;
                }
            });
        }
        return result;
    };
    //#endlabel toQueryParams

    //#label format
    /**
     * Форматирует строку, заменяя в ней <ul>
     *     <li>шаблоны вида ${number}, где number -- положительное число, на number по счету параметр.</li>
     *     <li>шаблоны вида ${string} на значение свойства string первого переданного аргумента.</li>
     * </ul> Если решетка экранирована символом \, то замена не производится.
     * @return {String}
     */
    S.format = function(data) {
        var args = arguments;
        return this.replace(/(^|.|\r|\n)(\$\{(.*?)\})/g, function(ignore, before, template, name) {
            if (before == '\\') {
                return template;
            } else if (/^[0-9]+$/.test(name)) {
                return before + [args[+name]].join();
            } else {
                return before + [data && data[name]].join();
            }
        });
    };

    /**
     * Статический метод. Вызывает метод format в контексте строки str с аргументами args.
     * @param {String} str Форматируемая строка.
     * @param {Array} args Аргументы, передаваемые в {@link S.format}.
     * @return {String}
     */
    String.format = function(str, args) {
        return S.format.apply(str, args);
    };
    //#endlabel format

    //#label times
    /**
     * Повторяет строку count раз.
     * @param {Number} count
     * @return {String}
     */
    S.times = function(count) {
        return new Array(count + 1).join(this);
    };
    //#endlabel times

    //#label startsWith
    /**
     * Проверяет, начинается ли строка с search.
     * @param {String} search
     * @return {Boolean}
     */
    S.startsWith = function(search) {
        return this.indexOf(search) == 0;
    };
    //#endlabel startsWith

    //#label endsWith
    /**
     * Проверяет, заканчивается ли строка на search.
     * @param {String} search
     * @return {Boolean}
     */
    S.endsWith = function(search) {
        return this.length > search.length && this.lastIndexOf(search) == this.length - search.length;
    };
    //#endlabel endsWith

    //#label toFragment
    /**
     * Создаёт из текущей строки DocumentFragment для последующего добавления его в DOM-дерево.
     * @param {Document} doc Документ, в контексте которого создаётся фрагмент. По умолчанию текущий документ.
     * @return {DocumentFragment}
     */
    S.toFragment = function(doc) {
        doc = doc || document;
        var div = doc.createElement('div');
        var fragment = doc.createDocumentFragment();
        div.innerHTML = this.valueOf();
        while (div.firstChild) {
            fragment.appendChild(div.firstChild);
        }
        return fragment;
    };
    //#endlabel toFragment
})(String.prototype);
