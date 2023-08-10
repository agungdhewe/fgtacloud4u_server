<?php namespace FGTA4;
define('FGTA4', 1);

define('__ROOT_DIR', realpath(dirname(__FILE__).'/..'));
define('__BASEADDRESS', $_SERVER['REQUEST_SCHEME'] ."://".  $_SERVER['SERVER_NAME'] . rtrim($_SERVER['SCRIPT_NAME'], '/index.php') .'/');
define('__PROTOCOL__', stripos($_SERVER['SERVER_PROTOCOL'],'https') === 0 ? 'https://' : 'http://');

define('__API_LOGIN_URL', 'fgta/framework/login/dologin');


if (!defined('__CONFIG_PATH')) {
	define('__CONFIG_PATH', __ROOT_DIR . '/public/config.php');
}

if (!defined('__CLIENT_PUBLIC_PATH')) {
	define('__CLIENT_PUBLIC_PATH', __ROOT_DIR . '/public');
}

if (!defined('WEB_GENERAL_ERROR')) {
	define('WEB_GENERAL_ERROR', 500);
}



ob_start();

require_once __ROOT_DIR . '/core/setting.php';
require_once __ROOT_DIR . '/core/dbsetting.php';

require_once __CONFIG_PATH;




if (!defined('__APPNAME')) {
	define('__APPNAME', 'fgta');
	define('__MANIFESTNAME', 'manifest.json');
	define('__FAVICON', 'favicon.ico');
	define('__ICON32', 'fgtacloudicon.png');
	define('__APPDISPLAYNAME', 'FGTA Dev');
} else {
	define('__MANIFESTNAME', 'manifest-' . __APPNAME . '.json');
	define('__FAVICON', 'favicon-' . __APPNAME . '.ico');
	define('__ICON32', __APPNAME.'icon.png');
	define('__APPDISPLAYNAME', __APPNAME);
}

if (!defined('__APPTITLE')) {
	define('__APPTITLE', 'FGTA Development');
}

if (!defined('__LOCALCLIENT_DIR')) {
	define('__LOCALCLIENT_DIR', realpath(dirname($_SERVER["SCRIPT_FILENAME"])));
} 

if (!defined('__STARTMODULE')) {
	define('__STARTMODULE', 'fgta/framework/container');	
}

if (!defined('__MENUDEF')) {
	define('__MENUDEF', 'modules-fgta');	
}

if (!defined('__FGTA_LOGIN')) {
	define('__FGTA_LOGIN', 'fgta/framework/login');
}

if (!defined('__LOCALDB_DIR')) {
	define('__LOCALDB_DIR', __ROOT_DIR . '/core/database');	
}

if (!defined('__OBFUSCATED_DIR')) {
	define('__OBFUSCATED_DIR', __ROOT_DIR . '/core/database/obfuscated');
}

if (!defined('__DISABLE_PHPINFO')) {
	define('__DISABLE_PHPINFO', false);
}

if (!defined('__DISABLE_APIINFO')) {
	define('__DISABLE_APIINFO', false);
}


if (!defined('__COMPANY_NAME__')) {
	define('__COMPANY_NAME__', 'FGTA');
}

if (!defined('__TEMP_DIR')) {
	define('__TEMP_DIR', '/mnt/ramdisk');
}

if (!defined('__MODULE_RELOAD_BUTTON')) {
	define('__MODULE_RELOAD_BUTTON', false);
}


require_once __ROOT_DIR.'/core/webauth.php';
require_once __ROOT_DIR.'/core/webmoduleconfig.php';
require_once __ROOT_DIR.'/core/errorpage.php';
require_once __ROOT_DIR.'/core/routes/route.php';
require_once __ROOT_DIR.'/core/vendor/autoload.php';


use \FGTA4\setting;
use \FGTA4\routes\Route;


