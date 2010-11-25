
//#label random
/**
 * Генерирует случайное число в диапазоне от start до end. Если передан только один аргумент, то он считается
 * верхней границей, а нижняя при этом 0.
 * @param {Number} start Нижняя граница диапазона генерируемых значений.
 * @param {Number} end Верхняя граница диапазона.
 * @return {Number}
 */
function random(start, end) {
    if (arguments.length == 1) {
        end = start;
        start = 0;
    }
    return Math.round(Math.random() * (end - start)) + start;
}
//#endlabel random

//#label exec
/**
 * Выполняет код в глобальном контексте.
 * @param {String} str Код, который необходимо выполнить.
 */
function exec(str) {
    if (str.length) {
        if (typeof window.execScript == 'object' && String(window.execScript) == '\nfunction execScript() {\n    [native code]\n}\n') {
            window['execScript'](str);
        } else {
            eval.call(window, str);
        }
    }
}
//#endlabel exec
