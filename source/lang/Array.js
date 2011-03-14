(function(Array, Array_prototype) {
    //#label indexOf
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
    //#endlabel indexOf

    //#label lastIndexOf
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
    //#endlabel lastIndexOf

    //#label forEach
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
    //#endlabel forEach

    //#label map
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
    //#endlabel map

    //#label filter
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
    //#endlabel filter

    //#label every
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
    //#endlabel every

    //#label some
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
    //#endlabel some

    //#label reduce
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
    //#endlabel reduce

    //#label reduceRight
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
    //#endlabel reduceRight

    //#label clone
    /**
     * Клонирование массива.
     *
     * @return {Array} Копия исходного массива.
     */
    Array_prototype.clone = function() {
        return this.slice(0);
    };
    //#endlabel clone

    //#label first
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
    //#endlabel first

    //#label last
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
    //#endlabel last

    //#label include
    //#include ::indexOf
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
    //#endlabel include

    //#label remove
    //#include ::indexOf
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
    //#endlabel remove

    //#label compact
    //#include ::filter
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
    //#endlabel compact

    //#label flatten
    //#include ::reduce
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
    //#endlabel flatten

    //#label without
    //#include ::filter::include
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
    //#endlabel without

    //#label unique
    //#include ::filter::include
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
    //#endlabel unique

    //#label shuffle
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
    //#endlabel shuffle

    //#label deferForEach
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
    //#endlabel deferForEach

    //#label isArray
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
    //#endlabel isArray

    //#label range
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
    //#endlabel range
})(Array, Array.prototype);
