(function(D) {
    //#label clone
    /**
     * Клонирует объект даты.
     * @return {Date}
     */
    D.clone = function() {
        return new Date(this.getTime());
    };
    //#endlabel clone

    //#label isLeapYear
    /**
     * Возвращает true, если год даты високосный, иначе false.
     * @return {Boolean}
     */
    D.isLeapYear = function() {
        var year = this.getFullYear();
        return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
    };
    //#endlabel isLeapYear

    //#label getDaysInMonth
    //#include_once "self::isLeapYear"
    /**
     * Возвращает количество дней в месяце даты.
     * @return {Number}
     */
    D.getDaysInMonth = function() {
        var m = this.getMonth();
        return m == 1 && this.isLeapYear() ? 29 : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
    };
    //#endlabel getDaysInMonth

    //#label between
    /**
     * Возвращает true, если дата находится между start и end.
     * @param {Date} start Нижняя граница.
     * @param {Date} end Верхняя граница.
     * @return {Boolean}
     */
    D.between = function(start, end) {
        var t = this.getTime();
        return start.getTime() <= t && t <= end.getTime();
    };
    //#endlabel between

    //#label clearTime
    /**
     * Обнуляет значения часов, минут, секунд и миллисекунд у даты.
     * @return {Date} this
     */
    D.clearTime = function() {
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0);
        return this;
    };
    //#endlabel clearTime
})(Date.prototype);