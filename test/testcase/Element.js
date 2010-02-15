var ElementTest = TestCase.create({
    name: 'Element',

    testRemove: function() {
        this.assertExists('#remove1');
        $E.remove('remove1');
        this.assertNotExists('#remove1');
        this.assertExists('#remove2');
        $E('remove2').remove();
        this.assertNotExists('#remove2');
    },

    testClassName: function() {
        this.assertTrue($E.classExists('className', 'class1'));
        var el = $E('className');
        this.assertTrue(el.classExists('class2'));
        this.assertTrue(el.classExists('class3'));
        el.removeClass('class2');
        this.assertTrue(el.classExists('class1'));
        this.assertFalse(el.classExists('class2'));
        this.assertTrue(el.classExists('class3'));
        el.addClass('class4');
        this.assertTrue(el.classExists('class1'));
        this.assertTrue(el.classExists('class3'));
        this.assertTrue(el.classExists('class4'));
        el.addClass('class4');
        el.removeClass('class4');
        this.assertFalse(el.classExists('class4'));
        el.addClass('class5-class5');
        el.removeClass('class5');
        this.assertTrue(el.classExists('class5-class5'));
    },

    testGetParent: function() {
        var el = $E('getParent3'), parent1 = $('getParent1'), parent2 = $('getParent2');
        this.assertSame(parent2, el.getParent());
        this.assertSame(parent2, el.getParent('div'));
        this.assertSame(parent2, el.getParent('div.parent3'));
        this.assertSame(parent2, el.getParent('.parent3'));
        this.assertSame(parent1, el.getParent('.parent1'));
        this.assertSame(parent1, el.getParent('.parent2'));
        this.assertSame(parent1, el.getParent('.parent2.parent1'));
        this.assertSame(parent1, el.getParent('.parent1.parent2'));
        this.assertSame(parent1, el.getParent('div.parent1.parent2'));
        this.assertNull(el.getParent('div.parent1.parent2', 1));
        this.assertSame(parent1, el.getParent('div.parent1.parent2', 2));
        this.assertSame(el, el.getParent('div', 0, true));
    }
});