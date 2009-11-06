<?php
class JsProcessor_Compiler {
    protected $_directives = array(), $_prefilters = array(), $_templates = array(), $_patterns = array(), $_parseParams = array();

    protected $currentFile;
    protected $currentLine;

    protected $_compileDir;
    protected $_includePaths = array();

    public function __construct() {
        $this->_templates = array(
            'main'               => "<?php /* Этот файл автоматически сгенерирован классом JsProcessor_Compiler, пожалуйста, не изменяйте его. */ \n"
                                  . "//                                                                   \n"
                                  . "if (\$state == 'output'):                                            \n"
                                  . "  if (isset(\$includedFiles)):                                       \n"
                                  . "    \$includedFiles[] = '#{name}';                                   \n"
                                  . "  else:                                                              \n"
                                  . "    \$includedFiles = array('#{name}');                              \n"
                                  . "  endif;                                                             \n"
                                  . "  array_unshift(\$filesStack, base64_decode(\"#{encodedFileUrl}\")); \n"
                                  . "#{output}"
                                  . "  array_shift(\$filesStack);                                         \n"
                                  . "elseif (\$state == 'compile'):                                       \n"
                                  . "#{compile}"
                                  . "elseif (\$state == 'include_files'):                                 \n"
                                  . "#{include_files}"
                                  . "elseif (\$state == 'meta'):                                          \n"
                                  . "#{meta}"
                                  . "elseif (\$state == 'include_labels'):                                \n"
                                  . "#{include_labels}"
                                  . "endif;                                                               \n",

            'exception'          => "throw new Error('JsProcessor Error: #{message} in #{file} on line #{line}');"
        );
        $this->registerDirective('jscode',       array($this, '_initJscode'),       array($this, '_parseJscode'),   NULL,                                 array($this, '_generateJscode'), array($this, '_prefilterJscode'))
             ->registerDirective('include',      array($this, '_initInclude'),      array($this, '_parseInclude'),  array($this, '_processInclude'),      array($this, '_generateInclude'))
             ->registerDirective('include_once', array($this, '_initInclude_once'), array($this, '_parseInclude'),  array($this, '_processInclude_once'), array($this, '_generateInclude_once'))
             ->registerDirective('define',       array($this, '_initDefine'),       array($this, '_parseDefine'),   array($this, '_processDefine'),       array($this, '_generateDefine'))
             ->registerDirective('meta',         array($this, '_initMeta'),         array($this, '_parseMeta'),     array($this, '_processMeta'),         array($this, '_generateMeta'))
             ->registerDirective('if',           array($this, '_initIf'),           array($this, '_parseIf'),       NULL,                                 array($this, '_generateIf'))
             ->registerDirective('endif',        array($this, '_initEndif'),        array($this, '_parseEndif'),    array($this, '_processEndif'),        array($this, '_generateEndif'))
             ->registerDirective('label',        array($this, '_initLabel'),        array($this, '_parseLabel'),    array($this, '_processLabel'),        array($this, '_generateLabel'))
             ->registerDirective('endlabel',     array($this, '_initEndlabel'),     array($this, '_parseEndlabel'), array($this, '_processEndlabel'),     array($this, '_generateEndlabel'));
    }

    public function setCompileDirectory($dir) {
        $dir = rtrim($dir, '\\/');
        if (!is_dir($dir)) {
            require_once "JsProcessor_Exception.php";
            throw new JsProcessor_Exception("Directory $dir not found");
        }
        $this->_compileDir = $dir;
    }

    public function getCompileDirectory() {
        return $this->_compileDir;
    }

    public function setIncludePath($path) {
        $this->_includePaths = array();
        $this->addIncludePath($path);
    }

    public function addIncludePath($path) {
        $path = rtrim($path, '\\/');
        $this->_includePaths[] = $path;
    }

    function getIncludePaths() {
        return $this->_includePaths;
    }

    /** isCompiled
     * Проверяет, откомпилирован ли файл $name.
     * Если да, то возвращает путь к откомпилированному файлу, иначе false.
     */
    public function isCompiled($name) {
        $name = $this->_realpath($name);
        $compilepath = $this->_compilepath($name);
        if (file_exists($compilepath))
            if (filemtime($name) < filemtime($compilepath))
                return $compilepath;
        return false;
    }

    public function getScriptPath($fileName) {
        $scriptPath = false;
        foreach ($this->_includePaths as $path)
            try {
                $scriptPath = $this->_realpath($path . DIRECTORY_SEPARATOR . $fileName);
            } catch (JsProcessor_Exception $e) {
        }
        return $scriptPath;
    }

