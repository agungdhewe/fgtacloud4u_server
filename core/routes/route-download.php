<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/webauth.php';
require_once __ROOT_DIR.'/core/webapi.php';
require_once __ROOT_DIR.'/core/websession.php';

use \FGTA4\WebAuth;
use \FGTA4\WebSession;


class DownloadRoute extends Route {

	public $debugoutput = false;


	private $skipnonce = true;

	public function ProcessRequest(object $reqinfo) : void {
		$this->reqinfo = $reqinfo;

		try {
			//$this->PrepareRequestModule($reqinfo);

			$modulename = $reqinfo->module;
			$modulefullname = $reqinfo->modulefullname;
			$api = $reqinfo->params->scriptparam;

			$module_dir = implode('/', [__ROOT_DIR , 'apps', $modulefullname]); 
			$module_path_json = implode('/', [$module_dir, $reqinfo->module . '.json']);
			$module_path_api =  implode('/', [$module_dir, 'apis', $api . '.php']);

			if (!is_dir($module_dir)) {
				throw new \FGTA4\exceptions\WebException(
					"module '$modulefullname' tidak ditemukan.", 
					API_ERROR_RESOURCE_NOTFOUND
				);		
			}

			if (!is_file($module_path_json)) {
				throw new \FGTA4\exceptions\WebException(
					"$modulename.json tidak ditemukan di '$modulefullname'.", 
					API_ERROR_RESOURCE_NOTFOUND
				);		
			}

			$configuration = $this->ReadConfiguration($module_path_json);
			$authmodel = $this->getAuthenticationModel($configuration, $api);


			$okenid = "";
			if (array_key_exists('tokenid', $_COOKIE)) {
				$tokenid = $_COOKIE['tokenid'];
			} else if (array_key_exists('HTTP_FGTA_TOKENID', $_SERVER)) {
				$tokenid = $_SERVER['HTTP_FGTA_TOKENID'];
			} else {
				throw new \FGTA4\exceptions\WebException(
					"token error!", 
					API_ERROR_GENERAL
				);	
			}

			WebSession::start($tokenid);


			if (!$authmodel->allowanonymous) {
				$this->auth = new WebAuth();
				//$this->auth->SessionCheck();
				if (!$this->auth->is_login()) {
					$x = 'belum login';
					throw new \FGTA4\exceptions\WebException(
						"Unauthorized API Call. Belum login / session expired !", 
						403
					);

				} else {
					$x = 'sudah login';
				}
			} 

			if (!is_file($module_path_api)) {
				throw new \FGTA4\exceptions\WebException(
					"api '$api' tidak ditemukan di '$modulefullname'.", 
					API_ERROR_RESOURCE_NOTFOUND
				);		
			}

			$API = null;
			require_once $module_path_api;
			if (!is_object($API)) {
				throw new \FGTA4\exceptions\WebException(
					"Object API belum terdefinisi dengan benar!", 
					API_ERROR_GENERAL
				);		
			}

			if (!($API instanceof \FGTA4\apis\WebAPI)) {
				throw new \FGTA4\exceptions\WebException(
					"Object API harus inherit dari WebAPI!", 
					API_ERROR_GENERAL
				);		
			}

			if (!method_exists($API, 'download')) {
				throw new \FGTA4\exceptions\WebException(
					"metode download tidak ditemukan pada API", 
					API_ERROR_GENERAL
				);	
			}


			$API->configuration = $configuration;
			$this->postdata = $this->getPostData();

			$this->api_class = get_class($API);
			$this->api_method = new \ReflectionMethod($this->api_class, 'download');
			$this->api_params = $this->api_method->getParameters();
			$this->api_executingparameters = [];

			if (!property_exists($API, 'method')) {
				$API->method = 'POST';
			} 

			if ($API->method != $_SERVER['REQUEST_METHOD']) {
				throw new \FGTA4\exceptions\WebException(
					"Eksekusi API tidak bisa menggunakan '" . $_SERVER['REQUEST_METHOD'] . "'", 
					API_ERROR_PARAMETER
				);
			}


			if ($_SERVER['REQUEST_METHOD']=='POST') {
				foreach ($this->api_params as $param) {
					$paramname = $param->getName();
					if (property_exists($this->postdata->requestParam, $paramname)) {
						$this->api_executingparameters[$paramname] = $this->postdata->requestParam->$paramname;
					} else {
						$this->api_executingparameters[$paramname] = null;
					}
				}
			} if ($_SERVER['REQUEST_METHOD']=='GET') {
				foreach ($this->api_params as $param) {
					$paramname = $param->getName();
					if (array_key_exists($paramname, $_GET)) {
						$this->api_executingparameters[$paramname] = $_GET[$paramname];
					} else {
						$this->api_executingparameters[$paramname] = null;
					}
				}
			} 



			if (!$this->skipnonce) {

				// Cek Nonce
				if (!array_key_exists('nonces', $_SESSION)) {
					throw new \Exception (
						'Session Expired',
						WEB_GENERAL_ERROR
					);
				}

				$nonce = $_SERVER['HTTP_FGTA_NONCE'];
				if (!array_key_exists('nonces', $_SESSION)) {
					throw new \Exception('Session expired. Nonce Error');
				}			
	
				if (!array_key_exists($nonce, $_SESSION['nonces'])) {
					throw new \Exception('Session invalid. Nonce Error');
				}
				unset ($_SESSION['nonces'][$nonce]);

			}


			// Exekusi API
			$API->auth = $this->auth;
			$API->reqinfo = $reqinfo;

			$result = $this->api_method->invokeArgs($API, $this->api_executingparameters);

			$this->result = $result;
			$this->API = $API;



		} catch (\Exception $ex) {
			throw $ex;
		}

	}

