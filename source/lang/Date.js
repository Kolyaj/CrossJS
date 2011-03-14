(function(Date, Date_prototype) {
    //#label clone
    /**
     * Клонирует объект даты.
     *
     * @return {Date}
     */
    Date_prototype.clone = function() {
        return new Date_prototype(this.getTime());
    };
    //#endlabel clone

    //#label isLeapYear
    /**
     * Возвращает true, если год даты високосный, иначе false.
     *
     * @return {Boolean}
     */
    Date_prototype.isLeapYear = function() {
        var year = this.getFullYear();
        return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
    };
    //#endlabel isLeapYear

    //#label getDaysInMonth
    //#include ::isLeapYear
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
    //#endlabel getDaysInMonth

    //#label between
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
    //#endlabel between

    //#label clearTime
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
    //#endlabel clearTime

    //#label getDayOfYear
    //#include ::getDaysInMonth::isLeapYear
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
    //#endlabel getDayOfYear

    //#label getGMTOffset
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
    //#endlabel getGMTOffset

    //#label getWeekOfYear
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
    //#endlabel getWeekOfYear

    //#label format
    //#include ::isLeapYear::getDaysInMonth::getDayOfYear::getGMTOffset::getWeekOfYear
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
    //#endlabel format
})(Date, Date.prototype);