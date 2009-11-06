<?php

class JsProcessor_Executer {
    protected $_variables = array();

    public function __construct() {
    }

    public function assign($var, $value) {
        $this->_variables[$var] = $value;
    }

    public function __get($var) {
        if (array_key_exists($var, $this->_variables))
            return $this->_variables[$var];
        require_once "JsProcessor_Exception.php";
        throw new JsProcessor_Exception('Undefined variable $var');
    }

    public function getMeta($name) {
        $state = 'meta';
        $meta = array();
        include($name);
        return $meta;
    }

    public function execute($name) {
        $state = 'include_files';
        $requiredFiles = array($name);
        for ($i = 0; $i < count($requiredFiles); $i++) {
            include($requiredFiles[$i]);
        }

        $state = 'include_labels';
        $constants     = array();
        $labels        = array();
        $labelsCount = 0;
        while (true) {
            for ($i = 0; $i < count($requiredFiles); $i++)
                include($requiredFiles[$i]);
            $labels = array_unique($labels);
            if (count($labels) == $labelsCount)
                break;
            else
                $labelsCount = count($labels);
        }

        $state = 'output';
        $filesStack = array();
        ob_start();
        include($name);
        $code = ob_get_contents();
        ob_end_clean();
        return $code;
    }

    protected function compileConstants($str, $constants, $filesStack) {
        if (count($constants) || preg_match("/__FILE__|__DIRECTORY__/", $str)) {
            $replaceMap = array();
            preg_match_all("/((\"|').*?\\2(?<!\/)|\/\*.*?\*\/)/", $str, $matches);
            for ($i = 0; $i < count($matches[0]); $i++) {
                $key = $this->generateUniqueSubstring($str);
                $replaceMap[$key] = $matches[1][$i];
                $str = str_replace($matches[1][$i], $key, $str);
            }
            $patterns = array();
            $replacments = array();
            foreach ($constants as $constant => $value) {
                $patterns[] = "/\b" . str_replace("\\", "\\\\", $constant) . "\b/";
                $replacments[] = $value;
            }
            $str = preg_replace($patterns, $replacments, $str);
            $str = str_replace("__FILE__", "'" . $filesStack[0] . "'", $str);
            $str = str_replace("__DIRECTORY__", "'" . dirname($filesStack[0]) . "/'", $str);
            foreach ($replaceMap as $key => $value)
                $str = str_replace($key, $value, $str);
        }
        return $str;
    }

    private function generateUniqueSubstring($str) {
        $us = "";
        while (true) {
            $us = "<" . rand(0, 1e9) . ">";
            if (stripos($str, $us) === false)
                break;
        }
        return $us;
    }
}