(function(A) {
    //#label indexOf
    /**
     * Возвращает номер, под которым находится object в массиве, или -1, если object не нашелся.
     * Поиск ведется с начала массива.
     * @param {mixed} object Искомый объект.
     * @return {Number} Индекс элемента или -1, если не найден.
     */
    A.indexOf = A.indexOf || function(object) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === object) {
                return i;
            }
        }
        return -1;
    };
    //#endlabel indexOf

    //#label lastIndexOf
    /**
     * Возвращает номер, под которым находится object в массиве, или -1, если object не нашелся.
     * Поиск ведется с конца массива.
     * @param {mixed} object Искомый объект.
     * @return {Number} Индекс элемента или -1, если не найден.
     */
    A.lastIndexOf = A.lastIndexOf || function(object) {
        for (var i = this.length - 1; i >= 0; i--) {
            if (i in this && this[i] === object) {
                return i;
            }
        }
        return -1;
    };
    //#endlabel lastIndexOf

    //#label forEach
    /**
     * Перебирает элементы массива и для каждого вызывает fn в контексте scope. В fn передаются следующие
     * параметры <ul>
     *      <li>элемент массива;</li>
     *      <li>текущий индекс;</li>
     *      <li>ссылка на сам массив.</li>
     * </ul>
     * @param {Function} fn Callback-функция.
     * @param {Object} scope Контекст вызова.
     */
    A.forEach = A.forEach || function(fn, scope) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this) {
                fn.call(scope, this[i], i, this);
            }
        }
    };
    //#endlabel forEach

    //#label map
    /**
     * Возвращает массив, содержащий элементы исходного массива после обработки функцией fn, вызванной в
     * контексте scope. Вызов fn аналогичен {@link #forEach}.
     * @param {Function} fn Callback-функция.
     * @param {Object} scope Контекст вызова.
     * @return {Array} Результирующий массив.
     */
    A.map = A.map || function(fn, scope) {
        var result = [];
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this) {
                result[i] = fn.call(scope, this[i], i, this);
            }
        }
        return result;
    };
    //#endlabel map

    //#label filter
    /**
     * Возвращает массив, содержащий только те элементы исходного массива, для которых fn вернула
     * истинное значение. Вызов fn аналогичен {@link #forEach}.
     * @param {Function} fn Callback-функция.
     * @param {Object} scope Контекст вызова.
     * @return {Array} Результирующий массив.
     */
    A.filter = A.filter || function(fn, scope) {
        var result = [];
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && fn.call(scope, this[i], i, this)) {
                result.push(this[i]);
            }
        }
        return result;
    };
    //#endlabel filter

    //#label every
    /**
     * Возвращает true, если fn для каждого элемента массива вернула истинное значение. Вызов fn
     * аналогичен {@link #forEach}.
     * @param {Function} fn Callback-функция.
     * @param {Object} scope Контекст вызова.
     * @return {Boolean}
     */
    A.every = A.every || function(fn, scope) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && !fn.call(scope, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
    //#endlabel every

    //#label some
    /**
     * Возвращает true, если fn хотя бы для одного элемента массива вернула истинное значение.
     * После первого найденного истинного значения перебор прекращается. Вызов fn аналогичен
     * {@link #forEach}.
     * @param {Function} fn Callback-функция.
     * @param {Object} scope Контекст вызова.
     * @return {Boolean}
     */
    A.some = A.some || function(fn, scope) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && fn.call(scope, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
    //#endlabel some

    //#label reduce
    /**
     * Итеративно сводит массив к единственному значению (возможно к другому массиву). Если параметр
     * init не задан, то им становится первый элемент массива (не элемент с индексом 0, а первый
     * элемент). На первой итерации в fn первым параметром передается init, на последующих — результат
     * выполнения на предыдущей итерации. Вторым параметром в fn передается очередной элемент
     * массива. Если init не передан, то перебор, соответственно, начинается со второго элемента.
     * Возвращается результат выполнения функции fn на последней итерации. Если вызывается у пустого
     * массива и не передан init, то бросается исключение TypeError.
     * @param {Function} fn Callback-функция.
     * @param {mixed} init Инициирующее значение.
     * @return {mixed} Результат последнего вызова fn.
     */
    A.reduce = A.reduce || function(fn, init) {
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
    //#endlabel reduce

    //#label reduceRight
    /**
     * То же самое, что {@link #reduce}, но перебор ведется с конца массива.
     * @param {Function} fn Callback-функция.
     * @param {mixed} init Инициирующее значение.
     * @return {mixed} Результат последнего вызова fn.
     */
    A.reduceRight = A.reduceRight || function(fn, init) {
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
    //#endlabel reduceRight

    //#label clone
    /**
     * Клонирование массива.
     * @return {Array} Копия исходного массива.
     */
    A.clone = function() {
        return this.slice(0);
    };
    //#endlabel clone

    //#label first
    /**
     * Возвращает первый элемент массива, который не обязательно элемент с индексом 0.
     * Если передан параметр fn, но возвращается первый элемент массива, для которого fn
     * вернул истинное значение. Вызов fn аналогичен {@forEach}.
     * @param {Function} fn Callback-функция.
     * @param {Object} scope Контекст вызова.
     * @return {mixed}
     */
    A.first = function(fn, scope) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && (!fn || fn.call(scope, this[i], i, this))) {
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
     * fn аналогичен {@forEach}.
     * @param {Function} fn Callback-функция.
     * @param {Object} scope Контекст вызова.
     * @return {mixed}
     */
    A.last = function(fn, scope) {
        for (var i = this.length - 1; i >= 0; i--) {
            if (i in this && (!fn || fn.call(scope, this[i], i, this))) {
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
     * @return {Boolean}
     */
    A.include = function() {
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
     * @param {mixed} object Удаляемый элемент.
     * @return {Array} this
     */
    A.remove = function(object) {
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
     * @return {Array}
     */
    A.compact = function() {
        return this.filter(function(value) {
            return !!value;
        });
    };
    //#endlabel compact

    //#label flatten
    //#include ::reduce
    /**
     * Разворачивает все вложенные массивы в один одномерный массив.
     * @return {Array}
     */
    A.flatten = function() {
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
     * @return {Array}
     */
    A.without = function() {
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
     * @return {Array} Результирующий массив.
     */
    A.unique = function() {
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
    A.shuffle = function() {
        this.sort(function() {
            return Math.random() > 0.5 ? 1 : -1;
        });
    };
    //#endlabel shuffle
})(Array.prototype);
