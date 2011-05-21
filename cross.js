(function(Array, Array_prototype) {
    if (!Array_prototype.indexOf) {
        /**
         * Возвращает номер, под которым находится object в массиве, или -1, если object не нашелся.
         * Поиск ведется с начала массива.
         *
         * @param {*} object Искомый объект.
         *
         * @return {Number} Индекс элемента или -1, если не найден.
         */
        Array_prototype.indexOf = function(object) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === object) {
                    return i;
                }
            }
            return -1;
        };
    }

    if (!Array_prototype.lastIndexOf) {
        /**
         * Возвращает номер, под которым находится object в массиве, или -1, если object не нашелся.
         * Поиск ведется с конца массива.
         *
         * @param {*} object Искомый объект.
         *
         * @return {Number} Индекс элемента или -1, если не найден.
         */
        Array_prototype.lastIndexOf = function(object) {
            for (var i = this.length - 1; i >= 0; i--) {
                if (i in this && this[i] === object) {
                    return i;
                }
            }
            return -1;
        };
    }

    if (!Array_prototype.forEach) {
        /**
         * Перебирает элементы массива и для каждого вызывает fn в контексте ctx. В fn передаются
         * параметры: элемент массива, текущий индекс, ссылка на сам массив.
         *
         * @param {Function} fn Callback-функция.
         * @param {Object} [ctx] Контекст вызова callback-функции.
         */
        Array_prototype.forEach = function(fn, ctx) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this) {
                    fn.call(ctx, this[i], i, this);
                }
            }
        };
    }

    if (!Array_prototype.map) {
        /**
         * Возвращает массив, содержащий элементы исходного массива после обработки функцией fn, вызванной в
         * контексте ctx. Вызов fn аналогичен forEach.
         *
         * @param {Function} fn Callback-функция.
         * @param {Object} [ctx] Контекст вызова callback-функции.
         *
         * @return {Array} Результирующий массив.
         */
        Array_prototype.map = function(fn, ctx) {
            var result = [];
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this) {
                    result[i] = fn.call(ctx, this[i], i, this);
                }
            }
            return result;
        };
    }

    if (!Array_prototype.filter) {
        /**
         * Возвращает массив, содержащий только те элементы исходного массива, для которых fn вернула
         * истинное значение. Вызов fn аналогичен forEach.
         *
         * @param {Function} fn Callback-функция.
         * @param {Object} [ctx] Контекст вызова callback-функции.
         *
         * @return {Array} Результирующий массив.
         */
        Array_prototype.filter = function(fn, ctx) {
            var result = [];
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && fn.call(ctx, this[i], i, this)) {
                    result.push(this[i]);
                }
            }
            return result;
        };
    }

    if (!Array_prototype.every) {
        /**
         * Возвращает true, если fn для каждого элемента массива вернула истинное значение. Вызов fn
         * аналогичен forEach.
         *
         * @param {Function} fn Callback-функция.
         * @param {Object} [ctx] Контекст вызова callback-функции.
         *
         * @return {Boolean}
         */
        Array_prototype.every = function(fn, ctx) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && !fn.call(ctx, this[i], i, this)) {
                    return false;
                }
            }
            return true;
        };
    }

    if (!Array_prototype.some) {
        /**
         * Возвращает true, если fn хотя бы для одного элемента массива вернула истинное значение.
         * После первого найденного истинного значения перебор прекращается. Вызов fn аналогичен forEach.
         *
         * @param {Function} fn Callback-функция.
         * @param {Object} [ctx] Контекст вызова callback-функции.
         *
         * @return {Boolean}
         */
        Array_prototype.some = function(fn, ctx) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && fn.call(ctx, this[i], i, this)) {
                    return true;
                }
            }
            return false;
        };
    }

    if (!Array_prototype.reduce) {
        /**
         * Итеративно сводит массив к единственному значению (возможно к другому массиву). Если параметр
         * init не задан, то им становится первый элемент массива (не элемент с индексом 0, а первый
         * элемент). На первой итерации в fn первым параметром передается init, на последующих — результат
         * выполнения на предыдущей итерации. Вторым параметром в fn передается очередной элемент
         * массива. Если init не передан, то перебор, соответственно, начинается со второго элемента.
         * Возвращается результат выполнения функции fn на последней итерации. Если вызывается у пустого
         * массива и не передан init, то бросается исключение TypeError.
         *
         * @param {Function} fn Callback-функция.
         * @param {*} [init] Инициирующее значение.
         *
         * @return {*} Результат последнего вызова fn.
         */
        Array_prototype.reduce = function(fn, init) {
            var i = 0, l = this.length;
            if (arguments.length < 2) {
                if (this.length == 0) {
                    throw new TypeError('reduce of empty array with no initial value');
                }
                for (; i < l; i++) {
                    if (i in this) {
                        init = this[i];
                        i++;
                        break;
                    }
                }
            }
            for (; i < l; i++) {
                if (i in this) {
                    init = fn(init, this[i], i, this);
                }
            }
            return init;
        };
    }

    if (!Array_prototype.reduceRight) {
        /**
         * То же самое, что reduce, но перебор ведется с конца массива.
         *
         * @param {Function} fn Callback-функция.
         * @param {*} [init] Инициирующее значение.
         *
         * @return {*} Результат последнего вызова fn.
         */
        Array_prototype.reduceRight = function(fn, init) {
            var i = this.length - 1;
            if (arguments.length < 2) {
                if (this.length == 0) {
                    throw new TypeError('reduce of empty array with no initial value');
                }
                for (; i >= 0; i--) {
                    if (i in this) {
                        init = this[i];
                        i--;
                        break;
                    }
                }
            }
            for (; i >= 0; i--) {
                if (i in this) {
                    init = fn(init, this[i], i, this);
                }
            }
            return init;
        };
    }

    /**
     * Клонирование массива.
     *
     * @return {Array} Копия исходного массива.
     */
    Array_prototype.clone = function() {
        return this.slice(0);
    };

    /**
     * Возвращает первый элемент массива, который не обязательно элемент с индексом 0.
     * Если передан параметр fn, то возвращается первый элемент массива, для которого fn
     * вернул истинное значение. Вызов fn аналогичен forEach.
     *
     * @param {Function} [fn] Callback-функция.
     * @param {Object} [ctx] Контекст вызова для callback-функции.
     *
     * @return {*}
     */
    Array_prototype.first = function(fn, ctx) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && (!fn || fn.call(ctx, this[i], i, this))) {
                return this[i];
            }
        }
        return null;
    };

    /**
     * Возвращает последний элемент массива.Если передан параметр fn, но возвращается первый
     * элемент при переборе с конца массива, для которого fn вернул истинное значение. Вызов
     * fn аналогичен forEach.
     * @param {Function} [fn] Callback-функция.
     * @param {Object} [ctx] Контекст вызова.
     *
     * @return {*}
     */
    Array_prototype.last = function(fn, ctx) {
        for (var i = this.length - 1; i >= 0; i--) {
            if (i in this && (!fn || fn.call(ctx, this[i], i, this))) {
                return this[i];
            }
        }
        return null;
    };

    /**
     * Возвращает true, если все переданные аргументы присутствуют в массиве.
     *
     * @return {Boolean}
     */
    Array_prototype.include = function() {
        for (var i = 0; i < arguments.length; i++) {
            if (this.indexOf(arguments[i]) == -1) {
                return false;
            }
        }
        return true;
    };

    /**
     * Удаляет все вхождения object из исходного массива.
     *
     * @param {*} object Удаляемый элемент.
     *
     * @return {Array} this
     */
    Array_prototype.remove = function(object) {
        var index;
        while ((index = this.indexOf(object)) != -1) {
            this.splice(index, 1);
        }
        return this;
    };

    /**
     * Возвращает массив, состоящий из ненулевых элементов исходного массива.
     *
     * @return {Array}
     */
    Array_prototype.compact = function() {
        return this.filter(function(value) {
            return !!value;
        });
    };

    /**
     * Разворачивает все вложенные массивы в один одномерный массив.
     *
     * @return {Array}
     */
    Array_prototype.flatten = function() {
        return this.reduce(function(result, value) {
            if (Object.prototype.toString.call(value) == '[object Array]') {
                return result.concat(value.flatten());
            }
            result.push(value);
            return result;
        }, []);
    };

    /**
     * Возвращает массив, не содержащий ни одного из переданных элементов.
     *
     * @return {Array}
     */
    Array_prototype.without = function() {
        var values = [].slice.call(arguments, 0);
        return this.filter(function(value) {
            return !values.include(value);
        });
    };

    /**
     * Удаляет повторяющиеся элементы из массива. Из двух одинаковых элементов будет удален элемент
     * с большим индексом.
     *
     * @return {Array} Результирующий массив.
     */
    Array_prototype.unique = function() {
        var values = [];
        return this.filter(function(value) {
            if (!values.include(value)) {
                values.push(value);
                return true;
            }
        });
    };

    /**
     * Перемешивает элементы массива.
     */
    Array_prototype.shuffle = function() {
        for (var i = this.length - 1; i > 0; i--) {
            var num = Math.floor(Math.random() * (i + 1));
            var d = this[num];
            this[num] = this[i];
            this[i] = d;
        }
    };

    /**
     * Асинхронно перебирает элементы массива с задержкой после каждого элемента.
     *
     * @param {Number} delay Задержка в миллисекундах.
     * @param {Function} fn Функция, вызываемая во время каждой итерации. Передаются элемент массива, индекс
     *      и сам массив. Если вернет false, то обработка массива прекращается.
     * @param {Object} [ctx] Контекст вызова функций fn.
     *
     * @return {Object} Объект с методом complete, которому передаются функция и контекст для её вызова,
     *      которая будет вызвана по окончании перебора элементов.
     */
    Array_prototype.deferForEach = function(delay, fn, ctx) {
        var i = 0, completed = false, onComplete, onCompleteCtx, arr = this;

        function complete() {
            completed = true;
            if (typeof onComplete == 'function') {
                onComplete.call(onCompleteCtx);
            }
        }

        if (this.length) {
            (function() {
                if (fn.call(ctx, arr[i], i, arr) !== false && ++i < arr.length) {
                    setTimeout(arguments.callee, delay);
                } else {
                    complete();
                }
            })();
        } else {
            complete();
        }

        return {
            complete: function(fn, ctx) {
                if (completed) {
                    fn.call(ctx);
                } else {
                    onComplete = fn;
                    onCompleteCtx = ctx;
                }
            }
        };
    };

    if (!Array.isArray) {
        /**
         * Возвращает true, если переданный аргумент является массивом, иначе false.
         *
         * @param {*} obj
         *
         * @return {Boolean}
         */
        Array.isArray = function(obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        };
    }

    /**
     * Возвращает массив, содержащий count последовательных чисел, начиная со start. Если передан только один
     * аргумент, то он считается количеством элементов, а отсчет производится с нуля.
     *
     * @param {Number} start Стартовое число.
     * @param {Number} [count] Количество элементов.
     *
     * @return {Array} Массив последовательных чисел.
     */
    Array.range = function(start, count) {
        if (arguments.length < 2) {
            count = start || 0;
            start = 0;
        }
        var a = [];
        for (var i = start; i < start + count; i++) {
            a.push(i);
        }
        return a;
    };
})(Array, Array.prototype);

