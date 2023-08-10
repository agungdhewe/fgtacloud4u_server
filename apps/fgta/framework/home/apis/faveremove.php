<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __DIR__ . '/xapi.base.php';

use \FGTA4\exceptions\WebException;

$API = new class extends homeBase {
	
	public function execute($module) {
		$userdata = $this->auth->session_get_user();

		try {
			// cek apakah user boleh mengeksekusi API ini
			if (!$this->RequestIsAllowedFor($this->reqinfo, "faveremove", $userdata->groups)) {
				throw new \Exception('your group authority is not allowed to do this action.');
			}

			if (!property_exists($module, 'variancename')) {
				$module->variancename='';
			}

			if ($module->variancename==null) {
				$module->variancename='';
			}

			$result = new \stdClass; 

			$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,0);
			$this->db->beginTransaction();

			try {
				
				$sqlRemove = "
					delete from fgt_userfavemod
					where
					user_id = :user_id and modulefullname = :modulefullname and variancename = :variancename
				";

				$stmt = $this->db->prepare($sqlRemove);
				$stmt->execute([
					':user_id' => $userdata->username,
					':modulefullname' => $module->modulefullname,
					':variancename' => $module->variancename,
				]);


				$this->db->commit();
				$result->success = true;
			} catch (\Exception $ex) {
				$result->success = false;
				$this->db->rollBack();
				throw $ex;
			} finally {
				$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,1);
			}			

			return $result;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

};