var DateTest = TestCase.create({
    name: 'Date',

    testClone: function() {
        var d1 = new Date();
        var d2 = d1.clone();
        this.assertFalse(d1 == d2);
        this.assertTrue(d1.getTime() == d2.getTime());
    },

    testIsLeapYear: function() {
        var d = new Date();
        d.setYear(2000);
        this.assertTrue(d.isLeapYear());
        d.setYear(2001);
        this.assertFalse(d.isLeapYear());
        d.setYear(2004);
        this.assertTrue(d.isLeapYear());
    },

    testGetDaysInMonth: function() {
        var d = new Date();
        d.setYear(2004);
        d.setMonth(0);
        this.assertEquals(31, d.getDaysInMonth());
        d.setMonth(1);
        this.assertEquals(29, d.getDaysInMonth());
    }
});