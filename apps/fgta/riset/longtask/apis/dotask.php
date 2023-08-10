<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}


use \FGTA4\exceptions\WebException;


$API = new class extends WebAPI {

	public function execute(object $param) : object {
		$userdata = $this->auth->session_get_user();

		try {
			$taskname = $param->taskname;
			$data = $param->data;

			return $this->doTask($data, $userdata->username, $taskname);
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	private function doTask($data, $username, $taskname) {
		// jalankan perintah di background;
		$name = $taskname;
		$pid = uniqid();
		$dt = date("Ymd");
		$logfile = "/mnt/ramdisk/log-$dt-$pid.txt";

		$cmdscript = implode('/', [__DIR__, '..', 'cli', 'taskworker.sh']); 
		$command = "$cmdscript -n $name -p $pid -u $username -i $data  2>&1 | tee -a $logfile 2>/dev/null >/dev/null &";
		shell_exec($command);

		return (object)[
			'name' => $name,
			'pid' => $pid,
			'id' => $id,
		];
	}

};

