<?php

require_once __ROOT_DIR.'/core/webapi.php';	
require_once __ROOT_DIR.'/core/webauth.php';	


class SCENARIO {
	public static $id;
	public static $username;
	public static $param;

	public static function Run() {
		require __DIR__ . '/../apis/xsvc-mailercheck.php';

		SCENARIO::$username = 'system';

		$API->useotp = false;
		$API->reqinfo = (object)[ 'modulefullname' => 'fgta/framework/msg' ];
		$API->auth = new class {
			public function session_get_user() {
				return (object) [
					'username' => SCENARIO::$username
				];
			}			
		};
		$result = $API->execute();

	}
}


console::class(new class($args) extends clibase {
	function execute() {
		SCENARIO::Run();
	}
});
