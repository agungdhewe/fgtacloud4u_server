<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';

use \FGTA4\exceptions\WebException;
use \FGTA4\utils\SqlUtility;

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

	

	public function execute(object $param) : object {
		$userdata = $this->auth->session_get_user();
		$pid = $param->pid;
		$tablename = "fgt_longtask";

		try {
			$obj = new \stdClass;
			$obj->longtask_id = $pid;
			$obj->longtask_isrequestcancel = 1;
			$obj->_modifyby = $userdata->username;
			$obj->_modifydate = date("Y-m-d H:i:s");
	
			$key = new \stdClass;
			$key->longtask_id = $obj->longtask_id;
	
			$cmd = SqlUtility::CreateSQLUpdate($tablename, $obj, $key);
			$stmt = $this->db->prepare($cmd->sql);
			$stmt->execute($cmd->params);
	
			return (object)[
				'message' => "task di cancel"
			];
		} catch (\Exception $ex) {
			throw $ex;
		}

	}

};