    public function compileAll($name, $force = false) {
        $name = $this->_realpath($name);
        $files = array($name);
        $state = 'compile';
        for ($i = 0; $i < count($files); $i++) {
            $compilepath = $this->compile($files[$i], $force);
            include($compilepath);
        }
        return $this->_compilepath($name);
    }

    /** compile
     * Компилирует файл $name и возвращает путь к откомпилированному файлу.
     * В случае, если имеется актуальная откомпилированная версия и параметр $force
     * равен false, повторная компиляция не производится.
     */
    public function compile($name, $force = false) {
        $name = $this->_realpath($name);
        if (!$force && ($compilepath = $this->isCompiled($name)))
            return $compilepath;

        $compileCode = array('output' => '', 'compile' => '', 'include_files' => '', 'include_labels' => '', 'meta' => '');
        $codeLines = file($name);
        $this->currentFile = $name;

        foreach ($this->directiveList() as $directive)
            $this->_callDirectiveMethod($directive, 'init', array());
        for ($this->currentLine = 0; $this->currentLine < count($codeLines); $this->currentLine++) {
            $line = $codeLines[$this->currentLine];
            if (strpos($line, "//##") === 0)
                continue;
            foreach ($this->_prefilters as $prefilter)
                $line = call_user_func($prefilter, $line);
            if (preg_match("/^\\s*(\/\/|\/\*)#([a-z_]+)(?:\\s(.*?))?$/i", $line, $match)) {
                $mode = $match[1];
                $directive = $match[2];
                $arguments = array_key_exists(3, $match) ? $match[3] : "";
                if ($mode == '/*') {
                    while (true) {
                        if ($this->currentLine >= count($codeLines))
                            throw new JsProcessor_Exception('Unexpected end of file');
                        $line = $codeLines[++$this->currentLine];
                        if (trim($line) == '*/')
                            break;
                        $arguments .= $line;
                    }
                }
                if ($this->directiveExists($directive)) {
                    try {
                        $data   = $this->_callDirectiveMethod($directive, 'parse', $arguments, array());
                        $data   = $this->_callDirectiveMethod($directive, 'process', $data, $data);
                        $result = $this->_callDirectiveMethod($directive, 'generate', $data, '');
                    } catch (JsProcessor_Compiler_Exception $e) {
                        $result = $this->_generateJsException($e->getMessage());
                    }
                    foreach ($result as $section => $code)
                        $compileCode[$section] .= $code;
                } else
                    throw new JsProcessor_Exception("Unknown directive $directive");
            }
        }

        $rfn = str_replace("\\", "/", $name);
        $compileCode['encodedFileUrl'] = base64_encode(strpos($rfn, $_SERVER['DOCUMENT_ROOT']) === 0 ? str_replace($_SERVER['DOCUMENT_ROOT'], "http://" . $_SERVER['HTTP_HOST'], $rfn) : "");
        $compileCode['name'] = $name;
        $code = $this->_format($this->_templates['main'], $compileCode);
        $compileFileName = $this->_compilepath($name);
        file_put_contents($compileFileName, $code);

        return $compileFileName;
    }

    public function registerDirective($name, $init = NULL, $parse = NULL, $process = NULL, $generate = NULL, $prefilter = NULL, $postfilter = NULL) {
        $this->_directives[$name] = array('init' => $init, 'parse' => $parse, 'process' => $process, 'generate' => $generate);
        if (!is_null($prefilter))
            array_unshift($this->_prefilters, $prefilter);
        return $this;
    }

    public function directiveList() {
        return array_keys($this->_directives);
    }

    public function directiveExists($name) {
        return array_key_exists($name, $this->_directives);
    }

    protected function _callDirectiveMethod($name, $method, $arg, $default = false) {
        if (isset($this->_directives[$name]) && isset($this->_directives[$name][$method]) && !is_null($this->_directives[$name][$method]))
            return call_user_func($this->_directives[$name][$method], $arg);
        return $default;
    }

    // Обработка обычных строк
    protected function _prefilterJscode($line) {
        return preg_replace('/^(?!\s*(\/\/|\/\*)#)/', '//#jscode ', $line);
    }

    protected function _initJscode() {
        $this->_templates['jscode'] = "  echo \$this->compileConstants(base64_decode('#{code}'), \$constants, \$filesStack); \n";
        return array();
    }

    protected function _parseJscode($arguments) {
        return array('code' => $arguments);
    }