(function(Date, Date_prototype) {
    /**
     * Клонирует объект даты.
     *
     * @return {Date}
     */
    Date_prototype.clone = function() {
        return new Date_prototype(this.getTime());
    };

    /**
     * Возвращает true, если год даты високосный, иначе false.
     *
     * @return {Boolean}
     */
    Date_prototype.isLeapYear = function() {
        var year = this.getFullYear();
        return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
    };

    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    /**
     * Возвращает количество дней в месяце даты.
     *
     * @return {Number}
     */
    Date_prototype.getDaysInMonth = function() {
        var m = this.getMonth();
        return m == 1 && this.isLeapYear() ? 29 : daysInMonth[m];
    };

    /**
     * Возвращает true, если дата находится между start и end.
     *
     * @param {Date} start Нижняя граница.
     * @param {Date} end Верхняя граница.
     *
     * @return {Boolean}
     */
    Date_prototype.between = function(start, end) {
        var t = this.getTime();
        return start.getTime() <= t && t <= end.getTime();
    };

    /**
     * Обнуляет значения часов, минут, секунд и миллисекунд у даты.
     *
     * @return {Date} this
     */
    Date_prototype.clearTime = function() {
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0);
        return this;
    };

    /**
     * Возвращает номер дня в году, начиная с 0.
     *
     * @return {Number}
     */
    Date_prototype.getDayOfYear = function() {
        var num = 0;
        daysInMonth[1] = this.isLeapYear() ? 29 : 28;
        for (var i = 0, m = this.getMonth(); i < m; ++i) {
            num += daysInMonth[i];
        }
        return num + this.getDate() - 1;
    };

    var pad = function(n) {
        return (n < 10 ? '0' : '') + n;
    };
    /**
     * Возвращает с временем по Гринвичу в часах (первые две цифры) и минутах (вторые две цифры)
     *
     * @param {Boolean} [colon] Если передано true, то часы и минуты будут разделены двоеточием.
     *
     * @return {String}
     */
    Date_prototype.getGMTOffset = function(colon) {
        return (this.getTimezoneOffset() > 0 ? "-" : "+")
            + pad(Math.floor(Math.abs(this.getTimezoneOffset()) / 60))
            + (colon ? ':' : '')
            + pad(Math.abs(this.getTimezoneOffset() % 60));
    };

    /**
     * Возвращает номер недели в году. Аналогично спецификатору W метода {@link #format}, но без ведущего нуля.
     *
     * @return {Number} Число от 1 до 53.
     */
    Date_prototype.getWeekOfYear = function() {
        // adapted from http://www.merlyn.demon.co.uk/weekcalc.htm
        var ms1d = 864e5; // milliseconds in a day
        var ms7d = 7 * ms1d; // milliseconds in a week
        var DC3 = Date_prototype.UTC(this.getFullYear(), this.getMonth(), this.getDate() + 3) / ms1d; // an Absolute Day Number
        var AWN = Math.floor(DC3 / 7); // an Absolute Week Number
        var Wyr = new Date_prototype(AWN * ms7d).getUTCFullYear();
        return AWN - Math.floor(Date_prototype.UTC(Wyr, 0, 7) / ms7d) + 1;
    };

    var formatters = {};

    var symbols = {
        a: 'd.getHours()<12?"am":"pm"',
        A: 'd.getHours()<12?"AM":"PM"',
        c: '{Y}+"-"+pad({n})+"-"+pad({j})+"T"+pad({G})+":"+{i}+":"+{s}+d.getGMTOffset(true)', 
        d: 'pad({j})',
        D: '["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]',
        F: '["January","February","March","April","May","June","July","August","September","October","November","December"][d.getMonth()]',
        g: 'd.getHours()%12||12',
        G: 'd.getHours()',
        h: 'pad({g})',
        H: 'pad({G})',
        i: 'pad(d.getMinutes())',
        j: 'd.getDate()',
        l: '["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()]',
        L: 'd.isLeapYear()?1:0',
        m: 'pad({n})',
        M: '["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]',
        n: 'd.getMonth()+1',
        O: 'd.getGMTOffset()',
        r: '{D}+", "+{d}+" "+{M}+" "+{Y}+" "+{H}+":"+{i}+":"+{s}+" "+{O}',
        s: 'pad(d.getSeconds())',
        S: '["st","nd","rd"][{1:0,21:0,31:0,2:1,22:1,3:2,23:2}[{j}]]||"th"',
        t: 'd.getDaysInMonth()',
        U: 'Math.floor(d.getTime()/1e3)',
        w: 'd.getDay()',
        W: 'pad(d.getWeekOfYear())',
        y: 'd.getFullYear()%100',
        Y: 'd.getFullYear()',
        z: 'd.getDayOfYear()', 
        Z: '-60*d.getTimezoneOffset()'
    };

    for (var i in symbols) {
        symbols[i] = symbols[i].replace(/\{([a-z])\}/ig, function(match, symbol) {
            return symbols[symbol] || match;
        });
    }

    /**
     * Возвращает время, отформатированное в соответствии с аргументом fm.
     *
     * @param {String} fm Строка формата, в которой распознаются следующие символы
     *  a -- Ante meridiem или Post meridiem в нижнем регистре (am или pm)
     *  A -- Ante meridiem или Post meridiem в верхнем регистре (AM или PM)
     *  c -- Дата в формате ISO 8601 (например: 2004-02-12T15:19:21+00:00)
     *  d -- День месяца, 2 цифры с ведущими нулями (от 01 до 31)
     *  D -- Сокращенное наименование дня недели, 3 символа (от Mon до Sun)
     *  F -- Полное наименование месяца, например January или March (от January до December)
     *  g -- Часы в 12-часовом формате без ведущих нулей (От 1 до 12)
     *  G -- Часы в 24-часовом формате без ведущих нулей (От 0 до 23)
     *  h -- Часы в 12-часовом формате с ведущими нулями (От 01 до 12)
     *  H -- Часы в 24-часовом формате с ведущими нулями (От 00 до 23)
     *  i -- Минуты с ведущими нулями (от 00 до 59)
     *  j -- День месяца без ведущих нулей (От 1 до 31)
     *  l (строчная 'L') -- Полное наименование дня недели (От Sunday до Saturday)
     *  L -- Признак високосного года (1, если год високосный, иначе 0)
     *  m -- Порядковый номер месяца с ведущими нулями (От 01 до 12)
     *  M -- Сокращенное наименование месяца, 3 символа (От Jan до Dec)
     *  n -- Порядковый номер месяца без ведущих нулей (От 1 до 12)
     *  O -- Разница с временем по Гринвичу в часах (Например: +0200)
     *  r -- Дата в формате <a href="http://www.faqs.org/rfcs/rfc2822">RFC 2822</a> (Например: Thu, 21 Dec 2000 16:01:07 +0200)
     *  s -- Секунды с ведущими нулями (От 00 до 59)
     *  S -- Английский суффикс порядкового числительного дня месяца, 2 символа (st, nd, rd или th. Применяется совместно с j)
     *  t -- Количество дней в месяце (От 28 до 31)
     *  U -- Количество секунд, прошедших с начала Эпохи Unix (The Unix Epoch, 1 января 1970, 00:00:00 GMT)
     *  w -- Порядковый номер дня недели (От 0 (воскресенье) до 6 (суббота))
     *  W -- Порядковый номер недели года по ISO-8601, первый день недели - понедельник
     *  Y -- Порядковый номер года, 4 цифры (Примеры: 1999, 2003)
     *  y -- Номер года, 2 цифры (Примеры: 99, 03)
     *  z -- Порядковый номер дня в году (нумерация с 0) (От 0 до 365)
     *  Z -- Смещение временной зоны в секундах. Для временных зон западнее UTC это отрицательное число, восточнее UTC - положительное. (От -43200 до 43200)
     * Любые другие символы, встреченные в строке format, будут выведены в результирующую строку без изменений.
     * Избежать распознавания символа как форматирующего можно, если экранировать этот символ с помощью \, при этом
     * сам \ в строке тоже надо экранировать, т.о. фактически нужно ставить два символа \.
     *
     * @return {String} Строка с отформатированным датой/временем.
     */
    Date_prototype.format = function(fm) {
        if (!formatters[fm]) {
            var escaping = false;
            formatters[fm] = new Function('d', 'var pad=' + pad.toString() + ';return""' + fm.replace(/./g, function(symbol) {
                if (symbol == '\\') {
                    escaping = !escaping;
                    return escaping ? '' : '+"\\\\"';
                }
                if (escaping || !symbols[symbol]) {
                    escaping = false;
                    return '+"' + symbol + '"';
                } else {
                    return '+(' + symbols[symbol] + ')';
                }
            }));
        }
        return formatters[fm](this);
    };
})(Date, Date.prototype);
(function(Object) {
    /**
     * Копирует свойства из всех аргументов, начиная со второго, в dst.
     *
     * @param {Object} dst Объект, в который копируются свойства.
     *
     * @return {Object} Объект dst.
     */
    Object.mixin = function(dst) {
        for (var i = 1; i < arguments.length; i++) {
            for (var prop in arguments[i]) {
                if (arguments[i].hasOwnProperty(prop)) {
                    dst[prop] = arguments[i][prop];
                }
            }
            if (arguments[i].hasOwnProperty('toString')) {
                dst['toString'] = arguments[i]['toString'];
            }
        }
        return dst;
    };

    if (!Object.keys) {
        /**
         * Возвращает массив ключей объекта. В результирующем массиве присутствуют только те ключи, которые имеются
         * в самом объекте, а не в цепочке прототипов.
         *
         * @param {Object} obj
         *
         * @return {Array}
         */
        Object.keys = function(obj) {
            var keys = [];
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    keys.push(name);
                }
            }
            return keys;
        };
    }
})(Object);


