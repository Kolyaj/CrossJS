

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