(new class {

	private static $ROUTER = null;


	public static function main() : void {
		$GLOBALS['ERR_HANDLER'] = null;

		try {
		
			setting::init();
			setting::$BaseTitle = __APPTITLE;
		

			$reqinfo = self::getRequestInfoFromUrlParameter();
		
			$usesession = false;
			$isapps = true;

			try {

				$routeswitch = $reqinfo->route;
				$avaiableroute = Route::getAvailable();
				if (array_key_exists($routeswitch, $avaiableroute)) {
					$routeinfo = $avaiableroute[$routeswitch];
					require_once $routeinfo['path']; 
					if (!class_exists($routeinfo['class'])) {
						throw new \Exception("router class '".$routeinfo['class']."' tidak ditemukan.");
					}
					self::$ROUTER = new $routeinfo['class']();
				} else {
					// routing tidak ada
					throw new \Exception("router '$routeswitch' tidak ditemukan.");
				}

				self::$ROUTER->ProcessRequest($reqinfo);
				$content = ob_get_contents();
				ob_end_clean();
				
				self::$ROUTER->setContentOutput($content);
				self::$ROUTER->SendHeader();
				self::$ROUTER->ShowResult();
		
			} catch (\Exception $ex) {
				throw $ex;
			}

		} catch (\Exception $ex) {
			self::handleError($ex);
		} 
	}


	static function pathNormalize(string $path) : string {
		if (substr($path, 0, 1) === '/') {
			$path = substr_replace($path, "", 0, 1);
		}

		if (substr($path, -1) === '/') {
			$path = substr_replace($path, "", -1);
		}

		return $path;
	}

	static function getRequestInfoFromUrlParameter() : object {
		try {
			$requesturi = self::pathNormalize($_SERVER['REQUEST_URI']);
			$server_internal_script_dir = self::pathNormalize(preg_replace('/index.php/', '', $_SERVER['SCRIPT_NAME'], 1)); 
			if (array_key_exists('HTTP_X_FORWARDED_HOST', $_SERVER)) {
				$server_proto = $_SERVER['HTTP_X_FORWARDED_PROTO'];
				$server_host = $_SERVER['HTTP_X_FORWARDED_HOST']; 
				if (array_key_exists('HTTP_X_FORWARDED_DIRECTORY', $_SERVER)) {
					$server_script_dir = self::pathNormalize(preg_replace("/$server_internal_script_dir/", '', $_SERVER['HTTP_X_FORWARDED_DIRECTORY'], 1));
					$request_prefix = self::pathNormalize($_SERVER['HTTP_X_FORWARDED_DIRECTORY']);
				} else {
					$server_script_dir = $server_internal_script_dir;
					$request_prefix = "";
				}
			} else {
				// url di internal server
				$url =  __PROTOCOL__ .  $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
				$server_proto = $_SERVER['REQUEST_SCHEME'];
				$server_host = $_SERVER['HTTP_HOST'];
				$server_script_dir = $server_internal_script_dir;
				$request_prefix = "";
			}


			$pathinfo = array_key_exists('PATH_INFO', $_SERVER) ? self::pathNormalize($_SERVER['PATH_INFO']) : "";
			if ($pathinfo=="") {
				$pathinfo = "module/" . __STARTMODULE;
			}
			
			
			
			$server_http_address = "$server_proto://$server_host";
			$server_script_base =  self::pathNormalize("$server_http_address/$server_script_dir");
			$server_script = "$server_script_base/index.php";
			$server_requestline = self::pathNormalize("$server_script/$pathinfo");
			$cookiepath = "/$server_script_dir";
			
			$scriptparam = "";
			$modulefullname = '';
			$reqs = explode('/', $pathinfo);
			if (count($reqs) == 1) {
				if ($pathinfo=='info') {
					if (!__DISABLE_PHPINFO) {
						phpinfo();
					}
					die('FGTA Server');
				} else {
					throw new \Exception('Request Parameter URL Salah. (route/package/apps/module)');
				}
			} else if (count($reqs)>1) {
				$r = [];
				$route = $reqs[0];
				if (in_array($route, ['public', 'profilepicture', 'jslibs', 'cfs'])) {
					$package = "";
					$apps = "";
					$module = "";
					$r = [$route];
				} else if (count($reqs) < 4) {
					throw new \Exception('Request Parameter URL Salah. (route/package/apps/module)');
				} else {
					$package = $reqs[1];
					$apps = $reqs[2];
					$module = $reqs[3];
					$r = [$route, $package, $apps, $module];
					$modulefullname = implode('/', [$package, $apps, $module]);
				}

				$scriptmodule = "$server_script/" . implode("/", $r);
				$scriptparam = substr_replace($pathinfo, "", 0, strlen(implode("/", $r)));
				if (substr($scriptparam, 0, 1) === '/') {
					$scriptparam = substr_replace($scriptparam, "", 0, 1);
				}
			}	

			// $server_request <= $server_requestline dikurangi $scriptparam dari kanan
			if ($scriptparam=="") {
				$server_request = $server_requestline;
			} else {
				$server_request = self::pathNormalize(substr($server_requestline, 0, -strlen($scriptparam)));
			}
			
			
			$params = (object)[
				'pathinfo' => $pathinfo,
				'server_http_address' => $server_http_address,
				'server_script_base' => $server_script_base,
				'server_script' => $server_script,
				'server_requestline' => $server_requestline,
				'server_request' => $server_request,
				'scriptparam' => $scriptparam,
				'cookiepath' => $cookiepath,
				'variancename' => array_key_exists('variancename', $_GET) ? $_GET['variancename'] : ''
			];

			return (object)[
				'route' => $route,
				'package' => $package,
				'apps' => $apps,
				'module' => $module,
				'modulefullname' => $modulefullname,
				'params' => (object)$params
			];
		} catch (\Exception $ex) {
			throw $ex;
		}	
	}

	static function handleError($ex) {
		try {
			$ShowDefaultError = false;
			if (is_object(self::$ROUTER)) {
				if (method_exists(self::$ROUTER, 'ShowError')) {
					self::$ROUTER->ShowError($ex);
				} else {
					$ShowDefaultError = true;
				}
			} else {
				$ShowDefaultError = true;
			}

			if ($ShowDefaultError) {
				header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
				$content = ob_get_contents();
				ob_end_clean();

				$err = new ErrorPage('Internal Server Error');
				$err->titlestyle = 'color:red; margin-top: 0px';
				$err->content = $content;
				$err->Show($ex->getMessage());
			}
		} catch (\Exception $ex) {
			die($ex->getMessage());
		}	
	}

})::main();




