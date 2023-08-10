<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';



use \FGTA4\exceptions\WebException;


class DataList extends WebAPI {
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

	public function execute($options) {
		try {
			if (!array_key_exists('c', $_GET)) {
				throw new \Exception('format request salah');
			}	

			$configdata = $this->reqinfo->moduleconfig->data;
			$tempdir = __ROOT_DIR . '/temps/' . $configdata->tempupload;
			if (!is_dir($tempdir)) {
				throw new \Exception("direktori '$tempdir' tidak ditemukan");
			}

			if (!property_exists($options, 'process_id')) {
				$options->process_id = uniqid();
			} 

			$process_id = $options->process_id;

			$microservice_port = $configdata->microservice_port;
			$microservice_host = $configdata->microservice_host;



			
			switch ($_GET['c']) {
				case "start" :
					$uploader_service_url = $microservice_host . ":" . $microservice_port . "/start?process_id=" . $process_id;
					$ch = \curl_init(); 
					\curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");  
					\curl_setopt($ch, CURLOPT_URL, $uploader_service_url); 
					\curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
					$output = \curl_exec($ch);			
					\curl_close($ch); 
					$result = json_decode($output);
					if ($result==null) { throw new \Exception('mikroservice error'); } 

					return $result;					

				case "status" :
					$status_service_url = $microservice_host . ":" . $microservice_port . "/status?process_id=" . $process_id;
					$ch = \curl_init(); 
					\curl_setopt($ch, CURLOPT_URL, $status_service_url); 
					\curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
					$output = \curl_exec($ch);			
					\curl_close($ch);
					$result = json_decode($output);
					if ($result==null) { throw new \Exception('mikroservice error'); } 

					return $result;	

			}


	

		} catch (\Exception $ex) {
			throw $ex;
		}
	}

}

$API = new DataList();