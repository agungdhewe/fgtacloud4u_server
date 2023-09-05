<?php namespace FGTA4;

if (!defined('FGTA4')) {
	die('Forbiden');
}


require_once __ROOT_DIR . '/core/encryption.php';

use FGTA4\utils\Encryption;

class WebAuthDummy {

	public function __construct() {
		// ini_set('session.use_cookies', 0);
	}

	public function SessionCheck() {
	}

	public function is_login() {
		return true;
	}

	public function get_groups() {
		return ['public'];
	}

	public function session_user_start($userdata) {
		return "9999";
	}

	public function session_get_user() {
		$userdata = new \stdClass;
		$userdata->username='5effbb0a0f7d1';
		$userdata->userfullname='AGUNG NUGROHO';
		$userdata->empl_id='438051';
		$userdata->empl_name='AGUNG NUGROHO DWI WIBOWO';
		return $userdata;
	}

	public function session_user_logout() {
	}

	public function session_get_user_jsondata() {
		return json_encode($this->session_get_user());
	}

	public function generateKey() : string {
		$length = self::KEY_LENGTH;
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}

}
