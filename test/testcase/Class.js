var ClassTest = TestCase.create({
    name: 'Class',
    testCreate: function() {
        var A = Class.create({
            init: function(a) {
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
    },

    testExtend: function() {
        var createdA = false;
        var A = Class.create({
            init: function(a) {
                createdA = true;
                this.a = a;
            },

            method1: function() {
                return this.a;
            },

            method2: function(b) {
                return this.a + b;
            }
        });
        var B = Class.extend(A, {
            init: function(b) {
                this.b = b;
                B.superclass.init.apply(this, arguments);
            },

            method3: function(c) {
                return this.a + c;
            }
        });
        this.assertFalse(createdA);
        var b = new B(5);
        this.assertTrue(createdA);

        this.assertInstanceOf(A, b);
        this.assertEqual(5, b.a);
        this.assertEqual(5, b.b);
        this.assertEqual(5, b.method1());
        this.assertEqual(7, b.method2(2));
        this.assertEqual(7, b.method3(2));
    },

    testSingleton: function() {
        var S = Class.singleton({
            init: function() {
                this.a = 5;
            },
            getA: function() {
                return this.a;
            }
        });
        var s1 = new S();
        var s2 = new S();
        this.assertSame(s1, s2);
        this.assertSame(S(), s1);
        this.assertEqual(5, s1.getA());
    }
});