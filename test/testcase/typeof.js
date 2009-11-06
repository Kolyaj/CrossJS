var TypeofTest = TestCase.create({
    name: 'typeof',

    testIsArray: function() {
        this.assertTrue(isArray([]));
        this.assertFalse(isArray(2));
        this.assertFalse(isArray(''));
        this.assertFalse(isArray(new Date()));
        this.assertFalse(isArray(/^$/));
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