<?php
$doctypes = array(
    'html401_strict'       => '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
    'html401_transitional' => '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
    'html401_frameset'     => '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">',
    'xhtml10_strict'       => '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
    'xhtml10_transitional' => '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
    'xhtml10_frameset'     => '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
    'xhtml11'              => '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
    'html5'                => '<!DOCTYPE html>'
);

if (isset($_GET['doctype'])) {
    echo $doctypes[$_GET['doctype']];
}

function getDoctypes($url) {
    global $doctypes;
    $res = "<ul class=\"doctypes\">";
    $res .= "<li><a href=\"$url\" target=\"_blank\">Без доктайпа</a></li>";
    foreach ($doctypes as $name => $doctype) {
        $res .= "<li><a href=\"$url?doctype=$name\" target=\"_blank\">$name</a></li>";
    }
    $res .= "</ul>";
    return $res;
}