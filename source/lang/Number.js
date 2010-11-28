(function(Number_prototype) {
    //#label plural
    /**
     * Выбирает из forms нужную форму слова, соответствующую данному числу. Например,
     * 2..plural('комментарий|комментария|комментариев') вернет '2&nbsp;комментария'.
     * Для выбора нужной формы использует {@link Number.pluralIndex}, которая переопределяется в случае локализации.
     * @param {String} forms Формы слова, разделенные вертикальной чертой |. Для русского языка первая форма
     * соответствует числу 1, вторая -- числу 2, третья -- числу 5.
     * @param {Boolean} hideNumber Если параметр установлен в true, то само число подставляться в результат не будет.
     * @return {String} Число и соответствующая ему форма, разделенные &nbsp;.
     */
    Number_prototype.plural = function(forms, hideNumber) {
        return (hideNumber ? '' : this.valueOf() + '&nbsp;') + forms.split('|')[Number.pluralIndex(this.valueOf())];
    };
    //#endlabel plural
})(Number.prototype);

//#label plural
/**
 * Возвращает номер формы слова для {@link N#plural}. Для русского языка от 0, 1 или 2. В случае локализации
 * переопределяется под нужный язык. Формулы для многих языков имеются на странице http://translate.sourceforge.net/wiki/l10n/pluralforms
 * @param {Number} n Число, для которого определяется форма.
 * @return {Number} Номер формы.
 */
Number.pluralIndex = function(n) {
    return (n%10 == 1 && n%100 != 11 ? 0 : n%10 >= 2 && n%10 <= 4 && (n%100 < 10 || n%100 >= 20) ? 1 : 2);
};
//#endlabel plural