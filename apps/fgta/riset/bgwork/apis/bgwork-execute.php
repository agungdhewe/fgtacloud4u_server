<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

use \FGTA4\exceptions\WebException;

$API = new class extends WebAPI {
	public function execute($param1) {
		$id = uniqid();
		$prg = implode('/', [__DIR__, 'worker.php']);
		$cmd = "php $prg -i $id";
		$pid = shell_exec("nohup $cmd > /dev/null & echo $!");
		return [
			'pid' => $pid,
			'procid' => $id,
			'cmd' => $cmd,
		];
	}
};


