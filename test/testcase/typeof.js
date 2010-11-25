var TypeofTest = TestCase.create({
    name: 'typeof',

    testIsArray: function() {
        this.assertTrue(Array.isArray([]));
        this.assertFalse(Array.isArray(2));
        this.assertFalse(Array.isArray(''));
        this.assertFalse(Array.isArray(new Date()));
        this.assertFalse(Array.isArray(/^$/));
    },

    testIsDate: function() {
        this.assertFalse(isDate([]));
        this.assertFalse(isDate(2));
        this.assertFalse(isDate(''));
        this.assertTrue(isDate(new Date()));
        this.assertFalse(isDate(/^$/));
    },

    testIsRegExp: function() {
        this.assertFalse(isRegExp([]));
        this.assertFalse(isRegExp(2));
        this.assertFalse(isRegExp(''));
        this.assertFalse(isRegExp(new Date()));
        this.assertTrue(isRegExp(/^$/));
    }
});