<?php namespace FGTA;


require_once __ROOT_DIR . "/core/cliworker.php";
 
console::class(new class($args) extends cliworker {
	function __construct($args) {
		$this->opt = getopt("i:");
		$this->outputpath = implode('/', ['/mnt/ramdisk', "output-". $opt['i'] . ".txt"]);
		$this->fp = fopen($outputpath, "w");
		
	}

	function execute() {
		// try {

		// 	print_r($opt);
		// 	for ($i=1; $i<=100; $i++) {
		// 		echo "$i";
		// 		fputs($fp, $i);
		// 		sleep(1);
		// 	}

		// 	fclose($this->fp);
		// 	unlink($outputpath);
		// } catch (Exception $ex) {
		// } finally {
		// 	fclose($this->fp);
		// }
	}

});