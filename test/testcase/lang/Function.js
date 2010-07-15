var FunctionTest = TestCase.create({
    name: 'Function',
    testBind: function() {
        function foo(a, b, c, d, e, f) {
            return [this[a], this[b], this[c], this[d], this[e], this[f]];
        }
        var a = [1, 2, 3, 4, 5, 6];
        var bar = foo.bind(a, 0, 1, 2);
        this.assertEqual([1, 2, 3, 4, 5, 6], bar(3, 4, 5));
    },

    testInherit: function() {
        var A = Object.inherit({
            constructor: function(a) {
                this.a = a;
            },

            method1: function() {
                return this.a;
            },

            method2: function(b) {
                return this.a + b;
            }
        });
        var a = new A(5);
        this.assertEqual(5, a.a);
        this.assertEqual(5, a.method1());
        this.assertEqual(7, a.method2(2));

        var createdB = false;
        var B = Object.inherit({
            constructor: function(a) {
                createdB = true;
                this.a = a;
            },

            method1: function() {
                return this.a;
            },

            method2: function(b) {
                return this.a + b;
            }
        });
        var C = B.inherit({
            constructor: function(b) {
                this.b = b;
                C.superclass.constructor.apply(this, arguments);
            },

            method3: function(c) {
                return this.a + c;
            }
        });
        var D = C.inherit();
        this.assertFalse(createdB);
        var c = new D(5);
        this.assertTrue(createdB);

        this.assertInstanceOf(B, c);
        this.assertEqual(5, c.a);
        this.assertEqual(5, c.b);
        this.assertEqual(5, c.method1());
        this.assertEqual(7, c.method2(2));
        this.assertEqual(7, c.method3(2));

    }
});