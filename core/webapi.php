<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

define('API_ERROR_RESOURCE_NOTFOUND', 10);
define('API_ERROR_PARAMETER', 20);
define('API_ERROR_GENERAL', 9999);


require_once __DIR__ . '/sqlutil.php';
require_once __DIR__ . '/webprog.php';

use \FGTA4\utils\SqlUtility;



class WebAPI extends \FGTA4\WebProg {
	
	public function ActionIsAllowedFor($api_info, $user_owned_groups) {
	
		try {
			if ($user_owned_groups==null) {
				$user_owned_groups = ['public'];
			}

			$api_allowed_groups = property_exists($api_info, 'allowedgroups') ? $api_info->allowedgroups : ['public'];
			foreach ($api_allowed_groups as $allowed_group) {
				if (in_array($allowed_group, $user_owned_groups)) {
					return true;
				}
			}
			return false;
		} catch (\Exception $ex) {
			throw $ex;
		}

	}	

	
	public function RequestIsAllowedFor($reqinfo, $apiname, $user_owned_groups) {
		$allowed = false;
	
		try {

			if ($user_owned_groups==null) {
				$user_owned_groups = ['public'];
			}

			if (!property_exists($this->configuration->apis, $apiname)) {
				$allowed = true;
			} else {
				$api_info = $this->configuration->apis->$apiname;
				$api_allowed_groups = property_exists($api_info, 'allowedgroups') ? $api_info->allowedgroups : ['public'];
				foreach ($api_allowed_groups as $allowed_group) {
					if (in_array($allowed_group, $user_owned_groups)) {
						$allowed = true;
					}
				}
			}
			
			return $allowed;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	public function addFields(string $columnname, string $checkcolum, array &$record,  string $tablename, string $namefield, string $idfield) {
		if (array_key_exists($checkcolum, $record)) {
			$value = SqlUtility::Lookup($record[$checkcolum], $this->db, $tablename, $idfield, $namefield);
			$record[$columnname] = $value;
		}
	}

	public function SelectColumns(array $fields, array $columns) {
		if (is_array($columns)) {
			if (count($columns)>0) {
				$columsSelected = [];
				foreach ($columns as $fieldname) {
					if (array_key_exists($fieldname, $fields)) {
						$columsSelected[$fieldname] = $fields[$fieldname];
					}
				}
				return $columsSelected;
			} else {
				return $fields;
			}
		} else {
			return $fields;
		}
	}


	public function debug($obj, $newline="\r\n") {
		$this->debugoutput = true;
		if (is_array($obj) || \is_object($obj)) {
			print_r($obj);
		} else {
			echo $obj . $newline;
		}
	}

	public function isDebugOutput() {
		$debugoutput = \property_exists($this, 'debugoutput') ? $this->debugoutput : false;
		return $debugoutput;
	}

}

