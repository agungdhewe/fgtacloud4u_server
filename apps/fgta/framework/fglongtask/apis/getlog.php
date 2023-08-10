<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';

use \FGTA4\exceptions\WebException;


$API = new class extends WebAPI {

	function __construct() {
		$DB_CONFIG = DB_CONFIG[$GLOBALS['MAINDB']];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM[$GLOBALS['MAINDBTYPE']];		
		$this->db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);
	}

	

	public function execute(string $log) : string {
		$logfile = base64_decode($log);
		$fp = fopen($logfile, "r");
		$content = fread($fp, filesize($logfile));


		$content = str_replace("\x1b[31m", '<span style="color:red; font-weight:bold">', $content);
		$content = str_replace("\x1b[1m", '<span style="font-weight:bold">', $content);
		$content =  str_replace("\x1b[0m", '</span>', $content);


		return $content ;
	}

};