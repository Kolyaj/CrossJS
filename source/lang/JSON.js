var JSON = JSON || new function() {
    //#label parse
    this.parse = function(json) {
        try {
            return new Function('return ' + json)();
        } catch (e) {
            throw new SyntaxError('JSON.parse');
        }
    };
    //#endlabel parse

    //#label stringify
    var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };


    function stringifyString(value) {
        return '"' + value.replace(escapable, function(c) {
            return meta[c] || '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
        }) + '"';
    }

    function pad(n) {
        return (n < 10 ? '0' : '') + n;
    }

    function stringifyDate(value) {
        return isFinite(value.valueOf()) ?
               value.getUTCFullYear()   + '-' +
             pad(value.getUTCMonth() + 1) + '-' +
             pad(value.getUTCDate())      + 'T' +
             pad(value.getUTCHours())     + ':' +
             pad(value.getUTCMinutes())   + ':' +
             pad(value.getUTCSeconds())   + 'Z' : null;
    }

    function stringifyArray(value) {
        var result = [];
        for (var i = 0; i < value.length; i++) {
            result.push(stringify(value[i]) || 'null');
        }
        return '[' + result.join(',') + ']';
    }

    function stringifyObject(value) {
        var result = [];
        for (var i in value) {
            if (value.hasOwnProperty(i)) {
                var jsonValue = stringify(value[i]);
                if (jsonValue) {
                    result.push(stringifyString(i) + ':' + jsonValue);
                }
            }
        }
        return '{' + result.join(',') + '}';
    }

    function stringify(value) {
        var type = {}.toString.call(value);
        if (/\[object (String|Number|Boolean)\]/.test(type)) {
            value = value.valueOf();
        }

        if (type == '[object Date]') {
            return stringifyDate(value);

        } else if (typeof value == 'string') {
            return stringifyString(value);

        } else if (typeof value == 'number') {
            return isFinite(value) ? String(value) : 'null';

        } else if (typeof value == 'boolean') {
            return String(value);

        } else if (value == null) {
            return 'null';

        } else if (type == '[object Array]') {
            return stringifyArray(value);

        } else if (type == '[object Object]') {
            return stringifyObject(value);

        } else {
            return '';
        }
    }

    this.stringify = stringify;
    //#endlabel stringify
};
