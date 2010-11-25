<? include_once "doctype.php" ?>
<html>
<head>
    <title>Тестирование работы с событиями</title>
    <script type="text/javascript" src="../source/document.js"></script>
    <script type="text/javascript" src="../source/Element.js"></script>
    <style type="text/css">
        .getTarget1 {
            padding: 10px;
            border: 1px solid #F00;
        }
        .getTarget3 {
            padding: 10px;
            border: 1px solid #0F0;
        }
        #getTarget {
            padding: 10px;
            border: 1px solid #00F;
            display: block;
        }

        #pointer1, #pointer2 {
            width: 300px;
            height: 300px;
            background: #0F0;
        }
    </style>
</head>
<body>
    <div class="getTarget1 getTarget2">
        <div class="getTarget3">
            <span id="getTarget">При нажатии мышки внутри синего прямоугольника, должны заполниться синий и
                зеленый, при нажатии внутри зеленого -- зеленый и красный, внутри красного -- только красный.</span>
        </div>
    </div>

    <p style="margin-top: 20px;">При клике по зеленому квадрату в том же месте должна появляться красная точка.
        После нажатия на "Остановить добавление точек" точки появляться не должны вплоть до нажатия "Возобновить
        добавление точек". При первом клике по квадрату после нажатия "Добавить одну большую черную точку"
        должна появится большая черная точка, при последующих кликах -- все те же красные.</p>
    <div id="pointer1" style="margin: 0 auto;">
        <div id="pointer2"></div>
    </div>
    <p>
        <button id="pointsDisable">Остановить добавление точек</button>
        <button id="pointsEnable" disabled>Возобновить добавление точек</button>
        <button id="addBigPoint">Добавить одну большую черную точку</button>
    </p>
</body>
<script type="text/javascript">
    $E.on(document.body, {
        mousedown: function(evt) {
            var targ1 = evt.getTarget('span'), targ2 = evt.getTarget('.getTarget3'), targ3 = evt.getTarget('.getTarget2.getTarget1', 2);
            if (targ1) {
                targ1.style.backgroundColor = '#00F';
            }
            if (targ2) {
                targ2.style.backgroundColor = '#0F0';
            }
            if (targ3) {
                targ3.style.backgroundColor = '#F00';
            }
        },
        mouseup: function(evt) {
            var targ1 = evt.getTarget('span'), targ2 = evt.getTarget('.getTarget3'), targ3 = evt.getTarget('.getTarget2.getTarget1');
            if (targ1) {
                targ1.style.backgroundColor = '';
            }
            if (targ2) {
                targ2.style.backgroundColor = '';
            }
            if (targ3) {
                targ3.style.backgroundColor = '';
            }
        }
    });

    var stopper = {
        me: true,
        stopper: function(evt) {
            if (this.me) {
                evt.stop();
            }
        }
    };

    $E('pointer1').on('click', function(evt) {
        var pointer = evt.pointer();
        var point = $E(document.createElement('div'));
        point.setStyle({
            position: 'absolute',
            left: pointer[0] - 3 + 'px',
            top: pointer[1] - 3 + 'px',
            width: '3px',
            height: '3px',
            overflow: 'hidden',
            background: '#F00'
        });
        document.body.appendChild(point);
    });

    $E.on('pointsDisable', 'click', function() {
        $('pointsDisable').disabled = true;
        $('pointsEnable').disabled = false;
        $E.on('pointer2', 'click', stopper.stopper, stopper);
    });
    $E.on('pointsEnable', 'click', function() {
        $('pointsDisable').disabled = false;
        $('pointsEnable').disabled = true;
        $E.un('pointer2', 'click', stopper.stopper, stopper);
    });
    $E.on('addBigPoint', 'click', function() {
        $E('pointer1').on('click', function(evt) {
            var pointer = evt.pointer();
            var point = $E(document.createElement('div'));
            point.setStyle({
                position: 'absolute',
                left: pointer[0] - 5 + 'px',
                top: pointer[1] - 5 + 'px',
                width: '5px',
                height: '5px',
                overflow: 'hidden',
                background: '#000'
            });
            document.body.appendChild(point);
        }, null, {single: true});
    });
</script>
</html>