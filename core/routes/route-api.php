<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/webauth.php';
require_once __ROOT_DIR.'/core/webapi.php';
require_once __ROOT_DIR.'/core/websession.php';


use \FGTA4\debug;
use \FGTA4\WebAuth;
use \FGTA4\WebSession;


/**
 * Class untuk memproses request-request dari browser via POST
 * dan megembalikan hasil berupa JSON.
 * class ini digunakan untuk keperluan ajax dari browser.
 * 
 * @category Routing
 * @author Panji Tengkorak <panjitengkorak@null.net>
 * @copyright 2020 Panji Tengkorak
 * @license https://opensource.org/licenses/BSD-3-Clause BSD
 * @link https://www.fgta.net
 * 
 */
class ApiRoute extends Route {

	private mixed $result;
	private object $reqinfo;
	private ?object $auth = null;
	private ?object $responseData = null;
	private ?object $postdata = null;

	function __construct() {
		parent::__construct();
	}

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
			
			$tokenid = $_SERVER['HTTP_FGTA_TOKENID'];
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

			if (!method_exists($API, 'execute')) {
				throw new \FGTA4\exceptions\WebException(
					"metode execute tidak ditemukan pada API", 
					API_ERROR_GENERAL
				);	
			}


			$API->configuration = $configuration;
			$this->postdata = $this->getPostData();

			$this->api_class = get_class($API);
			$this->api_method = new \ReflectionMethod($this->api_class, 'execute');
			$this->api_params = $this->api_method->getParameters();
			$this->api_executingparameters = [];

			foreach ($this->api_params as $param) {
				$paramname = $param->getName();
				
				if (property_exists($this->postdata->requestParam, $paramname)) {
					$this->api_executingparameters[$paramname] = $this->postdata->requestParam->$paramname;
				} else {
					$this->api_executingparameters[$paramname] = null;
					if ($_SERVER['REQUEST_METHOD']=='POST') {
						throw new \FGTA4\exceptions\WebException(
							"Eksekusi API membutuhkan POST parameter '$paramname' !", 
							API_ERROR_PARAMETER
						);
					}
				}
			}

			if ($_SERVER['REQUEST_METHOD']=='GET') {
				$this->configuration = $configuration;
				$this->authmodel = $authmodel;
				return;
			}

			if ($_SERVER['REQUEST_METHOD']!='POST') {
				throw new \FGTA4\exceptions\WebException("API hanya bisa diakses via POST!", 405);
			}

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
		if ($_SERVER['REQUEST_METHOD']=='GET') {
			\header('Content-Type: text/html');
		} else {
			\header('Content-Type: application/json');
		}
	}

	public function ShowResult() : void {
		$content = $this->content;

		try {
			if ($_SERVER['REQUEST_METHOD']=='GET') {
				$this->ShowApiInformation();
				return;
			}

			$output = $this->safe_json_encode([
				"code" => 0,
				"message" => "success",
				"txid" => $this->postdata->txid,
				"responseData" => $this->result,
				"contentoutput" => $content
			]);


			echo $output;
		} catch (\Exception $ex) {
			throw $ex;
		}	

	}

	public function ShowError(object $ex) : void {
		$content = $this->content;
		// if (!empty($content)) {
		// 	$content = "<pre>$content</pre>";
		// }

		$txid = null;
		if ($this->postdata != null ) {
			$txid = property_exists($this->postdata, 'txid') ? $this->postdata->txid : null;
		}
		
		$code = $ex->getCode();
	
		$outputdata = [
			"code" => $code==0 ? API_ERROR_GENERAL : $code,
			"message" => $ex->getMessage(),
			"trace" => $ex->getTraceAsString(),
			"txid" => $txid,
			"responseData" => $this->responseData,
			"contentoutput" => $content			
		];

		$contentoutput = ob_get_contents();
		ob_end_clean();
		ob_start();

		$outputdata['contentoutput'] = $contentoutput . "<br><br>" . $outputdata['contentoutput'];
		$output = json_encode($outputdata);
		echo $output ;
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
			// $postdata = json_decode(stripslashes($content));
			$postdata = json_decode($content);
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


	public function ShowApiInformation() {
		if (!__DISABLE_PHPINFO) {
			$modulefullname = $this->reqinfo->modulefullname;
			$api = $this->reqinfo->params->url_requestparam;

			echo "
				<style>
					.col-name { width:60px}
					.col-value { width: calc(100%-60px) }
				</style>
				<h1>FGTA API</h1>
				<h2>$modulefullname/$api</h2>
			
				<h3>Header</h3>
				<table width=\"100%\">
					<tr>
						<td class=\"col-name\">fgta_token</td>
						<td class=\"col-value\"></td>
					</tr>
					<tr>
						<td class=\"col-name\">fgta_appid</td>
						<td class=\"col-value\"></td>
					</tr>
					<tr>
						<td class=\"col-name\">fgta_secret</td>
						<td class=\"col-value\"></td>
					</tr>					
					<tr>
						<td class=\"col-name\">fgta_otp</td>
						<td class=\"col-value\"></td>
					</tr>					
				</table>

				<h3>Request Body</h3>
				<table width=\"100%\">
					<tr>
						<td class=\"col-name\">txid</td>
						<td class=\"col-value\"></td>
					</tr>
					<tr>
						<td class=\"col-name\">requestParam</td>
						<td class=\"col-value\"></td>
					</tr>
				</table>
				
				<h3>Result</h3>
				<table width=\"100%\">
					<tr>
						<td class=\"col-name\">code</td>
						<td class=\"col-value\"></td>
					</tr>
					<tr>
						<td class=\"col-name\">message</td>
						<td class=\"col-value\"></td>
					</tr>				
					<tr>
						<td class=\"col-name\">txid</td>
						<td class=\"col-value\"></td>
					</tr>
					<tr>
						<td class=\"col-name\">responseData</td>
						<td class=\"col-value\"></td>
					</tr>
				</table>					
			";

		} else {
			die('FGTA Server API');
		}
	}

	function safe_json_encode($value, $options = 0, $depth = 512, $utfErrorFlag = false) {
		$encoded = \json_encode($value, $options, $depth);
		switch (\json_last_error()) {
			case JSON_ERROR_NONE:
				return $encoded;
			case JSON_ERROR_DEPTH:
				return 'Maximum stack depth exceeded'; // or trigger_error() or throw new Exception()
			case JSON_ERROR_STATE_MISMATCH:
				return 'Underflow or the modes mismatch'; // or trigger_error() or throw new Exception()
			case JSON_ERROR_CTRL_CHAR:
				return 'Unexpected control character found';
			case JSON_ERROR_SYNTAX:
				return 'Syntax error, malformed JSON'; // or trigger_error() or throw new Exception()
			case JSON_ERROR_UTF8:
				$clean = $this->utf8ize($value);
				if ($utfErrorFlag) {
					return 'UTF8 encoding error'; // or trigger_error() or throw new Exception()
				}
				return $this->safe_json_encode($clean, $options, $depth, true);
			default:
				return 'Unknown error'; // or trigger_error() or throw new Exception()
	
		}
	}
	
	function utf8ize($mixed) {
		if (\is_array($mixed)) {
			foreach ($mixed as $key => $value) {
				$mixed[$key] = \utf8ize($value);
			}
		} else if (\is_string ($mixed)) {
			return \utf8_encode($mixed);
		}
		return $mixed;
	}


}

$ROUTER = new ApiRoute();