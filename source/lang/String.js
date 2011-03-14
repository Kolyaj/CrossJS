//#label toQueryParams
//#include Array.js::forEach
//#endlabel toQueryParams

//#label compile
//#include JSON.js::stringify
//#endlabel compile

(function(String, String_prototype) {
    //#label queryCodecOptions
    String.queryCodecOptions = {
        encode: encodeURIComponent,
        decode: decodeURIComponent,
        arraySuffix: '[]'
    };
    //#endlabel queryCodecOptions

    //#label fromQueryParams
    //#include ::queryCodecOptions
    /**
     * Статический метод. Преобразует хэш параметров object в строку параметров в формате урла. Если значение параметра
     * является массивом, то к имени параметра добавляется значение настраиваемого свойства
     * String.queryCodecOptions.arraySuffix (по умолчанию '[]') и параметр повторяется столько раз, сколько элементов
     * в массиве. Функцию кодирования, вместо encodeURIComponent, можно установить в параметре
     * String.queryCodecOptions.encode.
     *
     * @param {Object} object Хэш с параметрами.
     *
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

    //#label stripScripts
    /**
     * Удаляет скрипты из HTML-кода.
     *
     * @return {String} Строка без вхождений тегов script и их содержимого.
     */
    String_prototype.stripScripts = function() {
        return this.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    };
    //#endlabel stripScripts

    //#label extractScripts
    /**
     * Возвращает содержимое тегов script из исходной строки с HTML-кодом.
     *
     * @return {Array} Массив строк, содержащих содержимое тегов script.
     */
    String_prototype.extractScripts = function() {
        var scripts = [];
        this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(outer, inner) {
            scripts.push(inner);
        });
        return scripts;
    };
    //#endlabel extractScripts

    //#label trim
    if (!String_prototype.trim) {
        /**
         * Удаляет пробельные символы из начала и конца строки.
         *
         * @return {String} Копия строки без начальных и конечных пробельных символов.
         */
        String_prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }
    //#endlabel trim

    //#label trimLeft
    if (!String_prototype.trimLeft) {
        /**
         * Удаляет пробельные символы из начала строки.
         *
         * @return {String} Копия строки без начальный пробельных символов.
         */
        String_prototype.trimLeft = function() {
            return this.replace(/^\s+/, '');
        };
    }
    //#endlabel trimLeft

    //#label trimRight
    if (!String_prototype.trimRight) {
        /**
         * Удаляет пробельные символы из конца строки.
         *
         * @return {String} Копия строки без конечных пробельных символов.
         */
        String_prototype.trimRight = function() {
            return this.replace(/\s+$/, '');
        };
    }
    //#endlabel trimRight

    //#label truncate
    /**
     * Обрезает строку до длины length в центре. Вместо вырезанного куска вставляет строку truncation.
     *
     * @param {Number} length Длина результирующей строки.
     * @param {String} [truncation] Строка, добавляемая вместо вырезанной части (по умолчанию '...').
     *
     * @return {String} Обрезанная строка.
     */
    String_prototype.truncate = function(length, truncation) {
        if (this.length <= length) {
            return this.valueOf();
        }
        truncation = truncation || '...';
        var median = Math.floor((length - truncation.length) / 2);
        return this.slice(0, median) + truncation + this.slice(-median);
    };
    //#endlabel truncate

    //#label truncateLeft
    /**
     * Обрезает строку до длины length слева. Вместо вырезанного куска вставляет строку truncation.
     *
     * @param {Number} length Длина результирующей строки.
     * @param {String} [truncation] Строка, добавляемая вместо вырезанной части (по умолчанию '...').
     *
     * @return {String} Обрезанная строка.
     */
    String_prototype.truncateLeft = function(length, truncation) {
        if (this.length <= length) {
            return this.valueOf();
        }
        truncation = truncation || '...';
        return truncation + this.slice(truncation.length - length);
    };
    //#endlabel truncateLeft

    //#label truncateRight
    /**
     * Обрезает строку до длины length справа. Вместо вырезанного куска вставляет строку truncation.
     *
     * @param {Number} length Длина результирующей строки.
     * @param {String} [truncation] Строка, добавляемая вместо вырезанной части (по умолчанию '...').
     *
     * @return {String} Обрезанная строка.
     */
    String_prototype.truncateRight = function(length, truncation) {
        if (this.length <= length) {
            return this.valueOf();
        }
        truncation = truncation || '...';
        return this.slice(0, length - truncation.length) + truncation;
    };
    //#endlabel truncateRight

    //#label stripTags
    /**
     * Удаляет HTML-теги из строки.
     *
     * @return {String}
     */
    String_prototype.stripTags = function() {
        return this.replace(/<\/?[^>]+>/gi, '');
    };
    //#endlabel stripTags

    //#label escapeHTML
    /**
     * Экранирует HTML-теги в HTML-сущности.
     *
     * @return {String}
     */
    String_prototype.escapeHTML = function() {
        var div = document.createElement('DIV');
        var text = document.createTextNode(this);
        div.appendChild(text);
        return div.innerHTML;
    };
    //#endlabel escapeHTML

    //#label unescapeHTML
    //#include ::stripTags
    /**
     * Переводит HTML-сущности в соответствующие теги.
     *
     * @return {String}
     */
    String_prototype.unescapeHTML = function() {
        var div = document.createElement('DIV');
        div.innerHTML = this.stripTags();
        return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
    };
    //#endlabel unescapeHTML

    //#label camelize
    /**
     * Переводит строки из dash-style в camelStyle.
     *
     * @return {String}
     */
    String_prototype.camelize = function() {
        return this.replace(/-([a-z])/g, function() {
            return arguments[1].toUpperCase();
        });
    };
    //#endlabel camelize

    //#label uncamelize
    /**
     * Выполняет преобразование, обратное {@link #camelize}, т.е. строку вида camelCaseStyle преобразует в
     * camel-case-style.
     *
     * @return {String}
     */
    String_prototype.uncamelize = function() {
        return this.replace(/[A-Z]/g, function(letter) {
            return '-' + letter.toLowerCase();
        });
    };
    //#endlabel uncamelize

    //#label toQueryParams
    //#include ::trim::queryCodecOptions
    /**
     * Преобразует строку в формате параметров URL в объект. Повторяющиеся элементы и элементы, имена которых
     * заканчиваются на настраиваемый параметр String.queryCodecOptions.arraySuffix, преобразуются в массив
     * с удалением arraySuffix из имени. Функцию декодирования, вместо decodeURIComponent, можно установить в
     * параметре String.queryCodecOptions.decode.
     *
     * @return {Object}
     */
    String_prototype.toQueryParams = function() {
        var self = this.trim(), result = {};
        var decode = String.queryCodecOptions.decode, arraySuffix = String.queryCodecOptions.arraySuffix;
        if (self.length) {
            self.split('&').forEach(function(part) {
                if (part) {
                    var pair = part.split('=');
                    if (pair[0]) {
                        var key = decode(pair[0]), value = decode((pair[1] || '').replace(/\+/g, '%20'));
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
                    }
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
     * </ul> Если $ экранирован символом \, то замена не производится.
     *
     * @return {String}
     */
    String_prototype.format = function(data) {
        var args = arguments;
        return this.replace(/(^|.|\r|\n)(\$\{(.*?)\})/g, function(ignore, before, template, name) {
            if (before == '\\') {
                return template;
            } else if (/^[0-9]+$/.test(name)) {
                return before + [args[+name]].join('');
            } else {
                return before + [data && data[name]].join('');
            }
        });
    };

    /**
     * Статический метод. Вызывает метод {@link #format} в контексте строки str с аргументами args.
     *
     * @param {String} str Форматируемая строка.
     * @param {Array} args Аргументы, передаваемые в {@link #format}.
     *
     * @return {String}
     */
    String.format = function(str, args) {
        return String_prototype.format.apply(str, args);
    };
    //#endlabel format

    //#label times
    /**
     * Повторяет строку count раз.
     *
     * @param {Number} count
     *
     * @return {String}
     */
    String_prototype.times = function(count) {
        return new Array(count + 1).join(this);
    };
    //#endlabel times

    //#label startsWith
    /**
     * Проверяет, начинается ли строка с search.
     *
     * @param {String} search
     *
     * @return {Boolean}
     */
    String_prototype.startsWith = function(search) {
        return this.indexOf(search) == 0;
    };
    //#endlabel startsWith

    //#label endsWith
    /**
     * Проверяет, заканчивается ли строка на search.
     *
     * @param {String} search
     *
     * @return {Boolean}
     */
    String_prototype.endsWith = function(search) {
        return this.length > search.length && this.lastIndexOf(search) == this.length - search.length;
    };
    //#endlabel endsWith

    //#label toFragment
    /**
     * Создаёт из текущей строки DocumentFragment для последующего добавления его в DOM-дерево.
     *
     * @param {Document} doc Документ, в контексте которого создаётся фрагмент. По умолчанию текущий документ.
     *
     * @return {DocumentFragment}
     */
    String_prototype.toFragment = function(doc) {
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

    //#label compile
    //#include ::format
    /**
     * Компилирует строку, содержащую шаблон, в функцию, этот шаблон применяющую к своему контексту.
     * Шаблон понимает два вида тегов:
     *      * <%= Выражение, которое необходимо вывести. %>
     *      * <% Произвольный JS-код %>
     * Всё, что находится вне этих тегов, выводится как есть.
     * Переменные в шаблон передаются в контексте вызова результирующей функции.
     *
     * @return {Function}
     */
    String_prototype.compile = function() {
        var resultVarName = '$_' + Math.round(Math.random() * 1e5);
        var body = 'var ${0}=[];'.format(resultVarName);
        body += this.replace(/(<%(=)?(.*?)%>)|([\s\S]+?(?=(<%|$)))/g, function(wholeMatch, tag, assign, tagValue) {
            if (tag) {
                if (assign) {
                    return '${0}.push(${1});'.format(resultVarName, tagValue);
                } else {
                    return '${0}\n'.format(tagValue);
                }
            } else {
                return '${0}.push(${1});'.format(resultVarName, JSON.stringify(wholeMatch));
            }
        });
        body += 'return ${0}.join("");'.format(resultVarName);
        return new Function(body);
    };
    //#endlabel compile
})(String, String.prototype);
