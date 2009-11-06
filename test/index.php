<? require_once "doctype.php"; ?>
<html>
<head>
    <title>CrossJS tests</title>
    <style type="text/css">
    .doctypes {
        overflow: hidden;
        zoom: 1;
    }
    .doctypes li {
        display: block;
        float: left;
        padding-left: 20px;
    }
    </style>
</head>
<body>
    <ul>
        <li><a href="testcase/" target="_blank">Тесты, укладывающиеся в TestCase</a><br>
            <b>Fails:</b><ul>
                <li>IE5.5: Element.js::remove, core.js::$$</li>
            </ul>
        </li>
        <li>Document.js <?= getDoctypes("document.php") ?>
            <b>Fails:</b><ul>
                <li>Opera: getDocumentHeight. Если последний в потоке элемент в документе с любым доктайпом
                (compatMode=CSS1Compat) имеет margin-bottom, то этот margin не учитывается.</li>
            </ul>
        </li>
        <li>Element.js <?= getDoctypes("element.php") ?></li>
        <li>Работа с событиями <?= getDoctypes("event.php") ?></li>
        <li><a href="xhr.php" target="_blank">XHR.js</a></li>
        <li><a href="anim.php" target="_blank">Anim.js</a></li>
    </ul>
</body>
</html>