<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __DIR__ . '/xapi.base.php';

use \FGTA4\exceptions\WebException;

$API = new class extends homeBase {
	
	public function execute() {
		$userdata = $this->auth->session_get_user();

		try {
			// cek apakah user boleh mengeksekusi API ini
			if (!$this->RequestIsAllowedFor($this->reqinfo, "favelist", $userdata->groups)) {
				throw new \Exception('your group authority is not allowed to do this action.');
			}

			$result = new \stdClass; 
			
			$sql = "
				select * from fgt_userfavemod
				where
				user_id = :user_id 
			";
			$stmt = $this->db->prepare($sql);
			$stmt->execute([
				':user_id' => $userdata->username,
			]);

			$rows = $stmt->fetchall();
			$result->records = [];

			foreach ($rows as $row) {
				$modulefullname = $row['modulefullname'];
				$variancename = $row['variancename'];
				if ($variancename=='') {
					$_id = "__fgtamodule-" . base64_encode("$modulefullname") . "__";
				} else {
					$_id = "__fgtamodule-" . base64_encode("$modulefullname-$variancename") . "__";
				}


				$result->records[] = [
					'title' => $row['title'],
					'modulefullname' => $modulefullname,
					'variancename' => $variancename,
					'forecolor' => $row['forecolor'],
					'backcolor' => $row['backcolor'],
					'icon' => $row['icon'],
					'_id' => $_id	
				];
			}

			return $result;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

};