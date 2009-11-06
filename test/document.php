<? include_once "doctype.php" ?>
<html>
<head>
    <title>Тестирование функций геометрии документа.</title>
    <script type="text/javascript" src="../source/core.js"></script>
    <style type="text/css">
        body {
            background: #FF0;
        }
        .line {
            position: absolute;
            overflow: hidden;
            width: 1px;
            height: 1px;
        }
        .document-size {
            background-color: #0F0;
            left: 0;
            top: 0;
        }
        .document-viewport {
            background-color: #000;
            left: 1px;
            top: 1px;
        }

        #fill {
            width: 2000px;
            height: 2000px;
            float: left;
            margin: 50px;
            padding: 30px;
            border: 10px solid #ffcc00;
            display: none;
        }
    </style>
</head>
<body onload="window.scrollTo(0, 0); calculate();">
    <p>После загрузки страницы она должна иметь желтый фон, скролов быть не должно. По самому краю должна идти зеленая
        окантовка (размеры документа), между окантовкой и краем окна не должно быть зазоров. Впритык к зеленой должна
        идти черная окантовка (размеры видимой части документа), зазоров между ними также быть не должно.</p>
    <p>При нажатии на кнопку "Создать скролы" размеры документа увеличатся, и справа и снизу должны появится
        желтые однопиксельные    просветы.</p>
    <p>При нажатии на кнопку "Прокрутить в конец" желтые зазоры должны переместиться влево и вверх.</p>
    <p>Если что-то выглядит не так, значит функции работают неправильно.</p>
    <p>
        <button id="showFill" onclick="showFill();">Создать скролы</button>
        <button id="scroll" disabled="disabled" onclick="scroll();">Прокрутить в конец</button>
    </p>
    <div id="fill"></div>
    <div class="line document-size document-size-top" id="documentSizeTop"></div>
    <div class="line document-size document-size-right" id="documentSizeRight"></div>
    <div class="line document-size document-size-bottom" id="documentSizeBottom"></div>
    <div class="line document-size document-size-left" id="documentSizeLeft"></div>
    <div class="line document-viewport document-viewport-top" id="documentViewportTop"></div>
    <div class="line document-viewport document-viewport-right" id="documentViewportRight"></div>
    <div class="line document-viewport document-viewport-bottom" id="documentViewportBottom"></div>
    <div class="line document-viewport document-viewport-left" id="documentViewportLeft"></div>
</body>
<script type="text/javascript">
    var elements = ['documentSizeTop', 'documentSizeRight', 'documentSizeBottom', 'documentSizeLeft',
                    'documentViewportTop', 'documentViewportRight', 'documentViewportBottom', 'documentViewportLeft'];

//    alert(document.compatMode);
    function calculate() {
        hideAll();
        setTimeout(function() {
            var documentSize = getDocumentSize();
            var viewportSize = getViewportSize();
            var scroll = getDocumentScroll();
            $('documentSizeTop').style.width = documentSize[0] + 'px';
            $('documentSizeRight').style.left = (documentSize[0] - 1) + 'px';
            $('documentSizeRight').style.height = documentSize[1] + 'px';
            $('documentSizeBottom').style.top = (documentSize[1] - 1) + 'px';
            $('documentSizeBottom').style.width = documentSize[0] + 'px';
            $('documentSizeLeft').style.height = documentSize[1] + 'px';
            $('documentViewportTop').style.left = (scroll[0] + 1) + 'px';
            $('documentViewportTop').style.top = (scroll[1] + 1) + 'px';
            $('documentViewportTop').style.width = (viewportSize[0] - 2) + 'px';
            $('documentViewportRight').style.left = (scroll[0] + viewportSize[0] - 2) + 'px';
            $('documentViewportRight').style.top = (scroll[1] + 1) + 'px';
            $('documentViewportRight').style.height = (viewportSize[1] - 2) + 'px';
            $('documentViewportBottom').style.left = (scroll[0] + 1) + 'px';
            $('documentViewportBottom').style.top = (scroll[1] + viewportSize[1] - 2) + 'px';
            $('documentViewportBottom').style.width = (viewportSize[0] - 2) + 'px';
            $('documentViewportLeft').style.left = (scroll[0] + 1) + 'px';
            $('documentViewportLeft').style.top = (scroll[1] + 1) + 'px';
            $('documentViewportLeft').style.height = (viewportSize[1] - 2) + 'px';
        }, 100);
        showAll();
    }

    function hideAll() {
        for (var i = 0; i < elements.length; i++) {
            $(elements[i]).style.display = 'none';
        }
    }

    function showAll() {
        for (var i = 0; i < elements.length; i++) {
            $(elements[i]).style.display = '';
        }
    }

    function showFill() {
        $('fill').style.display = 'block';
        $('showFill').disabled = true;
        $('scroll').disabled = false;
        calculate();
    }

    function scroll() {
        $('scroll').disabled = true;
        window.scrollTo(99999, 99999);
        calculate();
    }
</script>
</html>