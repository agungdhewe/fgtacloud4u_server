<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __ROOT_DIR.'/core/debug.php';
require_once __DIR__ . '/xapi.base.php';

use \FGTA4\exceptions\WebException;


$API = new class extends preferenceBase {

	public function execute($param) {
		$userdata = $this->auth->session_get_user();

		try {

			$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,0);
			$this->db->beginTransaction();

			try {

				$dash_id = ($param->dash_id == '--NULL--') ? null : $param->dash_id;

				$sql_update = "
					update fgt_user
					set 
					dash_id = :dash_id
					where
					user_id = :user_id
				";
				$stmt_update = $this->db->prepare($sql_update);
				$stmt_update->execute([':user_id'=>$userdata->username, ':dash_id'=>$dash_id ]);

				$this->db->commit();
				return (object)[
					'success' => true,
				];
			} catch (\Exception $ex) {
				$this->db->rollBack();
				throw $ex;
			} finally {
				$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,1);
			}


		} catch (\Exception $ex) {
			throw $ex;
		}
	}


};