/**
 * @class Function
 * Методы, расширяющие прототип Function.
 */
(function(Function_prototype) {
    /**
     * Создает функцию, вызывающую оригинальную функцию в переданном контексте с переданными параметрами.
     *
     * @param {Object} ctx Объект, в контексте которого будет вызываться функция.
     *
     * @return {Function} Новая функция.
     */
    Function_prototype.bind = function(ctx) {
        var that = this, args = [].slice.call(arguments, 1);
        return function() {
            return that.apply(ctx || this, args.concat([].slice.call(arguments, 0)));
        };
    };

    /**
     * Возвращает функцию, вызывающую исходную с задержкой delay в контексте ctx. Если во время задержки функция
     * была вызвана еще раз, то предыдующий вызов отменяется, а таймер обновляется. Таким образом из нескольких
     * вызовов, совершающихся чаще, чем delay, реально будет вызван только последний.
     *
     * @param {Number} delay
     * @param {Object} [ctx]
     *
     * @return {Function}
     */
    Function_prototype.debounce = function(delay, ctx) {
        var fn = this, timer;
        return function() {
            var args = arguments, that = this;
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(ctx || that, args);
            }, delay);
        };
    };

    /**
     * Возвращает функцию, вызывающую исходную функцию не чаще delay в контексте ctx. В отличие от {@link #debounce}
     * первый вызов происходит сразу.
     *
     * @param {Number} delay
     * @param {Object} [ctx]
     *
     * @return {Function}
     */
    Function_prototype.throttle = function(delay, ctx) {
        var fn = this, timer, args, that;
        return function() {
            args = arguments;
            that = this;
            if (!timer) {
                (function() {
                    timer = null;
                    if (args) {
                        fn.apply(ctx || that, args);
                        args = null;
                        timer = setTimeout(arguments.callee, delay);
                    } 
                })();
            }
        };
    };

    /**
     * Вызывает функцию через указанное количество миллисекунд в контексте ctx с аргументами args.
     *
     * @param {Number} millis
     * @param {Object} [ctx]
     * @param {Array} [args]
     *
     * @return {Number} Идентификатор таймаута.
     */
    Function_prototype.defer = function(millis, ctx, args) {
        var that = this;
        return window.setTimeout(function() {
            that.apply(ctx, args || []);
        }, millis);
    };

    /**
     * Создаёт конструктор, прототип которого наследует прототип текущего конструктора.
     * Для создания ничего не наследующего конструктора следует использовать Object.inherit({...}).
     *
     * @param {Object} proto Объект с методами и свойствами, копирующимися в прототип создаваемого конструктора.
     *
     * @return {Function} Созданный конструктор.
     */
    Function_prototype.inherit = function(proto) {
        var that = this;
        proto = proto || {};
        var constructor = proto.hasOwnProperty('constructor') ? proto.constructor : function() { that.apply(this, arguments); };
        var F = function() {};
        F.prototype = this.prototype;
        constructor.prototype = Object.mixin(new F(), proto);
        constructor.superclass = this.prototype;
        constructor.prototype.constructor = constructor;
        return constructor;
    };
})(Function.prototype);
var JSON = JSON || new function() {
    this.parse = function(json) {
        try {
            return new Function('return ' + json)();
        } catch (e) {
            throw new SyntaxError('JSON.parse');
        }
    };

    var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };


    function stringifyString(value) {
        return '"' + value.replace(escapable, function(c) {
            return meta[c] || '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
        }) + '"';
    }

    function pad(n) {
        return (n < 10 ? '0' : '') + n;
    }

    function stringifyDate(value) {
        return isFinite(value.valueOf()) ?
               value.getUTCFullYear()   + '-' +
             pad(value.getUTCMonth() + 1) + '-' +
             pad(value.getUTCDate())      + 'T' +
             pad(value.getUTCHours())     + ':' +
             pad(value.getUTCMinutes())   + ':' +
             pad(value.getUTCSeconds())   + 'Z' : null;
    }

    function stringifyArray(value) {
        var result = [];
        for (var i = 0; i < value.length; i++) {
            result.push(stringify(value[i]) || 'null');
        }
        return '[' + result.join(',') + ']';
    }

    function stringifyObject(value) {
        var result = [];
        for (var i in value) {
            if (value.hasOwnProperty(i)) {
                var jsonValue = stringify(value[i]);
                if (jsonValue) {
                    result.push(stringifyString(i) + ':' + jsonValue);
                }
            }
        }
        return '{' + result.join(',') + '}';
    }

    function stringify(value) {
        var type = {}.toString.call(value);
        if (/\[object (String|Number|Boolean)\]/.test(type)) {
            value = value.valueOf();
        }

        if (type == '[object Date]') {
            return stringifyDate(value);

        } else if (typeof value == 'string') {
            return stringifyString(value);

        } else if (typeof value == 'number') {
            return isFinite(value) ? String(value) : 'null';

        } else if (typeof value == 'boolean') {
            return String(value);

        } else if (value == null) {
            return 'null';

        } else if (type == '[object Array]') {
            return stringifyArray(value);

        } else if (type == '[object Object]') {
            return stringifyObject(value);

        } else {
            return '';
        }
    }

    this.stringify = stringify;
};

