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
			if (!$this->RequestIsAllowedFor($this->reqinfo, "faveadd", $userdata->groups)) {
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
				
				// cek dulu apakah sudah ada
				$sqlCek = "
					select * from fgt_userfavemod
					where
					user_id = :user_id and modulefullname = :modulefullname and variancename = :variancename
				";
				$stmt = $this->db->prepare($sqlCek);
				$stmt->execute([
					':user_id' => $userdata->username,
					':modulefullname' => $module->modulefullname,
					':variancename' => $module->variancename,
				]);

				$row = $stmt->fetch();
				if (!$row) {
					$obj = new \stdClass;
					$obj->userfavemod_id = uniqid();
					$obj->title = $module->title;
					$obj->modulefullname = $module->modulefullname;
					$obj->variancename = $module->variancename;
					$obj->forecolor = $module->forecolor;
					$obj->backcolor = $module->backcolor;
					$obj->icon = $module->icon;
					$obj->user_id = $userdata->username;
					$obj->_createby = $userdata->username;
					$obj->_createdate = date('Y-m-d H:i:s');

					$cmd = \FGTA4\utils\SqlUtility::CreateSQLInsert('fgt_userfavemod', $obj);
					$stmt = $this->db->prepare($cmd->sql);
					$stmt->execute($cmd->params);
				} 

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