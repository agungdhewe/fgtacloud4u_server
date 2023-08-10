<?php namespace FGTA4;

if (!defined('FGTA4')) {
	die('Forbiden');
}


require_once __ROOT_DIR . '/core/encryption.php';

use FGTA4\utils\Encryption;

class WebAuth {

	const KEY_LENGTH = 30;
	const SESSION_LIFETIME = 10*60; // menit

	public function __construct() {
		// ini_set('session.use_cookies', 0);
	}

	public function SessionCheck() {



	}

	public function is_login() {
		global $_SESSION;
		if (!isset($_SESSION)) {
			return false;
		}

		if (!array_key_exists('islogin', $_SESSION)) {
			return false;
		}

		return ($_SESSION['islogin']==1);
	}

	public function get_groups() {
		return ['public'];
	}

	public function session_user_start($userdata) {
		global $_SESSION;
		

		$session_id = session_id();
		$enckey = $this->generateKey();
		
		$_SESSION['islogin']=1;
		$_SESSION['enckey'] = $enckey;
		$_SESSION['userdata'] =  json_encode($userdata);
		
		$username = $userdata->username;
		$userfullname = $userdata->userfullname;
		$tokenraw = "$session_id|$username|$userfullname";

		$enc = new Encryption();
		$tokenid = $enc->encrypt($tokenraw, $enckey) . $enckey;

		return $tokenid;
	}

	public function session_get_user() {
		global $_SESSION;

		if (is_array($_SESSION)) {
			if (array_key_exists('userdata', $_SESSION)) {
				return json_decode($_SESSION['userdata']);
			}
		}
		return json_decode("{}");
	}

	public function session_user_logout() {
		global $_SESSION;
		unset($_SESSION['islogin']);
		unset($_SESSION['userdata']);
		session_destroy();
	}

	public function session_get_user_jsondata() {
		global $_SESSION;

		if (!isset($_SESSION)) {
			return '';
		}	
		
		if (!array_key_exists('userdata', $_SESSION)) {
			return '';
		}
		
		return $_SESSION['userdata'];
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