(function(Math) {
    /**
     * Генерирует случайное число в диапазоне от start до end. Если передан только один аргумент, то он считается
     * верхней границей, а нижняя при этом 0.
     *
     * @param {Number} start Нижняя граница диапазона генерируемых значений.
     * @param {Number} [end] Верхняя граница диапазона.
     *
     * @return {Number}
     */
    Math.rand = function(start, end) {
        if (arguments.length == 1) {
            end = start;
            start = 0;
        }
        return Math.round(Math.random() * (end - start)) + start;
    };
})(Math);

(function(Number, Number_prototype) {
    /**
     * Выбирает из forms нужную форму слова, соответствующую данному числу. Например,
     * 2..plural('комментарий|комментария|комментариев') вернет '2&nbsp;комментария'.
     * Для выбора нужной формы использует {@link Number.pluralIndex}, которая переопределяется в случае локализации.
     *
     * @param {String} forms Формы слова, разделенные вертикальной чертой |. Для русского языка первая форма
     *      соответствует числу 1, вторая -- числу 2, третья -- числу 5.
     * @param {Boolean} [hideNumber] Если параметр установлен в true, то само число подставляться в результат не будет.
     *
     * @return {String} Число и соответствующая ему форма, разделенные &nbsp;.
     */
    Number_prototype.plural = function(forms, hideNumber) {
        return (hideNumber ? '' : this.valueOf() + '&nbsp;') + forms.split('|')[Number.pluralIndex(this.valueOf())];
    };

    /**
     * Возвращает номер формы слова для plural. Для русского языка от 0, 1 или 2. В случае локализации
     * переопределяется под нужный язык.
     * Формулы для многих языков имеются на странице http://translate.sourceforge.net/wiki/l10n/pluralforms
     *
     * @param {Number} n Число, для которого определяется форма.
     *
     * @return {Number} Номер формы.
     */
    Number.pluralIndex = function(n) {
        return (n%10 == 1 && n%100 != 11 ? 0 : n%10 >= 2 && n%10 <= 4 && (n%100 < 10 || n%100 >= 20) ? 1 : 2);
    };
})(Number, Number.prototype);



