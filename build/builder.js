/*
Array.prototype.toString = function() {
    return '[\n    ' + this.join(',\n    ') + '\n]';
};
Object.prototype.toString = function() {
    var props = [];
    for (var i in this) {
        props.push(i + ': ' + this[i]);
    }
    return '{' + props.join(',') + '}';
};
*/

var os = require('glue_os');

var JsFile = function(path) {
    this.path = new os.Path(path).makeAbsolute();
    this.lines = [];
    var f = new os.TextInputStream(this.path, '\n', 'utf-8');
    var label = 'base';
    while (!f.eof) {
        var line = f.readLine();
        if (line.match(/^\s*\/\/#include_once "([^"]+)"\s*$/)) {
            var includeFile = RegExp.$1.split('::');
            var fname = includeFile.shift();
            fname = String(fname == 'self' ? this.path : this.path.parent.append(fname));
            while (/[\\/]\.\.[\\/]/.test(fname)) {
                fname = fname.replace(/([\\/])[^\\/]+[\\/]\.\.[\\/]/g, '$1');
            }
            this.lines.push({
                type: 'include',
                fname: fname,
                label: label,
                includeLabels: includeFile.length ? includeFile : ['full']
            });
        } else if (line.match(/^\s*\/\/#label ([^\s:]+)\s*$/)) {
            label = RegExp.$1;
        } else if (line.match(/^\s*\/\/#endlabel(\s|$)/)) {
            label = 'base';
        } else {
            this.lines.push({
                type: 'js',
                code: line + '\n',
                label: label
            });
        }
    }
    f.close();
    this.labels = [];
};
JsFile.prototype = {
    getDependecies: function(label) {
        var dependencies = [];
        this.lines.filter(function(line) {
            return line.type == 'include';
        }).forEach(function(line) {
            if (label == 'full' || line.label == 'base' || label == line.label) {
                dependencies.push({fname: line.fname, labels: line.includeLabels});
            }
        });
        return dependencies;
    },

    build: function(labels) {
        labels = labels || this.labels;
        if (this.builded) {
            return '';
        } else {
            this.builded = true;
            return this.lines.map(function(line) {
                if (labels.indexOf('full') != -1 || line.label == 'base' || labels.indexOf(line.label) != -1) {
                    if (line.type == 'js') {
                        return line.code;
                    } else if (line.type == 'include') {
                        return jsFiles[line.fname].build();
                    }
                }
                return '';
            }).join('');
        }
    }
};

var jsFiles = {};
var dependencies = argv.map(function(arg) {
    return new os.Path(arg).makeAbsolute() + '::full';
});

for (var i = 0; i < dependencies.length; i++) {
    var dependency = dependencies[i].split('::'), fname = dependency[0], label = dependency[1];
    if (!jsFiles[fname]) {
        jsFiles[fname] = new JsFile(fname);
    }
    jsFiles[fname].getDependecies(label).forEach(function(d) {
        d.labels.map(function(l) {
            return d.fname + '::' + l;
        }).forEach(function(newDep) {
            if (dependencies.indexOf(newDep) == -1) {
                dependencies.push(newDep);
            }
        });
    });
}

dependencies.forEach(function(dep) {
    dep = dep.split('::');
    jsFiles[dep[0]].labels.push(dep[1]);
});

print(dependencies.slice(0, argv.length).map(function(d) {
    return jsFiles[d.split('::')[0]].build(['full']);
}).join(''));