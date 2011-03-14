(function(Math) {
    //#label rand
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
    //#endlabel rand
})(Math);
