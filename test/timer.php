<html>
<head>
    <title>Тестирование таймера</title>
    <style type="text/css">
    </style>
    <script type="text/javascript" src="../source/core.js"></script>
    <script type="text/javascript" src="../source/lang/Array.js"></script>
    <script type="text/javascript" src="../source/Element.js"></script>
    <script type="text/javascript" src="../source/Timer.js"></script>
</head>
<body>
    <div><button id="startTimer1">Запустить таймер</button> <span id="timer1"></span> <button id="stopTimer1">Остановить таймер</button></div>
    <div><button id="startTimer2">Запустить таймер</button> <span id="timer2"></span> <button id="stopTimer2">Остановить таймер</button></div>
    <div><button id="startTimer3">Запустить таймер</button> <span id="timer3"></span> <button id="stopTimer3">Остановить таймер</button></div>
    <div><button id="startTimer4">Запустить таймер</button> <span id="timer4"></span> <button id="stopTimer4">Остановить таймер</button></div>
    <div><button id="startTimer5">Запустить таймер</button> <span id="timer5"></span> <button id="stopTimer5">Остановить таймер</button></div>

    <div style="margin-top: 30px;"><button id="to10">Сосчитать до 10</button> <span id="to10label"></span></div>
</body>
<script type="text/javascript">
range(1, 5).forEach(function(i) {
    var j = 0;
    function showIndex() {
        $('timer' + i).innerHTML = j;
        j++;
    }
    $E('startTimer' + i).on('click', function() {
        new Timer(500).on('timer', showIndex);
    });
    $E('stopTimer' + i).on('click', function() {
        new Timer(500).un('timer', showIndex);
    });
});

$E('to10').on('click', function() {
    $('to10label').style.fontWeight = 'normal';
    range(1, 10).deferForEach(300, function(i) {
        $('to10label').innerHTML = i;
    }, function() {
        $('to10label').style.fontWeight = 'bold';
    });
});
</script>
</html>