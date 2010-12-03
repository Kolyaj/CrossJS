var ObserverTest = TestCase.create({
    name: 'Observer',

    testSimple: function() {
        var i = 0;
        var obs = new Observer();
        function test2() {
            i *= 2;
        };
        obs.on('event1', function() {
            i += 1;
        });
        obs.on('event2', function() {
            i += 3;
        });
        obs.on('event1', test2);
        obs.fireEvent('event1');
        this.assertEquals(1, i);
        obs.fireEvent('event2');
        this.assertEquals(4, i);
        obs.fireEvent('event1');
        this.assertEquals(9, i);
        obs.un('event1', test2);
        obs.fireEvent('event1');
        this.assertEquals(10, i);
    },

    testConstructor: function() {
        var i = 0;
        var obs = new Observer({
            event: function() {
                i++;
            }
        });
        obs.fireEvent('event');
        this.assertEquals(1, i);
    },

    testListenersByObject: function() {
        this.i = 0;
        function listener1() {
            this.i += 5;
        }
        function listener2() {
            this.i *= 2;
        }
        var obs = new Observer({
            event1: listener1,
            event2: listener2,
            ctx: this
        });
        obs.fireEvent('event1');
        obs.fireEvent('event2');
        this.assertEquals(10, this.i);
        obs.un({
            event1: listener1,
            event2: listener2
        });
        obs.fireEvent('event1');
        obs.fireEvent('event2');
        this.assertEquals(30, this.i);
        obs.un({
            event1: listener1,
            event2: listener2,
            ctx: this
        });
        obs.fireEvent('event1');
        obs.fireEvent('event2');
        this.assertEquals(30, this.i);
    },

    testEventObject: function() {
        var obs = new Observer({
            event: function(evt) {
                this.assertEquals('event', evt.name);
                this.assertEquals(obs, evt.target);
                this.assertEquals(5, evt.five);
            },
            ctx: this
        });
        obs.fireEvent('event', {five: 5});
    },

    testArguments: function() {
        var obs = new Observer({
            event: function(five, evt) {
                this.assertEquals(5, five);
                this.assertEquals('event', evt.name);
                this.assertEquals(5, evt.five);
            },
            ctx: this,
            args: ['five']
        });
        obs.fireEvent('event', {five: 5});
    },

    testSingle: function() {
        var i = 0;
        var obs = new Observer({
            event: function() {
                i++;
            },
            single: true
        });
        obs.fireEvent('event');
        this.assertEquals(1, i);
        obs.fireEvent('event');
        this.assertEquals(1, i);
    },

    testErrorHandler: function() {
        var error, i = 0;
        var obs = new Observer({
            event: function() {
                i *= 2;
            }
        });
        obs.on('event', function() {
            i += 5;
            doesNotExists++;
        });
        obs.errorHandler = function(e) {
            error = e;
        };
        obs.fireEvent('event');
        this.assertEquals(10, i);
        this.assertInstanceOf(Error, error);
    },

    testStop: function() {
        var i = 0;
        var obs = new Observer({
            event: function() {
                i *= 2;
            }
        });
        obs.on('event', function(evt) {
            i += 5;
            evt.stop();
        });
        obs.fireEvent('event');
        this.assertEquals(5, i);
    },

    testBind: function() {
        var object = {}, i = 0;
        new Observer({
            event: function() {
                i *= 2;
            }
        }).bind(object);
        object.on('event', function() {
            i += 5;
        });
        object.fireEvent('event');
        this.assertEquals(10, i);
    },

    testCapturing: function() {
        var i = 0, obs = new Observer({
            event1: function() {
                i += 1;
            },
            event2: function() {
                i += 2;
            },
            '*': function() {
                i *= 2;
            }
        });
        obs.fireEvent('event1');
        obs.fireEvent('event2');
        this.assertEquals(8, i);
    }
});