    protected function _processJscode($data) {
        return $data;
    }

    private function _generateJscode($data) {
        $data['code'] = base64_encode($data['code']);
        return array('output' => $this->_format($this->_templates['jscode'], $data));
    }

    // Обработка директивы include
    protected function _initInclude() {
        $this->_templates['include']         = "  include('#{path}'); \n";
        $this->_templates['include_files']   = "  if (!in_array('#{requiredFile}', \$requiredFiles)): \n"
                                             . "    \$requiredFiles[] = '#{requiredFile}';            \n"
                                             . "  endif;                                              \n";
        $this->_templates['include_compile'] = "  if (!in_array('#{compiledFile}', \$files)):         \n"
                                             . "    \$files[] = '#{compiledFile}';                    \n"
                                             . "  endif;                                              \n";
        $this->_templates['include_labels_cond'] = "  if (in_array('#{label}', \$labels)) ";
        $this->_templates['include_labels']  = "  \$labels[] = '#{label}';                            \n";
        $this->_parseParams['requiredFilesList']  = array();
        $this->_parseParams['requiredLabelsList'] = array();
        $this->_parseParams['compiledFilesList']  = array();
        return array();
    }

    protected function _parseInclude($arguments) {
        $arguments = trim($arguments);
        if (preg_match("/^(<|\")([-a-z_0-9:.\\/\\$]+)(>|\")$/i", $arguments, $match)) {
            $includingFileStructure = explode("::", $match[2]);
            return array('local' => $match[1] == '"', 'filename' => array_shift($includingFileStructure), 'labels' => $includingFileStructure);
        } else
            throw new JsProcessor_Compiler_Exception("Bad format of directive #include(_once)");
    }

    protected function _processInclude($data) {
        $workDir = dirname($this->currentFile) . DIRECTORY_SEPARATOR;
        if ($data['filename'] == 'self')
            $includingFileName = $this->currentFile;
        else {
            $includingFileName = false;
            if ($data['local']) {
                try {
                    $includingFileName = $this->_realpath($workDir . $data['filename']);
                } catch(JsProcessor_Exception $e) {
                }
            } else
                $includingFileName = $this->getScriptPath($data['filename']);
                if ($includingFileName === false)
                    throw new JsProcessor_Compiler_Exception("File {$data['filename']} not found");
        }
        $data['filename'] = $includingFileName;
        $includingCompileFileName = $this->_compilepath($includingFileName);
        if (!in_array($includingFileName, $this->_parseParams['requiredFilesList']))
            $data['requiredFile'] = $this->_parseParams['requiredFilesList'][] = $includingCompileFileName;
        if (!in_array($includingFileName, $this->_parseParams['compiledFilesList']))
            $data['compiledFile'] = $this->_parseParams['compiledFilesList'][] = $includingFileName;
        $data['labels'][] = count($data['labels']) > 0 ? "base" : "full";
        $data['requiredLabels'] = array();
        for ($i = 0; $i < count($data['labels']); $i++) {
            $label = $includingFileName . "::" . $data['labels'][$i];
            $n = count($this->_parseParams['requiredLabelsList']);
            $this->_parseParams['requiredLabelsList'][$n] = array($label);
            for ($j = 0; $j < count($this->_parseParams['labelsStack']); $j++)
                $this->_parseParams['requiredLabelsList'][$n][] = $this->_parseParams['labelsStack'][$j][0] . "::" . $this->_parseParams['labelsStack'][$j][2];
            $data['requiredLabels'][] = $this->_parseParams['requiredLabelsList'][$n];
        }
        $data['path'] = $this->_compilepath($data['filename']);
        return $data;
    }

    protected function _generateInclude($data) {
        $code = array();
        if (isset($data['requiredFile']))
            $code['include_files'] = $this->_format($this->_templates['include_files'], $data);
        if (isset($data['compiledFile']))
            $code['compile'] = $this->_format($this->_templates['include_compile'], $data);
        if (isset($data['requiredLabels'])) {
            $code['include_labels'] = '';
            for ($i = 0; $i < count($data['requiredLabels']); $i++) {
                $label = $data['requiredLabels'][$i];
                for ($j = 1; $j < count($label); $j++)
                    $code['include_labels'] .= $this->_format($this->_templates['include_labels_cond'], array('label' => $label[$j]));
                $code['include_labels'] .= $this->_format($this->_templates['include_labels'], array('label' => $label[0]));
            }
        }
        if ($data['filename'] != $this->currentFile)
            $code['output'] = $this->_format($this->_templates['include'], $data);
        return $code;
    }

