var FunctionTest = TestCase.create({
    name: 'Function',
    testBind: function() {
        function foo(a, b, c, d, e, f) {
            return [this[a], this[b], this[c], this[d], this[e], this[f]];
        }
        var a = [1, 2, 3, 4, 5, 6];
        var bar = foo.bind(a, 0, 1, 2);
        this.assertEqual([1, 2, 3, 4, 5, 6], bar(3, 4, 5));
    }
});