var StringTest = TestCase.create({
    name: 'String',

    testFromQueryParams: function() {
        this.assertEquals('a=b&c=d&e=f', String.fromQueryParams({a: 'b', c: 'd', e: 'f'}));
        this.assertEquals('a=b&c[]=1&c[]=2&c[]=3', String.fromQueryParams({a: 'b', c: [1, 2, 3]}));
        var oldSuffix = String.queryCodecOptions.arraySuffix;
        String.queryCodecOptions.arraySuffix = '';
        this.assertEquals('a=b&c=1&c=2&c=3', String.fromQueryParams({a: 'b', c: [1, 2, 3]}));
        String.queryCodecOptions.arraySuffix = oldSuffix;
    },

    testStripScripts: function() {
        var str1 = '<html>\n' +
                   '    <script type="text/javascript">\n' +
                   '        var test = 123;\n' +
                   '    </script>\n' +
                   '</html>';
        var str2 = '<html>\n' +
                   '    \n' +
                   '</html>';
        this.assertEquals(str2, str1.stripScripts());
    },

    testExtractScripts: function() {
        var str1 = '<html>\n' +
                   '    <script type="text/javascript">\n' +
                   '        var test = 123;\n' +
                   '    </script>\n' +
                   '</html>';
        var str2 = '\n        var test = 123;\n    ';
        this.assertEquals([str2], str1.extractScripts());
    },

    testStrip: function() {
        var str = '             \r\n   asdkfjejb      \r\n      \t    ';
        this.assertEquals('asdkfjejb', str.strip());
    },

    testTruncate: function() {
        var str = '0123456789';
        this.assertEquals('01...', str.truncate(5));
        this.assertEquals('01---', str.truncate(5, '---', 'right'));
        this.assertEquals('--789', str.truncate(5, '--', 'left'));
        this.assertEquals('01-89', str.truncate(5, '-', 'center'));
    },

    testStripTags: function() {
        var str = '12 <b>345</b> 678 <i>90</i>';
        this.assertEquals('12 345 678 90', str.stripTags());
    },

    testEscapeHTML: function() {
        this.assertEquals('&lt;&amp;&gt;', '<&>'.escapeHTML());
    },

    testUnescapeHTML: function() {
        this.assertEquals('<p>12<b>34</b>56</p>', '&lt;p&gt;12&lt;b&gt;34&lt/b&gt;56&lt;/p&gt;'.unescapeHTML());
    },

    testCamelize: function() {
        this.assertEquals('abcDefGh', 'abc-def-gh'.camelize());
        this.assertEquals('AbcDefGh', '-abc-def-gh'.camelize());
    },

    testToQueryParams: function() {
        this.assertEquals({a: '1', b: '2', c: '3'}, 'a=1&b=2&c=3'.toQueryParams());
        this.assertEquals({b: ['1', '2', '3'], a: '1'}, 'b=1&a=1&b=2&b=3'.toQueryParams());
        this.assertEquals({b: ['1', '2', '3'], a: '1'}, 'b[]=1&a=1&b[]=2&b[]=3'.toQueryParams());
        this.assertEquals({b: ['1'], a: '1'}, 'b[]=1&a=1'.toQueryParams());
    },

    testFormat: function() {
        this.assertEquals('0123456789', '0${a}34${b}89'.format({a: '12', b: '567'}));
        this.assertEquals('012${34}56789', '0${0}\\${34}56${1}9'.format(12, 78));
    },

    testTimes: function() {
        this.assertEquals('123123123123', '123'.times(4));
    },

    testStartsWith: function() {
        this.assertTrue('abcdefg'.startsWith('abcd'));
        this.assertFalse('abcdefg'.startsWith('123'));
    },

    testEndsWith: function() {
        this.assertTrue('abefgcdefg'.endsWith('efg'));
        this.assertFalse('abc'.endsWith('1abc'));
        this.assertFalse('abcdefg'.endsWith('123'));
    },

    testToFragment: function() {
        var html = '<a href="#">asdf</a><div></div><p></p>';
        var fragment = html.toFragment();
        this.assertEquals('A', fragment.childNodes[0].tagName);
        this.assertEquals('DIV', fragment.childNodes[1].tagName);
        this.assertEquals('P', fragment.childNodes[2].tagName);
        this.assertEquals('asdf', fragment.childNodes[0].innerHTML);
    }
});