(function(String, String_prototype) {
    String.queryCodecOptions = {
        encode: encodeURIComponent,
        decode: decodeURIComponent,
        arraySuffix: '[]'
    };

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

    /**
     * Удаляет скрипты из HTML-кода.
     *
     * @return {String} Строка без вхождений тегов script и их содержимого.
     */
    String_prototype.stripScripts = function() {
        return this.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    };

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

    /**
     * Удаляет HTML-теги из строки.
     *
     * @return {String}
     */
    String_prototype.stripTags = function() {
        return this.replace(/<\/?[^>]+>/gi, '');
    };

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
        body += this.replace(/(<%((&)?=)?(.*?)%>)|([\s\S]+?(?=(<%|$)))/g, function(wholeMatch, tag, assign, escape, tagValue) {
            if (tag) {
                if (assign) {
                    return (escape ? '${0}.push(new String(${1}).escapeHTML());' : '${0}.push(${1});').format(resultVarName, tagValue);
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
})(String, String.prototype);

/**
 * @class XMLHttpRequest
 *
 * Эмуляция XMLHttpRequest для IE, в результате которой работа с XHR во всех браузерах становится абсолютно
 * одинаковой (за исключением багов).
 */
var XMLHttpRequest = window.XMLHttpRequest || window.ActiveXObject && function() {
    return new ActiveXObject('Msxml2.XMLHTTP');
};


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

/**
 * @class Observer
 * @extends Object
 * Класс, предоставляющий интерфейс для генерации событий и для добавления слушателей. Нет никакого жесткого
 * списка событий, которые может генерировать данный класс. Типом события является обычная строка.
 * Подписчики вызываются в обратном порядке, в котором они были подписаны. Если в одном из обработчиков
 * произойдет ошибка, вызовется метод {@link Observer._handleListenerError} текущего обсервера, которому будет передан
 * объект ошибки, остальные обработчики будут вызваны в штатном режиме.
 * Подписчикам передается объект класса {@link Observer.Event}, обязательными свойствами которого являются
 * target (источник события) и name (имя события), а также метод stop, прерывающий дальнейшую обработку. Также
 * могут быть определены любые другие произвольные параметры, передаваемые из метода fireEvent.
 */
var Observer = Object.inherit({
    /**
     * @constructor
     */
    constructor: function() {
        this.Observer__listeners = {};
    },

    /**
     * Подписывает на событие.
     *
     * @param {String} name Имя события.
     * @param {Function} fn Фукнция, вызываемая при возникновении события.
     */
    addEventListener: function(name, fn) {
        this.Observer__listeners[name] = this.Observer__listeners[name] || [];
        this.Observer__listeners[name].unshift(fn);
    },

    /**
     * Отписка от события. Параметры должны быть в точности теми же, что и при подписке.
     * @param {String} name Имя события.
     * @param {Function} fn Подписанный обработчик.
     */
    removeEventListener: function(name, fn) {
        if (this.Observer__listeners[name]) {
            for (var i = 0; i < this.Observer__listeners.length; i++) {
                if (this.Observer__listeners[i] == fn) {
                    this.Observer__listeners.splice(i, 1);
                    return;
                }
            }
        }
    },

    /**
     * Посылает событие name с параметрами data.
     *
     * @param {String} name Имя события.
     * @param {Object} data Параметры, расширяемые передаваемый в обработчики объект события.
     *
     * @return {Boolean} false, если событие было остановлено, иначе true.
     */
    fireEvent: function(name, data) {
        if (this.Observer__listeners[name] || this.Observer__listeners['*']) {
            var evt = new Observer.Event(this, name, data);
            return !(this.Observer__listeners[name] || []).concat(this.Observer__listeners['*'] || []).some(function(fn) {
                try {
                    fn.call(this, evt);
                } catch (e) {
                    this._handleListenerError(e);
                }
                return evt.stopped;
            }, this);
        }
        return true;
    },

    /**
     * Обработчик ошибок, возникающих в подписчиках. По умолчанию бросает исключение в отдельном потоке, не
     * прерывая текущий. При желании можно переопределить данный метод, чтобы, например, логировать ошибки.
     *
     * @param {Error} err Объект ошибки.
     */
    _handleListenerError: function(err) {
        setTimeout(function() { throw err; }, 10);
    }
});

/**
 * @class Observer.Event
 * @extends Object
 *
 * Класс события, экземпляры которого передаются обработчикам.
 */
Observer.Event = Object.inherit({
    /**
     * @constructor
     * @param {Object} target Объект, в котором произошло событие
     * @param {String} name Имя события.
     * @param {Object} data Данные, передаваемые вместе с событием.
     */
    constructor: function(target, name, data) {
        Object.mixin(this, {
            /**
             * @property target
             * @type Object
             * Объект, в котором произошло событие.
             */
            target: target,

            /**
             * @property name
             * @type String
             * Имя события.
             */
            name: name
        }, data || {});
    },

    /**
     * Останавливает дальнейшую обработку события.
     */
    stop: function() {
        this.stopped = true;
    }
});

/**
 * @class Component
 * @extends Observer
 *
 * Абстрактный класс-заготовка для создания классов, принимающих в конструкторе хэш параметров. Позволяет создавать
 * классы, свойства и методы которых легко переопределить как в наследуемых классах, так и при создании экземпляра
 * класса.
 */
var Component = Observer.inherit({
    /**
     * @constructor
     * @param {Object} [config] Объект с конфигурационными параметрами.
     */
    constructor: function(config) {
        Component.superclass.constructor.apply(this, arguments);
        /**
         * @type {Object}
         * Ссылка на объект, переданный при создании компонента.
         */
        this._initialConfig = config || {};
        Object.mixin(this, this._initialConfig);
        this._initComponent();
    },

    /**
     * Инициализация компонента. В наследуемых классах в качестве конструктора следует переопределять именно
     * этот метод, тогда до вызова родительского initComponent, когда необходимо доопределить некоторые
     * параметры, конфигурационный объект, переданный в конструктор, будет уже скопирован в this.
     */
    _initComponent: function() {
    }
});
/**
 * Создаёт cookie.
 *
 * @param {String} name Имя куки.
 * @param {String} value Значение куки.
 * @param {Number} [days] Количество дней, на которое ставится кука.
 * @param {String} [path] Путь на сайте, для которого кука актуальна.
 */
function createCookie(name, value, days, path) {
    var expires = '';
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = ';expires=' + date.toGMTString();
	}
	document.cookie = name + '=' + value + expires + ';path=' + (path || '/');
}

/**
 * Возвращает значение cookie, если она установлена.
 *
 * @param {String} name Имя куки.
 *
 * @return {String} Значение куки или null, если куки с таким именем нет.
 */
function readCookie(name) {
    if (document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'))) {
        return RegExp.$1;
    }
    return null;
}

/**
 * Удаляет cookie.
 *
 * @param {String} name Имя удаляемой куки.
 */
function eraseCookie(name) {
	createCookie(name, '', -1);
}


/**
 * Возвращает имя и значение CSS свойства, актуальное для текущего браузера. Свойство opacity, например, для IE
 * преобразует в filter:Alpha(...). В данный момент поддерживаются: opacity, float, boxShadow.
 * Потенциально обрабатываемых свойств может быть много, поэтому для уменьшения объёма кода лучше подключать
 * только необходимые блоки.
 *
 * @param {String} name Имя свойства.
 * @param {String} value Значение свойства.
 * @param {Node} [el] DOM-элемент, которому будет присваиваться свойство. Актуально только для свойства float,
 *      т.к. в свойстве style оно имеет имя cssFloat/styleFloat.
 *
 * @return {Array} Массив с двумя элементами: имя и значение.
 */
function normalizeCSSProperty(name, value, el) {
    var etalon = el ? el.style : document.documentElement.style;
    name = name.camelize();

    if (name == 'opacity' && typeof etalon['opacity'] != 'string') {
        return ['filter', value == 1 ? '' : 'Alpha(opacity=' + (value * 100) + ')'];
    }

    if (/^(float|(style|css)Float)$/.test(name)) {
        name = 'float';
        if (el) {
            name = typeof etalon['cssFloat'] == 'string' ? 'cssFloat' : 'styleFloat';
        }
        return [name, value];
    }

    if (name == 'boxShadow') {
        ['MozBoxShadow', 'WebkitBoxShadow', 'boxShadow'].forEach(function(property) {
            if (typeof etalon[property] == 'string') {
                name = property;
            }
        });
        return [name, value];
    }

    return [name, value];
}
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
        var elements = $(parents[i]).getElementsByTagName(selector.split('.')[0] || '*');
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


/**
 * Устанавливает элементу el стили style. Стили передаются в виде объекта. Имена стилей, состоящие из нескольких
 * строк, пишутся в кавычках ('font-size': '12px', 'border-bottom': '1px solid red', ...).
 *
 * @param {Node/String} el Элемент, которому устанавливаются стили, или его id.
 * @param {Object} style Хэш со стилями, например, {fontSize: '12px', width: '30px'}
 */
function setElementStyle(el, style) {
    el = $(el);
    for (var name in style) {
        var propValue = normalizeCSSProperty(name, style[name]);
        el.style[propValue[0].camelize()] = propValue[1];
    }
}


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


/**
 * Добавляет CSS-класс элементу, если у элемента нет такого класса.
 *
 * @param {Node/String} el Элемент или его id.
 * @param {String} className Имя добавляемого класса.
 *
 * @return {Boolean} true, если класса не было и он добавился, иначе false.
 */
function addClassName(el, className) {
    if (!classNameExists(el, className)) {
        $(el).className += ' ' + className;
        return true;
    }
    return false;
}


/**
 * Удаляет CSS-класс у элемента, если у элемента есть такой класс.
 *
 * @param {Node/String} el Элемент или его id.
 * @param {String} className Имя удаляемого класса.
 *
 * @return {Boolean} true, если класс был и он удалился, иначе false.
 */
function removeClassName(el, className) {
    el = $(el);
    var newClassName = el.className.replace(new RegExp('(^|\\s)' + className + '(?=\\s|$)', 'g'), ' ');
    if (newClassName != el.className) {
        el.className = newClassName;
        return true;
    }
    return false;
}


/**
 * Добавляет/удаляет CSS-класс className у элемента el в зависимости от параметра adding. Если adding не указан,
 * то класс удаляется, если он есть, и добавляется, если его нет.
 *
 * @param {Node/String} el Элемент или его id.
 * @param {String} className Имя CSS-класса.
 * @param {Boolean} [adding] Добавить или удалить класс.
 *
 * @return {Boolean} true, если переключилось наличие класса, иначе false.
 */
function toggleClassName(el, className, adding) {
    if (arguments.length < 3) {
        adding = !classNameExists(el, className);
    }
    if (adding) {
        return addClassName(el, className);
    } else {
        return removeClassName(el, className);
    }
}


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
        for (var j = 0; j < events.length; j++) {
            args.callee(args[0], events[j], args[2], args[3]);
        }
        return null;
    }
    processEventArguments.listeners = processEventArguments.listeners || [];
    return processEventArguments.listeners;
}


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


var EventObject = {};

/**
 * Возвращает источник события. Если указан selector, то производится проход вверх по дереву в поисках
 * элемента удовлетворяющего селектору. Селектор передается в {@link getElementParent}.
 *
 * @param {String} [selector] Строка селектора.
 * @param {Number} [depth] Если указан, то поиск производится не глубже этого значения.
 *
 * @return {Node} Найденный элемент или null, если ничего не найдено.
 */
EventObject.getTarget = function(selector, depth) {
    var target = this.target || this.srcElement;
    return arguments.length ? getElementParent(target, selector, depth, true) : target;
};

/**
 * Возвращает позицию события мыши.
 *
 * @return {Array} Массив целых чисел вида [left, top].
 */
EventObject.getPoint = function() {
    var doc = (this.target || this.srcElement).ownerDocument, scroll = getDocumentScroll(doc), rootElem = getRootElement(doc);
    return [this.pageX || (this.clientX + scroll[0] - (rootElem.clientLeft || 0)) || 0,
            this.pageY || (this.clientY + scroll[1] - (rootElem.clientTop  || 0)) || 0];
};

/**
 * Останавливает всплытие события.
 */
EventObject.stop = function() {
    if (this.preventDefault) {
        this.preventDefault();
        this.stopPropagation();
    } else {
        this.returnValue = false;
        this.cancelBubble = true;
    }
};

/**
 * Возвращает true, если нажата левая кнопка мыши.
 *
 * @return {Boolean}
 */
EventObject.isLeftClick = function() {
    return (this.which && this.which == 1) || (this.button && this.button == 1);
};

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
        unEvent(doc, {
            mousemove: onMouseMove,
            mouseup: onMouseUp
        });
    }

    onEvent(el, 'mousedown', function(evt) {
        lastPoint = evt.getPoint();
        if (!listeners.start || listeners.start.call(listeners.ctx, evt) !== false) {
            onEvent(doc, {
                mousemove: onMouseMove,
                mouseup: onMouseUp
            });
            evt.stop();
        }
    });
}


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

// Фикс бага IE6, из-за которого не кэшируются фоновые изображения.
try { document.execCommand("BackgroundImageCache", false, true); } catch (ignore) {}

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


