<?php namespace FGTA4;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';

use \FGTA4\utils\SqlUtility;

class cliworker {

	protected $db;
	protected string $username;
	protected string $pid;
	protected ?string $logfile = null;


	function __construct($args) {

		// connect to DB
		$DB_CONFIG = DB_CONFIG[$GLOBALS['MAINDB']];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM[$GLOBALS['MAINDBTYPE']];		
		$this->db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);
	}

	protected function registerProcess(string $name, string $pid, string $username) : void {
		$this->pid = $pid;
		$this->username = $username;

		$tablename = "fgt_longtask";
		
		try {
			$sql = "select longtask_id, longtask_isrunning from $tablename where longtask_id=:pid";
			$stmt = $this->db->prepare($sql);
			$stmt->execute([':pid'=>$pid]);
			$rows = $stmt->fetchall();

			if (count($rows)>0) {
				$longtask_isrunning = $rows[0]['longtask_isrunning'];
				if ($longtask_isrunning!=0) {
					throw new \Exception("Process dengan pid $pid masih berjalan.");
				} else {
					$sql = "delete from $tablename where longtask_id=:pid";
					$stmt = $this->db->prepare($sql);
					$stmt->execute([':pid'=>$pid]);
				}
			} 
		

			$obj = new \stdClass;
			$obj->longtask_id = $pid;
			$obj->longtask_name = $name;
			$obj->longtask_taskdescr = 'Starting';
			$obj->longtask_isrunning = 1;
			$obj->longtask_lastprogressid = uniqid();
			$obj->longtask_logfile = $this->logfile;
			$obj->_createby = $username;
			$obj->_createdate = date("Y-m-d H:i:s");

			$cmd = SqlUtility::CreateSQLInsert($tablename, $obj);
			$stmt = $this->db->prepare($cmd->sql);
			$stmt->execute($cmd->params);

		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	protected function commitProcess() : void {
		$pid = $this->pid;
		$username = $this->username;
		$tablename = "fgt_longtask";
		
		try {

			$obj = new \stdClass;
			$obj->longtask_id = $pid;
			$obj->longtask_isrunning = 0;
			$obj->longtask_iscomplete = 1;
			$obj->longtask_lastprogressid = uniqid();
			$obj->_modifyby = $username;
			$obj->_modifydate = date("Y-m-d H:i:s");

			$key = new \stdClass;
			$key->longtask_id = $obj->longtask_id;

			$cmd = SqlUtility::CreateSQLUpdate($tablename, $obj, $key);
			$stmt = $this->db->prepare($cmd->sql);
			$stmt->execute($cmd->params);

		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	protected function updateProcess($progress, $taskdescr) : void {

		echo "($progress%) $taskdescr\r\n";

		$pid = $this->pid;
		$username = $this->username;
		$tablename = "fgt_longtask";
		
		try {

			$obj = new \stdClass;
			$obj->longtask_id = $pid;
			$obj->longtask_progress = $progress;
			$obj->longtask_taskdescr = $taskdescr;
			$obj->longtask_lastprogressid = uniqid();
			$obj->_modifyby = $username;
			$obj->_modifydate = date("Y-m-d H:i:s");

			$key = new \stdClass;
			$key->longtask_id = $obj->longtask_id;

			$cmd = SqlUtility::CreateSQLUpdate($tablename, $obj, $key);
			$stmt = $this->db->prepare($cmd->sql);
			$stmt->execute($cmd->params);

		} catch (\Exception $ex) {

			throw $ex;
		}
	}

	protected function isRequestingCancel() : bool {
		$pid = $this->pid;
		$username = $this->username;
		$tablename = "fgt_longtask";
		
		try {
			$sql = "select longtask_id, longtask_isrequestcancel from $tablename where longtask_id=:pid";
			$stmt = $this->db->prepare($sql);
			$stmt->execute([':pid'=>$pid]);
			$rows = $stmt->fetchall();
			
			if (count($rows)>0) {
				$longtask_isrequestcancel = $rows[0]['longtask_isrequestcancel'];
				if ($longtask_isrequestcancel==0) {
					return false;
				} else {
					return true;
				}
			} else {
				throw new \Exception("process dengan pid $pid tidak ditemukan");
			}
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	protected function cancelProcess() : void {
		
		echo "canceling progress";

		$pid = $this->pid;
		$username = $this->username;
		$tablename = "fgt_longtask";
		
		try {
			$obj = new \stdClass;
			$obj->longtask_id = $pid;
			$obj->longtask_isrunning = 0;
			$obj->longtask_iscanceled = 1;
			$obj->longtask_lastprogressid = uniqid();
			$obj->_modifyby = $username;
			$obj->_modifydate = date("Y-m-d H:i:s");

			$key = new \stdClass;
			$key->longtask_id = $obj->longtask_id;
			$cmd = SqlUtility::CreateSQLUpdate($tablename, $obj, $key);
			$stmt = $this->db->prepare($cmd->sql);
			$stmt->execute($cmd->params);

		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	protected function haltProcess(string $message) : void {
		
		echo "error occured in progress";

		$pid = $this->pid;
		$username = $this->username;
		$tablename = "fgt_longtask";
		
		try {
			$obj = new \stdClass;
			$obj->longtask_id = $pid;
			$obj->longtask_isrunning = 0;
			$obj->longtask_iserror = 1;
			$obj->longtask_lastprogressid = uniqid();
			$obj->longtask_taskdescr = substr($message, 0, 255);
			$obj->_modifyby = $username;
			$obj->_modifydate = date("Y-m-d H:i:s");

			$key = new \stdClass;
			$key->longtask_id = $obj->longtask_id;
			$cmd = SqlUtility::CreateSQLUpdate($tablename, $obj, $key);
			$stmt = $this->db->prepare($cmd->sql);
			$stmt->execute($cmd->params);

		} catch (\Exception $ex) {
			throw $ex;
		}
	}

}
