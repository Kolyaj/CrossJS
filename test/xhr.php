<?php
switch ($_GET['test']) {
    case 1:
        echo $_POST['a'] . "-" . implode(",", $_POST['b']);
        exit;
    case 2:
        echo "{\"a\": {$_GET['a']}, \"b\": {$_GET['b']}, \"c\": {$_GET['c']}}";
        exit;
    case 3:
        header("HTTP/1.1 404 Not Found");
        exit;
    case 4:
        sleep(5);
        exit;
}
?>
<html>
<head>
    <title>Тестирование XHR</title>
    <style type="text/css">
        .indicate {
            width: 20px;
            height: 50px;
            border: 1px solid #000;
            float: left;
            margin-right: 5px;
            }
    </style>
    <script type="text/javascript" src="../source/XHR.js"></script>
</head>
<body>
    <div class="indicate" id=":1"></div>
    <div class="indicate" id=":2"></div>
    <div class="indicate" id=":3"></div>
    <div class="indicate" id=":4"></div>
</body>
<script type="text/javascript">
    XHR.request({
        url: window.location.href + '?test=1',
        params: {a: '123', b: ['7264', '53', '23']},
        responseType: 'text',
        success: function(response) {
            $(':1').style.backgroundColor = response == '123-7264,53,23' ? '#0F0' : '#F00';
        }
    });

    XHR.request({
        url: window.location.href + '?test=2',
        method: 'get',
        params: {a: 1, b: 2, c: 3},
        responseType: 'json',
        success: function(response) {
            $(':2').style.backgroundColor = (response.a == 1 && response.b == 2 && response.c == 3) ? '#0F0' : '#F00';
        }
    });

    XHR.request({
        url: window.location.href + '?test=3',
        success: function() {
            $(':3').style.backgroundColor = '#F00';
        },
        failure: function() {
            $(':3').style.backgroundColor = '#0F0';
        }
    });

    XHR.request({
        url: window.location.href + '?test=4',
        timeout: 3000,
        success: function() {
            $(':4').style.backgroundColor = '#F00';
        },
        failure: function() {
            $(':4').style.backgroundColor = arguments.length == 0 ? '#0F0' : '#F00';
        }
    });
</script>
</html>