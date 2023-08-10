<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR . '/core/webuser.php';

use \FGTA4\WebUser;

class fgrole_headerHandler extends WebAPI  {

	public function PreCheckInsert($data, &$obj, &$options) {
		$this->PreCheckEdit('membuat');
	}

	public function PreCheckUpdate($data, &$obj, &$key, &$options) {
		$this->PreCheckEdit('mengedit');
	}
	public function PreCheckDelete($data, &$key, &$options) {
		$this->PreCheckEdit('menghapus');
	}

	function PreCheckEdit($action) : void {
		$userdata = $this->auth->session_get_user();
		WebUser::setDb($this->db);
		if (!WebUser::hasPermissions($userdata->username, ['ROLE_EDIT'], 'RESTRICT_ROLEMANAGEMENT')) {
			throw new \Exception("anda tidak diperbolehkan untuk $action role");
		}

	}
}		
		
		
		