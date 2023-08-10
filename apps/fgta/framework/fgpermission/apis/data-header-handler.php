<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR . '/core/webuser.php';

use \FGTA4\WebUser;


class fgpermission_headerHandler extends WebAPI  {
	// public function init(object &$options) : void {
	// 	$userdata = $this->auth->session_get_user();

	// 	WebUser::setDb($this->db);
	// 	if (!WebUser::hasPermissions($userdata->username, ['PERMISSION EDIT'])) {
	// 		throw new \Exception('anda tidak diperbolehkan untuk edit permission');
	// 	}

	// }


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
		if (!WebUser::hasPermissions($userdata->username, ['PERMISSION_EDIT'], 'RESTRICT_ROLEMANAGEMENT')) {
			throw new \Exception("anda tidak diperbolehkan untuk $action permission");
		}

	}

}		
		
		
		