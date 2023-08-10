<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __ROOT_DIR.'/core/microserviceadapter.php';


use \FGTA4\exceptions\WebException;


class Longrun extends WebAPI {
	function __construct() {
		$this->debugoutput = true;
	}

	public function execute($options) {
		try {
			if (!array_key_exists('c', $_GET)) {
				throw new \Exception('format request salah');
			}	

			$userdata = $this->auth->session_get_user();
			$configdata = $this->reqinfo->moduleconfig->data;
			$tempdir = __ROOT_DIR . '/temps/' . $configdata->tempupload;
			if (!is_dir($tempdir)) {
				throw new \Exception("direktori '$tempdir' tidak ditemukan");
			}

			if (!property_exists($options, 'process_id')) {
				$options->process_id = uniqid();
			} 


			$process_id = $options->process_id;
			$msa = new \FGTA4\utils\MicroServiceAdapter(
				$configdata->microservice_host, 
				$configdata->microservice_port, 
				$process_id,
				(object)[
					"username" => $userdata->username,
					"tempdir" => $tempdir
				]
			);
	
			$res = new \stdClass;
			switch ($_GET['c']) {
				case "start" :
					$res = $msa->execute('start', (object)[
						"method" => 'POST',
						"data" => ["test"=>"ini coba test data POST", "satu"=>"dua"]
					]);
					break;	

				case "status" :
					$res = $msa->execute('status', (object)[
						"method" => 'GET',
						"data" => null
					]);
					break;
			}

			return (object)[
				'server_pid' => $msa->getServerPid(),
				'process_id' => $msa->getProcessId(),
				'respond' => $res
			];
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

}



$API = new Longrun();