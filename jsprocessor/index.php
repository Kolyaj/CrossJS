<?php
require_once "source/JsProcessor.php";
if (array_key_exists("file", $_GET)) {
    header("Content-type: text/javascript; charset=UTF-8");
    ob_start("ob_gzhandler");
    $dr = $_SERVER['DOCUMENT_ROOT'] . "/";
    $js = new JsProcessor();
    $js->setIncludePath($dr . "js");
    $js->setCompileDirectory("./compile");
    try {
        if (strstr($_GET['file'], "testcase.js")) {
            readfile($dr . $_GET['file']);
        } else {
            echo $js->fetch($dr . $_GET['file']);
        }
    } catch (JsProcessor_Exception $e) {
    }
    ob_end_flush();
}