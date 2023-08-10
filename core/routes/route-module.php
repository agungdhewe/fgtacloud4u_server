<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/webauth.php';
require_once __ROOT_DIR.'/core/webmodule.php';
require_once __ROOT_DIR.'/core/websession.php';



use \FGTA4\debug;
use \FGTA4\setting;
use \FGTA4\WebSession;
use \FGTA4\WebAuth;


class ModuleRoute extends Route {

	private static ?object $reqinfo;


	private ?object $auth = null;

	function __construct() {
		parent::__construct();
		$this->_isapps = true;
	}

	/**
	 * 
	 * 
	 * format request
	 * index.php/module/package/apps/module/param1/param2/param3/param(n)/   .....
	 * ......      /~dir/to/phtml/path?variancename=xxx&var1=aaa&var2=bbb
	 */
	public function ProcessRequest(object $reqinfo) : void {

		$MODULE = null;
		
		self::$reqinfo = $reqinfo;

		if (defined('__TEMPLATE')) {
			setting::useTemplate(__TEMPLATE);
		}

		if (defined('__TEMPLATE_MAIN_HTML')) {
			setting::setTemplateFile(__TEMPLATE_MAIN_HTML);
		} else {
			setting::setTemplateFile('appstemplate.phtml');
		}


		try {

			//$this->PrepareRequestModule($reqinfo);

			$modulename = $reqinfo->module;
			$modulefullname = $reqinfo->modulefullname;

			$module_dir = implode('/', [__ROOT_DIR , 'apps', $modulefullname]); 
			$module_path_json = implode('/', [$module_dir, $reqinfo->module . '.json']);
			$module_path_php = implode('/', [$module_dir, $reqinfo->module . '.php']);
			$module_path_phtml =  implode('/', [$module_dir, $reqinfo->module . '.phtml']);
			$module_path_css =  implode('/', [$module_dir, $reqinfo->module . '.css']);
			$module_path_mjs =  implode('/', [$module_dir, $reqinfo->module . '.mjs']);
			$module_path_notes =  implode('/', [$module_dir, $reqinfo->module . '.notes.txt']);
			$module_url_css = !is_file($module_path_css) ? '' : "index.php/asset/$modulefullname/$modulename.css" ;
			$module_url_mjs = !is_file($module_path_mjs) ? '' : "./index.php/asset/$modulefullname/$modulename.mjs" ;
			$variancename = property_exists($reqinfo->params, 'variancename') ? $reqinfo->params->variancename : "";


			// cek akses module : halaman	
			if (property_exists($reqinfo->params, 'scriptparam')) {
				$scriptparam = $reqinfo->params->scriptparam;
				if (\str_starts_with($scriptparam, '~')) {
					$arr_params = explode('/', $scriptparam);
					$page = substr_replace($arr_params[0], "", 0, 1);
					$module_path_phtml =  implode('/', [$module_dir, $page . '.phtml']);
				}
			}

			if (!is_dir($module_dir)) {
				throw new \FGTA4\exceptions\WebException(
					"module '$modulefullname' tidak ditemukan.", 
					WEB_GENERAL_ERROR
				);		
			}

			if (!is_file($module_path_json)) {
				throw new \FGTA4\exceptions\WebException(
					"$modulename.json tidak ditemukan di '$modulefullname'.", 
					WEB_GENERAL_ERROR
				);		
			}

			$configuration = $this->ReadConfiguration($module_path_json);
			

			/* start session */
			if (array_key_exists('tokenid', $_COOKIE)) {
				$tokenid = $_COOKIE['tokenid'];
				WebSession::start($tokenid);
			} else {
				$tokenid = WebSession::start();
				setcookie('tokenid', $tokenid, null, $reqinfo->params->cookiepath);
			}


			$title = $configuration->title;		
			$authmodel = $this->getAuthenticationModel($configuration);
			if (!$authmodel->allowanonymous) {
				$this->auth = new WebAuth();
				//$this->auth->SessionCheck();
				if (!$this->auth->is_login()) {
					$this->redirect(__FGTA_LOGIN);
					die();
				} else {
					$x = 'sudah login';
				}
			} else {
				if ($configuration->isloginpage) {
					$this->auth = new WebAuth();
					if ($this->auth->is_login()) {
						$this->redirect(__STARTMODULE);
					}
				} 
			}

			

			if (is_file($module_path_php)) {
				// menggunakan controller yg dibuat di direktori module
				require_once $module_path_php;
				if (!is_object($MODULE)) {
					throw new \FGTA4\exceptions\WebException(
						"Object MODULE belum terdefinisi dengan benar!", 
						WEB_GENERAL_ERROR
					);		
				}

				if (!($MODULE instanceof \FGTA4\module\WebModule)) {
					throw new \FGTA4\exceptions\WebException(
						"Object MODULE harus inherit dari WebModule!", 
						WEB_GENERAL_ERROR
					);		
				}
			} else {
				// menggunakan controller default
				$MODULE = new \FGTA4\module\WebModule();
				$MODULE->LoadPage = function() { 
					return; 
				};
			}

			// if (!is_file($module_path_phtml)) {
			// 	throw new \FGTA4\exceptions\WebException(
			// 		"Module '$module_path_phtml' tidak ditemukan!", 
			// 		WEB_GENERAL_ERROR
			// 	);
			// }

			

			$reqinfo->module_path_phtml = $module_path_phtml;
			$reqinfo->module_path_css = $module_path_css;
			$reqinfo->module_path_mjs = $module_path_mjs;
			$reqinfo->module_url_css = $module_url_css ;
			$reqinfo->module_url_mjs = $module_url_mjs;
			$reqinfo->variancename = $variancename;

			$MODULE->configuration = $configuration;
			$MODULE->reqinfo = $reqinfo;
			$MODULE->title = $title;
			$MODULE->urlparams = $reqinfo->params;
			$MODULE->author = property_exists($configuration, 'author') ? 
									$configuration->author : 
									'<i>This program is generated by <b>FGTA4 Generator</b>. For more info please visit https://www.fgta.net</i>';
			
			
			$filecekdate = $module_path_notes; 
			if (!is_file($module_path_notes)) {
				$filecekdate = $module_path_json; 
			}
			$MODULE->createdate = date ("Y-m-d H:i:s.", filemtime($filecekdate));

			if ($this->auth!=null) {
				$MODULE->auth = $this->auth;
			}
			


			// read variance
			$variancedata = $this->ReadVarianceData($variancename, $MODULE->configuration);
			if ($variancedata) {
				if (property_exists($variancedata, 'title')) {
					$MODULE->title = $variancedata->title;
				}
			}

			$MODULE->LoadPage();


			if (!is_file($MODULE->reqinfo->module_path_phtml)) {
				throw new \FGTA4\exceptions\WebException(
					"Module '$module_path_phtml' tidak ditemukan!", 
					WEB_GENERAL_ERROR
				);
			}

			$this->MODULE = $MODULE;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	public function SendHeader() : void {
		\header('Content-Type: text/html');
	}

	public function ShowResult() : void {
		$content = $this->content;
		$this->MODULE->Render($content,  setting::getTemplate());
	}


	public function ShowError(object $ex) : void {
		$content = ob_get_contents();
		ob_end_clean();

		if (!property_exists($ex, 'errorstatusmessage')) {
			$ex->errorstatusmessage = $ex->getMessage();
			$ex->errorstatus = 500;
		}

		$err = new \FGTA4\ErrorPage($ex->errorstatusmessage, $ex->errorstatus);
		$err->content = $content;
		$err->Show($ex->getMessage());		
	}

	public function getAuthenticationModel(object $configuration) : object {
		$allowanonymous = false;
		$allowedgroups = ['public'];

		try {
			if (property_exists($configuration, 'allowanonymous')) {
				$allowanonymous = $configuration->allowanonymous;
			}

			if (property_exists($configuration, 'allowedgroups')) {
				$allowedgroups = $configuration->allowedgroups;
			}

			return (object)[
				'allowanonymous' => $allowanonymous,
				'allowedgroups' => $allowedgroups
			];
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	public function redirect($module) : void {
		$baseaddress = self::$reqinfo->params->server_script_base;
		echo "<!DOCTYPE html>
		<head>
			<title>login</title>
			<base href=\"$baseaddress/\">
		</head>	
		<body>
			redirect module to $module
		</body>
		<script>
			location.href='index.php/module/$module';
			</script>
		</html>";	
		die();
	}


	/*
	public function __ProcessRequest($reqinfo) {
		$MODULE = null;
		$reqinfo->modulecontrollerpath = $reqinfo->modulerequestinfo == '' ? "$reqinfo->moduledir/$reqinfo->modulename.php" : "$reqinfo->moduledir/$reqinfo->modulerequestinfo.php";
		$reqinfo->moduleviewpath = $reqinfo->modulerequestinfo == '' ? "$reqinfo->moduledir/$reqinfo->modulename.phtml" : "$reqinfo->moduledir/$reqinfo->modulerequestinfo.phtml";
		$reqinfo->modulejspath = $reqinfo->modulerequestinfo == '' ? "$reqinfo->moduledir/$reqinfo->modulename.mjs" : "$reqinfo->moduledir/$reqinfo->modulerequestinfo.mjs";
		$reqinfo->modulejsurl = $reqinfo->modulerequestinfo == '' ? "./index.php/asset/$reqinfo->modulefullname/$reqinfo->modulename.mjs" : "./index.php/asset/$reqinfo->modulefullname/$reqinfo->modulerequestinfo.mjs";
		$reqinfo->modulecsspath = $reqinfo->modulerequestinfo == '' ? "$reqinfo->moduledir/$reqinfo->modulename.css" : "$reqinfo->moduledir/$reqinfo->modulerequestinfo.css";
		$reqinfo->modulecssurl = $reqinfo->modulerequestinfo == '' ? "./index.php/asset/$reqinfo->modulefullname/$reqinfo->modulename.css" : "./index.php/asset/$reqinfo->modulefullname/$reqinfo->modulerequestinfo.css";


		if ($reqinfo->moduleconfig->main && $reqinfo->modulerequestinfo == '') {
			$mainmodule = $reqinfo->moduleconfig->main;
			$reqinfo->modulecontrollerpath = "$reqinfo->moduledir/$mainmodule.php";
			$reqinfo->moduleviewpath = "$reqinfo->moduledir/$mainmodule.phtml";
			$reqinfo->modulejspath = "$reqinfo->moduledir/$mainmodule.mjs";
			$reqinfo->modulejsurl = "./index.php/asset/$reqinfo->modulefullname/$mainmodule.mjs";
			$reqinfo->modulecsspath = "$reqinfo->moduledir/$mainmodule.css";
			$reqinfo->modulecssurl = "./index.php/asset/$reqinfo->modulefullname/$mainmodule.css";
	
		}

		
		if (array_key_exists('variancename', $_GET)) {
			$reqinfo->variancename = $_GET['variancename'];
			if (property_exists($reqinfo->moduleconfig, 'variance')) {
				if (property_exists($reqinfo->moduleconfig->variance, $reqinfo->variancename)) {
					$variancedata = $reqinfo->moduleconfig->variance->{$reqinfo->variancename};
					if (property_exists($variancedata, 'title')) {
						$reqinfo->moduleconfig->title = $variancedata->title;
					}
					if (property_exists($variancedata, 'allowedgroups')) {
						$reqinfo->moduleconfig->allowedgroups = $variancedata->allowedgroups;
					}					
				}
			}


		} else {
			$reqinfo->variancename = '';
		}

		$this->reqinfo = $reqinfo;

		if (!$reqinfo->moduleconfig->allowanonymous) {
			if (!$this->auth->is_login()) {
				$reqinfo->moduledir = __ROOT_DIR . "/apps/" . __FGTA_LOGIN;
				$reqinfo->modulecontrollerpath = "$reqinfo->moduledir/login.php";
				$reqinfo->moduleviewpath = "$reqinfo->moduledir/login.phtml";
				$reqinfo->modulejspath = "$reqinfo->moduledir/login.mjs";
				$reqinfo->modulejsurl = "./index.php/asset/". __FGTA_LOGIN ."/login.mjs";
			} else {
				// check apakah group yang dimiliki diperolehkan
				$allowed = false;
				foreach ($this->auth->get_groups() as $groupname) {
					if (in_array($groupname, $reqinfo->moduleconfig->allowedgroups)) {
						$allowed = true;
					}
				}
				if (!$allowed) { throw new \FGTA4\exceptions\WebException("Group yang anda miliki tidak diperbolehkan untuk mengakses ".$reqinfo->moduleconfig->title, 401);	 }
			}
		}


		$ile_lastmodified = "";
		if (!is_file($reqinfo->modulecontrollerpath)) {
			$MODULE = new \FGTA4\module\WebModule();
			$MODULE->LoadPage = function() { 
				return; 
			};
		} else {
			require_once $reqinfo->modulecontrollerpath;
			// $ile_lastmodified = date ("d/m/Y Y H:i:s.", filemtime($reqinfo->modulecontrollerpath));
			
			if (!is_object($MODULE)) {
				throw new \FGTA4\exceptions\WebException("Object MODULE belum terdefinisi dengan benar!", 500);		
			}

			if (!method_exists($MODULE, 'LoadPage')) {
				throw new \FGTA4\exceptions\WebException("Method 'LoadPage' pada MODULE '$reqinfo->modulecontrollerpath' tidak ditemukan", 500);
			}				
		}

		if (!is_file($reqinfo->moduleviewpath)) {
			throw new \FGTA4\exceptions\WebException("Module '$reqinfo->moduleviewpath' tidak ditemukan!", 500);
		}


		if (!method_exists($MODULE, 'Render')) {
			throw new \FGTA4\exceptions\WebException("Method 'Render' pada MODULE '$reqinfo->modulecontrollerpath' tidak ditemukan", 500);		
		}

		$this->MODULE = $MODULE;
		$this->MODULE->reqinfo = $reqinfo;
		$this->MODULE->title = $reqinfo->moduleconfig->title;
		$this->MODULE->author = \property_exists($this->MODULE->reqinfo->moduleconfig, 'author') ? $this->MODULE->reqinfo->moduleconfig : '<i>This program is generated by <b>FGTA4 Generator</b>. For more info please visit https://www.fgta.net</i>';
		
		
		$cekfile = dirname($reqinfo->modulecontrollerpath) .'/'. $reqinfo->modulename . '.phtml';
		if (is_file($cekfile)) {
			$this->MODULE->createdate = date('Y-m-d H:i:s', filemtime($cekfile));
		} else {
			$this->MODULE->createdate = '';
		}

		$this->MODULE->auth = $this->auth;
		$this->MODULE->LoadPage();
		
	}

	public function __ShowResult($content) {
		$this->MODULE->Render($content,  setting::$TemplateDir . '/appstemplate.phtml');
	}
	*/


}

