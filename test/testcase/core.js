var CoreTest = TestCase.create({
    name: 'core',

    test$$: function() {
        var res;

        res = $$('.test1');
        this.assertEquals(2, res.length);
        this.assertEquals(['d1', 'd2'], res.map(function(e) { return e.id; }));

        this.assertEquals('d2', $$('!div.test2').id);
        this.assertEquals(['d1', 'd2', 'd3'], $$('div', {
            filter: function(e) {
                return e.id && /^test[123]/.test(e.className);
            },
            map: function(e) {
                return e.id;
            }
        }));
        this.assertEquals('d10d21d32', $$('div', {
            filter: function(e) {
                return e.id && /^test[123]/.test(e.className);
            },
            map: function(e) {
                return e.id;
            },
            reduce: function(str, id, index) {
                return str + id + index;
            },
            reduceInit: ''
        }));
    },

    testGetWindow: function() {
        this.assertSame(window, getWindow(document));
    },

    testCookie: function() {
        createCookie('foo', 'bar');
        this.assertEquals('bar', readCookie('foo'));
        eraseCookie('foo');
        this.assertNull(readCookie('foo'));
    }
});
