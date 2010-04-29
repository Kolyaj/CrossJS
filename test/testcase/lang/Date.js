var DateTest = TestCase.create({
    name: 'Date',

    testFormat: function() {
        this.assertEquals('K D \\', new Date().format('K \\D \\\\'));

        this.assertEquals('am', new Date('10 Feb 2010 10:10').format('a'));
        this.assertEquals('pm', new Date('10 Feb 2010 20:10').format('a'));
        this.assertEquals('AM', new Date('10 Feb 2010 10:10').format('A'));
        this.assertEquals('PM', new Date('10 Feb 2010 20:10').format('A'));

        this.assertEquals('2010-03-21T22:42:11+03:00', new Date('21 Mar 2010 22:42:11').format('c'));

        this.assertEquals('02', new Date('2 Feb 2010').format('d'));
        this.assertEquals('22', new Date('22 Feb 2010').format('d'));

        this.assertEquals('Tue', new Date('23 Feb 2010').format('D'));

        this.assertEquals('April', new Date('1 Apr 2010').format('F'));

        this.assertEquals('12', new Date('1 Feb 2010 0:21').format('g'));
        this.assertEquals('1',  new Date('1 Feb 2010 1:20').format('g'));
        this.assertEquals('11', new Date('1 Feb 2010 11:30').format('g'));
        this.assertEquals('12', new Date('1 Feb 2010 12:40').format('g'));
        this.assertEquals('1',  new Date('1 Feb 2010 13:10').format('g'));
        this.assertEquals('11', new Date('1 Feb 2010 23:05').format('g'));

        this.assertEquals('0',  new Date('1 Feb 2010 0:21').format('G'));
        this.assertEquals('1',  new Date('1 Feb 2010 1:20').format('G'));
        this.assertEquals('11', new Date('1 Feb 2010 11:30').format('G'));
        this.assertEquals('12', new Date('1 Feb 2010 12:40').format('G'));
        this.assertEquals('13', new Date('1 Feb 2010 13:10').format('G'));
        this.assertEquals('23', new Date('1 Feb 2010 23:05').format('G'));

        this.assertEquals('12', new Date('1 Feb 2010 0:21').format('h'));
        this.assertEquals('01', new Date('1 Feb 2010 1:20').format('h'));
        this.assertEquals('11', new Date('1 Feb 2010 11:30').format('h'));
        this.assertEquals('12', new Date('1 Feb 2010 12:40').format('h'));
        this.assertEquals('01', new Date('1 Feb 2010 13:10').format('h'));
        this.assertEquals('11', new Date('1 Feb 2010 23:05').format('h'));

        this.assertEquals('00', new Date('1 Feb 2010 0:21').format('H'));
        this.assertEquals('01', new Date('1 Feb 2010 1:20').format('H'));
        this.assertEquals('11', new Date('1 Feb 2010 11:30').format('H'));
        this.assertEquals('12', new Date('1 Feb 2010 12:40').format('H'));
        this.assertEquals('13', new Date('1 Feb 2010 13:10').format('H'));
        this.assertEquals('23', new Date('1 Feb 2010 23:05').format('H'));

        this.assertEquals('05', new Date('1 Feb 2010 13:05').format('i'));
        this.assertEquals('45', new Date('1 Feb 2010 20:45').format('i'));

        this.assertEquals('2',  new Date('2 Feb 2010').format('j'));
        this.assertEquals('22', new Date('22 Feb 2010').format('j'));

        this.assertEquals('Tuesday', new Date('23 Feb 2010').format('l'));

        this.assertEquals('0', new Date('23 Feb 2010').format('L'));
        this.assertEquals('1', new Date('23 Feb 2008').format('L'));

        this.assertEquals('02', new Date('23 Feb 2010').format('m'));
        this.assertEquals('10', new Date('23 Oct 2010').format('m'));

        this.assertEquals('Apr', new Date('1 Apr 2010').format('M'));

        this.assertEquals('2', new Date('23 Feb 2010').format('n'));
        this.assertEquals('10', new Date('23 Oct 2010').format('n'));

        this.assertEquals('07', new Date('23 Feb 2010 20:40:07').format('s'));
        this.assertEquals('47', new Date('23 Feb 2010 20:40:47').format('s'));

        this.assertEquals('nd', new Date('2 Feb 2010').format('S'));
        this.assertEquals('st', new Date('31 Mar 2010').format('S'));
        this.assertEquals('nd', new Date('22 Feb 2010').format('S'));
        this.assertEquals('th', new Date('11 Feb 2010').format('S'));
        this.assertEquals('th', new Date('25 Feb 2010').format('S'));
        this.assertEquals('rd', new Date('23 Feb 2010').format('S'));

        this.assertEquals('28', new Date('23 Feb 2010').format('t'));

        this.assertEquals('1266917852', new Date(1266917852797).format('U'));

        this.assertEquals('2', new Date('23 Feb 2010').format('w'));

        this.assertEquals('10', new Date('23 Feb 2010').format('y'));
        this.assertEquals('2010', new Date('23 Feb 2010').format('Y'));

        this.assertEquals('0', new Date('1 Jan 2010').format('z'));
        this.assertEquals('1', new Date('2 Jan 2010 4:23').format('z'));
        this.assertEquals('213 31', new Date('2 Aug 2010 7:00').format('z W'));

        this.assertEquals('Wed, 03 Mar 2010 22:55:53 +0300', new Date('3 Mar 2010 22:55:53').format('r'));
    },

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