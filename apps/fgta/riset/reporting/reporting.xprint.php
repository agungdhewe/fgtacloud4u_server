<?php namespace FGTA4\module; if (!defined('FGTA4')) { die('Forbiden'); } 


$MODULE = new class extends WebModule {
	function __construct() {
		$this->debugoutput = true;
		$DB_CONFIG = DB_CONFIG[$GLOBALS['MAINDB']];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM[$GLOBALS['MAINDBTYPE']];
		$this->db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);
	}
	
	public function TestPreview() {
		$dt = '2022-01-01';
		$this->LoadPage($dt);
	}
	
	public function LoadPage($dt) {
		$userdata = $this->auth->session_get_user();
		try {
		} catch (\Exception $ex) {
			throw $ex;
		}
	}



};
