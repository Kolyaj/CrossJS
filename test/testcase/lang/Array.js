var ArrayTest = TestCase.create({
    name: 'Array',

    testForEach: function() {
        var a = [1, 2, 3];
        a[10] = 5;
        var s = 0, ii = [];
        a.forEach(function(el, i) {
            s += el;
            ii.push(i);
        });
        this.assertEqual(11, s);
        this.assertEqual([0, 1, 2, 10], ii);
    },

    testIndexOf: function() {
        this.assertEqual(3, [1, 2, 3, 4, 5, 6].indexOf(4));
        this.assertEqual(-1, [1, 2, 3, 4, 5].indexOf(6));
        var a = [1, 2, 3];
        a[10] = undefined;
        this.assertEqual(10, a.indexOf(undefined));
    },

    testLastIndexOf: function() {
        this.assertEqual(6, [1, 2, 3, 4, 5, 4, 3, 2, 1].lastIndexOf(3));
    },

    testMap: function() {
        this.assertEqual([1, 4, 9, 16, 25, 36], [1, 2, 3, 4, 5, 6].map(function(i) { return i * i; }));
        var a = [1, 2, 3];
        a[10] = 4;
        var res = [1, 4, 9];
        res[10] = 16;
        this.assertEqual(res, a.map(function(i) { return i * i; }));
    },

    testFilter: function() {
        this.assertEqual([1, 3, 5, 7, 9], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].filter(function(i) { return i % 2; }));
    },

    testEvery: function() {
        this.assertTrue([1, 3, 5, 7, 9].every(function(i) { return i % 2; }));
        this.assertFalse([1, 2, 3, 5, 7, 9].every(function(i) { return i % 2; }));
    },

    testSome: function() {
        this.assertTrue([2, 4, 5, 6, 8].some(function(i) { return i % 2; }));
        this.assertFalse([2, 4, 6, 8].some(function(i) { return i % 2; }));
    },

    testReduce: function() {
        this.assertEqual(10, [1, 2, 3, 4].reduce(function(sum, i) { return sum + i; }));
        this.assertEqual(15, [1, 2, 3, 4].reduce(function(sum, i) { return sum + i; }, 5));
        this.assertThrows(TypeError, [].reduce, []);
    },

    testReduceRight: function() {
        this.assertEqual(10, [1, 2, 3, 4].reduceRight(function(sum, i) { return sum + i; }));
        this.assertEqual(15, [1, 2, 3, 4].reduceRight(function(sum, i) { return sum + i; }, 5));
        this.assertThrows(TypeError, [].reduceRight, []);
    },

    testClone: function() {
        this.assertEqual([1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6].clone());
    },

    testFirst: function() {
        var a1 = [5, 4, 3, 2];
        this.assertEqual(5, a1.first());

        var a2 = [];
        a2[3] = 1;
        a2[4] = 2;
        a2[5] = 3;
        this.assertEqual(1, a2.first());

        var a3 = [2, 4, 6, 9];
        this.assertEqual(9, a3.first(function(i) { return i % 2; }));

        this.assertEqual(null, [].first());
    },

    testLast: function() {
        var a1 = [5, 4, 3, 2];
        this.assertEqual(2, a1.last());

        var a2 = [];
        a2[3] = 1;
        a2[4] = 2;
        a2[5] = 3;
        this.assertEqual(3, a2.last());

        var a3 = [2, 4, 6, 9];
        this.assertEqual(6, a3.last(function(i) { return !(i % 2); }));

        this.assertEqual(null, [].last());
    },

    testInclude: function() {
        var a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.assertTrue(a.include(4));
        this.assertTrue(a.include(6, 3));
        this.assertTrue(a.include(1, 9, 6, 2));
        this.assertFalse(a.include(10));
        this.assertFalse(a.include(3, 4, 10));
        this.assertFalse(a.include(4, 10, 6));
    },

    testRemove: function() {
        var a = [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1];
        this.assertEqual([1, 2, 3, 4, 6, 7, 6, 4, 3, 2, 1], a.remove(5));
        this.assertEqual([1, 2, 3, 4, 6, 6, 4, 3, 2, 1], a.remove(7));
        this.assertEqual([2, 3, 4, 6, 6, 4, 3, 2], a.remove(1));
    },

    testCompact: function() {
        var a = [1, 4, 0, 2, 5, null, undefined, 12, '', -2, 'asdf'];
        this.assertEqual([1, 4, 2, 5, 12, -2, 'asdf'], a.compact());
    },

    testFlatten: function() {
        var a = [1, 2, 3,
            [4, 5, 6, 7],
            [8, 9, [10, 11, 12,
                [13, 14, 15]
            ]]
        ];
        this.assertEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], a.flatten());
    },

    testWithout: function() {
        var a = [1, 2, 3, 4, 5, 6, 7];
        this.assertEqual([1, 2, 3, 4, 6, 7], a.without(5));
        this.assertEqual([1, 2, 6, 7], a.without(5, 3, 4));
        this.assertEqual([2, 3, 4, 6], a.without(7, 5, 1, 23, 12));
        this.assertEqual([1, 6, 7], a.without(5, 2, 3, 4, 34, 65));
    },

    testUnique: function() {
        var a = [1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3, 2, 1];
        this.assertEqual([1, 2, 3, 4, 5], a.unique());
    }
});