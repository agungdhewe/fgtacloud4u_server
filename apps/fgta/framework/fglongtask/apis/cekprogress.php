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

	

	public function execute(object $param) : object {
		$pid = $param->pid;

		$sql = "select * from fgt_longtask where longtask_id=:pid";
		$stmt = $this->db->prepare($sql);
		$stmt->execute([':pid'=>$pid]);
		$row = $stmt->fetch();

		if ($row==null) {
			throw new \Exception("pid $pid tidak ditemukan");
		}

		$progress = $row['longtask_progress'];
		$taskdescr = $row['longtask_taskdescr'];
		$running = $row['longtask_isrunning']; 
		$completed = $row['longtask_iscomplete']; 
		$canceled = $row['longtask_iscanceled'];
		$error = $row['longtask_iserror'];
		$lastprogressid = $row['longtask_lastprogressid'];

		return (object)[
			'lastprogressid' => $lastprogressid,
			'progress' => $progress,
			'taskdescr' => $taskdescr,
			'running' => $running,
			'completed' => $completed,
			'canceled' => $canceled,
			'error' => $error
		];
	}

};