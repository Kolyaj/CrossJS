//#label createCookie
/**
 * Создаёт cookie.
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
//#endlabel createCookie

//#label readCookie
/**
 * Возвращает значение cookie, если она установлена.
 * @param {String} name Имя куки.
 * @return {String} Значение куки или null, если куки с таким именем нет.
 */
function readCookie(name) {
    if (document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'))) {
        return RegExp.$1;
    }
    return null;
}
//#endlabel readCookie

//#label eraseCookie
//#include ::createCookie
/**
 * Удаляет cookie.
 * @param {String} name Имя удаляемой куки.
 */
function eraseCookie(name) {
	createCookie(name, '', -1);
}
//#endlabel eraseCookie
