<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';



use \FGTA4\exceptions\WebException;


class LoadGender extends WebAPI {
	function __construct() {
		$this->debugoutput = true;

		$DB_CONFIG = DB_CONFIG[MAINDB];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM[MAINDBTYPE];

		$this->db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);

	}

	public function execute($options) {
		try {
			$result = new \stdClass; 
			$records = array();
			$records[] = ["id"=>'L', "text"=>"Laki-laki"];
			$records[] = ["id"=>'P', "text"=>"Perempuan"];
			
			$result->records = $records;

			return $result;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

}

$API = new LoadGender();