	public function SendHeader() : void {
		if (is_object($this->API)) {
			if (method_exists($this->API, 'SendHeader')) {
				$this->API->SendHeader;
			}
		}
	}

	public function ShowResult() : void {
		if ($this->result!=null) {
			echo $this->result;
		}
	}

	public function ShowError(object $ex) : void {
		$content = $this->content;
		echo $ex->getMessage();
		echo ". " . $content;
	}


	public function getPostData() : object {
		try {

			if ($_SERVER['REQUEST_METHOD']!='POST') {
				return (object) [
					'txid' => null,
					'requestParam' => []
				];
			}

			$content = 	file_get_contents('php://input');
			$postdata = json_decode(stripslashes($content));
			if ($postdata === null && json_last_error() !== JSON_ERROR_NONE) {
				throw new \Exception('Format request body JSON salah', 9001);
			}

			// if (!array_key_exists('txid', $postdata)) {
			if (!property_exists($postdata, 'txid')) {	
				throw new \Exception('txid belum didefinisiakn di request body', 9002);
			}

			// if (!array_key_exists('requestParam', $postdata)) {
			if (!property_exists($postdata, 'requestParam')) {		
				throw new \Exception('requestParam belum didefinisikan di request body', 9003);
			}


			return (object) [
				'txid' => $postdata->txid,
				'requestParam' => $postdata->requestParam
			];
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	public function getAuthenticationModel(object $configuration, string $api) : object {
		$allowanonymous = false;
		$allowedgroups = ['public'];

		try {

			if (property_exists($configuration, 'apis')) {
				if (property_exists($configuration->apis, $api)) {
					if (property_exists($configuration->apis->$api, 'allowanonymous')) {
						$allowanonymous = $configuration->apis->$api->allowanonymous;
					}
					if (property_exists($configuration->apis->$api, 'allowedgroups')) {
						$allowedgroups = $configuration->apis->$api->allowedgroups;
					}
				}
			}

			return (object)[
				'allowanonymous' => $allowanonymous,
				'allowedgroups' => $allowedgroups
			];
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


}

$ROUTER = new DownloadRoute();