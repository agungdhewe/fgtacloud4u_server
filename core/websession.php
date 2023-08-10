<?php namespace FGTA4;

if (!defined('FGTA4')) {
	die('Forbiden');
}


require_once __ROOT_DIR . '/core/encryption.php';
use FGTA4\utils\Encryption;

class WebSession {

	const KEY_LENGTH = 30;
	const SESSION_LIFETIME = 10*60; // menit

	public static function generateKey($length) : string {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}

	public static function start(?string $tokenid = "", ?object $config = null) : string {

		$tokenraw = "";
		$createnewsession = false;
		if ($tokenid!="") {
			$enc = new Encryption();
			$enckey = substr($tokenid, -self::KEY_LENGTH);
			$tokenenc = substr($tokenid, 0, -self::KEY_LENGTH);
			$tokenraw = $enc->decrypt($tokenenc, $enckey);
			if ($tokenraw==null) {
				if ($config==null) {
					$createnewsession = true;
				} else {
					$allow_blank_token = property_exists($config, 'allow_blank_token') ? $config->allow_blank_token : true;
					if ($allow_blank_token) {
						$createnewsession = true;
					} else {
						throw new \Exception('tokenid is invalid');
					}
				}
			}
		} else {
			$createnewsession = true;
		}


		if ($createnewsession) {
			// token belum ada, buat dummy token (anonymous)
			session_start(["name" => 'tokenid', "use_cookies"=>0]);
			$session_id =  session_id();
			$userid = "";
			$userfullname = "";
			$tokenid = self::createtoken($session_id, $userid, $userfullname);
		} else {
			$token = explode('|', $tokenraw);
			$session_id = $token[0];
			session_id($session_id);
			session_start(["name" => 'tokenid', "use_cookies"=>0]);
		}


		//$token = explode('|', $tokenraw);


		return $tokenid;
	}

	public static function createtoken($session_id, $userid, $userfullname) {
		$length = self::KEY_LENGTH;

		$enckey = self::generateKey($length);
		$tokenraw = "$session_id|$userid|$userfullname";

		$enc = new Encryption();
		$tokenid = $enc->encrypt($tokenraw, $enckey) . $enckey;

		return $tokenid;
	}

}