    // Обработка директиву include_once
    protected function _initInclude_once() {
        $this->_templates['include_once'] = "  if (!in_array('#{filename}', \$includedFiles)): \n"
                                          . "  #{include}"
                                          . "  endif;                                          \n";
        return array();
    }

    protected function _parseInclude_once($arguments) {
        return $this->_parseInclude($arguments);
    }

    protected function _processInclude_once($data) {
        $data = $this->_processInclude($data);
        $data['once'] = true;
        return $data;
    }

    protected function _generateInclude_once($data) {
        $output = $this->_generateInclude($data);
        $data['include'] = isset($output['output']) ? $output['output'] : '';
        $output['output'] = $this->_format($this->_templates['include_once'], $data);
        return $output;
    }

    // Обработка директивы define
    protected function _initDefine() {
        $this->_templates['define_superglobal'] = "  if (array_key_exists('#{arrayKey}', \$_#{arrayName})):                                              \n"
                                                . "    \$constants['#{constName}'] = '\\'' . \$_#{arrayName}['#{arrayKey}'] . '\\'';                     \n"
                                                . "  else:                                                                                               \n"
                                                . "    #{exception}                                                                                      \n"
                                                . "  endif;                                                                                              \n";

        $this->_templates['define_variable']    = "  try {                                                                                               \n"
                                                . "    \$constants['#{constName}'] = \$this->#{varName};                                                 \n"
                                                . "  } catch (JsProcessor_Exception \$e) {                                                               \n"
                                                . "    #{exception}                                                                                      \n"
                                                . "  }                                                                                                   \n";

        $this->_templates['define_constant']    = "  \$constants['#{constName}'] = \$this->compileConstants('#{constValue}', \$constants, \$filesStack); \n";

        return array();
    }

    protected function _parseDefine($arguments) {
        $arguments = trim($arguments);
        if (preg_match("/^([_a-z][_a-z0-9]*)(?:\\s+(.*))$/i", $arguments, $match))
            list($constName, $constValue) = array($match[1], array_key_exists(2, $match) ? $match[2] : "true");
        else
            throw new JsProcessor_Compiler_Exception('Bad #define directive');

        if (preg_match("/^\\\$_(SERVER|GET|POST|COOKIE|SESSION)\[(\"|')(.*?)\\2\]$/", $constValue, $match))
            return array('type' => 'superglobal', 'constName' => $constName, 'arrayName' => $match[1], 'arrayKey' => $match[3]);
        elseif (preg_match("/^\\\$([_a-z][_a-z0-9]*)/i", $constValue, $match))
            return array('type' => 'variable', 'constName' => $constName, 'varName' => $match[1]);
        else
            return array('type' => 'constant', 'constName' => $constName, 'constValue' => $constValue);
    }

    protected function _processDefine($data) {
        if ($data['type'] == 'superglobal')
            $data['exception'] = $this->_generateJsException("Undefined index: {$data['arrayKey']}");
        if ($data['type'] == 'variable')
            $data['exception'] = $this->_generateJsException("Undefined variable: {$data['varName']}");
        if (isset($data['exception']))
            $data['exception'] = $data['exception']['output'];
        if ($data['type'] == 'constant')
            $data['constValue'] = str_replace("'", "\\'", $data['constValue']);
        return $data;
    }

    protected function _generateDefine($data) {
        return array('output' => $this->_format($this->_templates['define_' . $data['type']], $data));
    }

    // Обработка директивы meta
    protected function _initMeta() {
        $this->_templates['meta'] = "  \$meta['#{key}'] = '#{value}';\n";
        return array();
    }

    protected function _parseMeta($arguments) {
        $arguments = trim($arguments);
        if (preg_match('/^([.a-z0-9_]+)\s+((?:.|\r|\n)+$)/i', $arguments, $match))
            list($key, $value) = array($match[1], $match[2]);
        else
            throw new JsProcessor_Compiler_Exception('Bad #meta directive');
        return array('key' => $key, 'value' => $value);
    }

    protected function _processMeta($data) {
        $data['value'] = str_replace("'", "\\'", $data['value']);
        return $data;
    }

    protected function _generateMeta($data) {
        return array('meta' => $this->_format($this->_templates['meta'], $data));
    }

    // Обработка директивы if
    protected function _initIf() {
        $this->_templates['if'] = "  if (#{condition}): \n";
        return array();
    }

