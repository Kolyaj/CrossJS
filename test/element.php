<? include_once "doctype.php" ?>
<html>
<head>
    <title>Тестировние методов из файла Element.js</title>
    <script type="text/javascript" src="../source/document.js"></script>
    <script type="text/javascript" src="../source/Element.js"></script>
</head>
<body>
    <div style="border: 1px solid #000; padding: 10px;">Если внутри этой рамки видно еще что-то,
    кроме этой надписи, то $E.setStyle работает неверно.
        <div style="background-color: #F00;">
            <div style="background-color: #00F; width: 100px; height: 100px;" id="setStyle"></div>
        </div>
    </div>

    <div style="clear: both; margin: 10px auto; width: 500px; padding: 20px">
        Квадрат, нарисованный ниже, должен быть полностью зеленым, иначе $E.offset работает неверно.
        <div id="offset" style="margin: 10px; width: 100px; height: 100px; background-color: #F00;"></div>
    </div>
</body>
<script type="text/javascript">
    $E('setStyle').setStyle({
        cssFloat: 'left',
        opacity: 0
    });

    var offset = $E('offset').offset();
    var overlay = $E(document.createElement('div'));
    overlay.setStyle({
        position: 'absolute',
        backgroundColor: '#0F0',
        left: offset[0] + 'px',
        top: offset[1] + 'px',
        width: '100px',
        height: '100px'
    });
    document.body.appendChild(overlay);
</script>
</html>