<?php
/**
 * Препроцессор JavaScript.
 * Все подробности по адресу http://www.seanalyzer.ru/projects/jsprocessor/
 * (c) Kolyaj.
 */

require_once "JsProcessor_Compiler.php";
require_once "JsProcessor_Executer.php";

class JsProcessor {

    // -- Статические функции -----------------------
    /** toCharCodes
     * Переводит строку $str в числа и обертывает ее в String.fromCharCode(...)
     * Используется для решения проблем с кодировками.
     * Строка $str должна быть в utf-8.
     */
    public static function toCharCodes($str) {
        return 'String.fromCharCode(' . implode(',', self::_toCharCodesArray($str)) . ')';
    }

    /** _toCharCodesArray
     * Возвращает массив кодов символов строки $str.
     * Строка $str должна быть в utf-8.
     */
    protected static function _toCharCodesArray($str) {
        $out = array();
        for ($i = 0, $l = strlen($str); $i < $l; $i++)  {
            $c = ord($str[$i]);
            if ($c >> 7 == 0)
                $code = $c;
            elseif ($c >> 5 == 6) {
                $code = ($c & 0x1F) << 6;
                $c = ord($str[++$i]);
                $code += $c & 0x3F;
            } else
                $code = 0;
            $out[] = $code;
        }
        return $out;
    }

    //-----------------------------------------------
    protected $_compiler;
    protected $_executer;

    public function __construct($executer = NULL, $compiler = NULL) {
        $this->_executer = $executer ? $executer : new JsProcessor_Executer();
        $this->_compiler = $compiler ? $compiler : new JsProcessor_Compiler();
        if (!($this->_executer instanceof JsProcessor_Executer)) {
            require_once "JsProcessor_Exception.php";
            throw new JsProcessor_Exception('Bad Executer');
        }
        if (!($this->_compiler instanceof JsProcessor_Compiler)) {
            require_once "JsProcessor_Exception.php";
            throw new JsProcessor_Exception('Bad Compiler');
        }
    }

    public function setCompileDirectory($dir) {
        return $this->_compiler->setCompileDirectory($dir);
    }

    public function getCompileDirectory() {
        return $this->_compiler->getCompileDirectory();
    }

    public function setIncludePath($path) {
        return $this->_compiler->setIncludePath($path);
    }

    public function addIncludePath($path) {
        return $this->_compiler->addIncludePath($path);
    }

    public function getIncludePaths() {
        return $this->_compiler->getIncludePaths();
    }

    public function isCompiled($name) {
        return $this->_compiler->isCompiled($name);
    }

    public function assign($var, $value) {
        return $this->_executer->assign($var, $value);
    }

    public function fetch($name) {
        $compilepath = $this->_compiler->compileAll($name);
        return $this->_executer->execute($compilepath);
    }

    public function compileAll($name) {
        return $this->_compiler->compileAll($name, true);
    }

    public function compile($name) {
        return $this->_compiler->compile($name, true);
    }

    public function getMeta($name) {
        $path = $this->_compiler->compile($name);
        return $this->_executer->getMeta($path);
    }

    public function getScriptPath($name) {
        return $this->_compiler->getScriptPath($name);
    }
}