    protected function _parseIf($arguments) {
        $arguments = trim($arguments);
        if ($arguments == 'no processing')
            return array('condition' => 'false');
        else
            throw new JsProcessor_Compiler_Exception('Bad #if directive');
    }

    protected function _processIf($data) {
        return $data;
    }

    protected function _generateIf($data) {
        return array('output' => $this->_format($this->_templates['if'], $data));
    }

    // Обработка директивы endif
    protected function _initEndif() {
        $this->_templates['endif'] = "  endif; \n";
        return array();
    }

    protected function _parseEndif($arguments) {
        $arguments = trim($arguments);
        if ($arguments != '')
            throw new JsProcessor_Compiler_Exception('Bad #endif directive');
        return array();
    }

    protected function _processEndif($data) {
        return $data;
    }

    protected function _generateEndif($data) {
        return array('output' => $this->_templates['endif']);
    }

    // Обработка директивы label
    protected function _initLabel() {
        $this->_parseParams['labelsStack'] = array();
        $this->_templates['label'] = "  if (in_array('#{file}::#{label}', \$labels) || in_array('#{file}::full', \$labels) || !in_array('#{file}::base', \$labels)): \n";
        return array();
    }

    protected function _parseLabel($arguments) {
        $arguments = trim($arguments);
        if (!preg_match("/^[_a-z\\$][_a-z0-9\\$]*$/i", $arguments))
            throw new JsProcessor_Compiler_Exception("Bad #label directive");
        if ($arguments == "base" || $arguments == "full")
            throw new JsProcessor_Compiler_Exception("Label $label is reserved");
        return array('label' => $arguments);
    }

    protected function _processLabel($data) {
        array_push($this->_parseParams['labelsStack'], array($this->currentFile, $this->currentLine, $data['label']));
        $data['file'] = $this->currentFile;
        return $data;
    }

    protected function _generateLabel($data) {
        return array('output' => $this->_format($this->_templates['label'], $data));
    }

    // Обработка директивы endlabel
    protected function _initEndlabel() {
        $this->_templates['endlabel'] = "  endif; \n";
        return array();
    }

    protected function _parseEndlabel($arguments) {
        return array();
    }

    protected function _processEndlabel($data) {
        if (!count($this->_parseParams['labelsStack']))
            throw new JsProcessor_Compiler_Exception("Unexpected #endlabel");
        array_pop($this->_parseParams['labelsStack']);
        return $data;
    }

    protected function _generateEndlabel() {
        return array('output' => $this->_templates['endlabel']);
    }

    // Обработка комментариев
    protected function _prefilterComment($line) {
        if (strpos($line, '*/') === false) {
            if ($this->_parseParams['comment_open']) {
                $this->_parseParams['comment_open'] = false;
                return '//#endcomment';
            }
        }
        return strpos($line, '*/') === false ? preg_replace('/^\s*\/\*\* ([a-z][a-z0-9._]*)/i', '//#comment $1') : $line;
    }

    protected function _initComment() {
        $this->_parseParams['comment_open'] = false;
    }

    protected function _generateJsException($message, $file = "", $line = 0) {
        $file = $file == "" ? $this->currentFile : $file;
        $line = $line == 0  ? $this->currentLine : $line;
        return $this->_generateJscode(array('code' => $this->_format($this->_templates['exception'], array('message' => $message, 'file' => addslashes($file), 'line' => $line))));
    }

    protected function _compilepath($name) {
        $fname = basename($name);
        return $this->_compileDir . DIRECTORY_SEPARATOR . strtoupper(md5($name)) . '-' . $fname . '.php';
    }

    protected function _realpath($name) {
        $path = realpath($name);
        if ($path === false || !is_readable($path)) {
            require_once "JsProcessor_Exception.php";
            throw new JsProcessor_Exception("File $name not found");
        }
        return $path;
    }

    protected function _format($template, $vars) {
        $search  = array();
        $replace = array();
        foreach ($vars as $key => $value)
        if (is_string($value)) {
            $search[]  = "#{{$key}}";
            $replace[] = $value;
        }
        return str_replace($search, $replace, $template);
    }

    protected function _camelcase($str) {
        $search = array();
        $replace = array();
        preg_match_all('/-([a-z])/', $str, $matches);
        for ($i = 0; $i < count($matches[0]); $i++) {
            $search[] = '-' . $matches[1][$i];
            $replace[] = strtoupper($matches[1][$i]);
        }
        return str_replace($search, $replace, $str);
    }
}

require_once "JsProcessor_Exception.php";
class JsProcessor_Compiler_Exception extends JsProcessor_Exception {};