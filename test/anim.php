<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>Тестирование анимации</title>
    <script type="text/javascript" src="../source/Anim.js"></script>
    <script type="text/javascript" src="../source/Element.js"></script>

    <style type="text/css">
        #el1 {
            position: absolute;
            left: 400px;
            top: 400px;
            width: 100px;
            height: 100px;
            background: #000;
            }
    </style>
</head>
<body>
    <div id="el1"></div>
</body>
<script type="text/javascript">
    var el1 = $E('el1');
    el1.on('click', function() {
        var d = new Date();
        new Anim({
            duration: 500,
            items: {
                el: 'el1',
                styles: {
                    left: [10, 400, 'px'],
                    top: [10, 400, 'px'],
                    width: [0, 100, 'px'],
                    height: [0, 100, 'px'],
                    opacity: [0, 1]
                }
            }
        }).run(function() {
            alert('Должно быть около 500: ' + (new Date() - d));
        });
    })
</script>
</html>