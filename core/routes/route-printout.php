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


class PrintoutRoute extends Route {

	public function ProcessRequest(object $reqinfo) : void {
		$MODULE = null;

		try {
			//$this->PrepareRequestModule($reqinfo);

			$modulename = $reqinfo->module;
			$modulefullname = $reqinfo->modulefullname;
			$reqinfo->moduledir = implode('/', [__ROOT_DIR, 'apps', $modulefullname]);

			if (!array_key_exists('format', $_GET)) {
				throw new \Exception('format belum didefinisikan di GET');
			}

			if (!array_key_exists('renderto', $_GET)) {
				throw new \Exception('renderto belum didefinisikan di GET');
			}

			$format = $_GET['format'];
			$renderto = $_GET['renderto'];

			$rn = pathinfo($renderto);
			$renderfilename = $rn['filename'];
			
			
			$this->path_template_phtml = __ROOT_DIR."/public/templates/fgta-printout/$renderfilename.phtml";
			$this->path_template_css = __ROOT_DIR."/public/templates/fgta-printout/asset/$renderfilename.css";
			$this->path_xprint_css = implode('/', [$reqinfo->moduledir, $reqinfo->params->scriptparam . ".css"]);
			$this->path_xprint_mjs = implode('/', [$reqinfo->moduledir, $reqinfo->params->scriptparam . ".mjs"]);
			$this->path_xprint_php = implode('/', [$reqinfo->moduledir, $reqinfo->params->scriptparam . ".php"]);
			$this->path_xprint_phtml = implode('/', [$reqinfo->moduledir, $reqinfo->params->scriptparam . ".phtml"]);



			$reqinfo->modulecsspath = $this->path_xprint_php;
			$reqinfo->moduleviewpath = $this->path_xprint_phtml;
			$reqinfo->modulejspath = $this->path_xprint_mjs;
			$reqinfo->modulejsurl = implode("/", ['./index.php/asset', $reqinfo->modulefullname, $reqinfo->params->scriptparam . ".mjs"]);
			$reqinfo->modulecsspath = $this->path_xprint_css;
			$reqinfo->modulecssurl = implode("/", ['./index.php/asset', $reqinfo->modulefullname, $reqinfo->params->scriptparam . ".css"]);
			$reqinfo->variancename = array_key_exists('variancename', $_GET) ? $GET['variancename'] : '';

			if (array_key_exists('tokenid', $_COOKIE)) {
				$tokenid = $_COOKIE['tokenid'];
				WebSession::start($tokenid);
				$this->auth = new WebAuth();
				if (!$this->auth->is_login()) {
					throw new \Exception('You are not authorized to open this page');
				}
			} else {
				throw new \Exception('token not present!');
			}


			// cek files
			$filestocheck = [
				$this->path_template_phtml, $this->path_template_css, 
				$this->path_xprint_php, $this->path_xprint_phtml, $this->path_xprint_mjs, $this->path_xprint_css
			];
			
			foreach ($filestocheck as $filepath) {
				if (!is_file($filepath)) {
					throw new \Exception("File '$filepath' tidak ditemukan");
				}
			}

			require_once $this->path_xprint_php;
			$MODULE->title = "Report Display";
			$MODULE->reqinfo = $reqinfo;
			$MODULE->auth = $this->auth;
			$MODULE->urlparams = $reqinfo->params;
			$MODULE->configuration = (object)[
				'basetitle' => $MODULE->title
			];


			$this->MODULE = &$MODULE;
			//if (property_exists($this->MODULE->urlparams, 'testpreview')) {
			if (array_key_exists('testpreview', $_GET)) {	
				if (!method_exists($this->MODULE, 'TestPreview')) {
					throw new \Exception('fungsi TestPreview tidak tersedia di module!');
				}
				$this->MODULE->TestPreview();
			} else {

				$this->postdata = $this->getPostData();
				$this->api_class = get_class($this->MODULE);
				$this->api_method = new \ReflectionMethod($this->api_class, 'LoadPage');
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

				if ($_SERVER['REQUEST_METHOD']!='POST') {
					throw new \FGTA4\exceptions\WebException("hanya bisa diakses via POST!", 405);
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

				$this->api_method->invokeArgs($this->MODULE, $this->api_executingparameters);
			}
			
		} catch (\Exception $ex) {
			throw $ex;
		}
		
	}

	public function SendHeader() : void {
		\header('Content-Type: text/html');
	}

	public function ShowResult() : void {
		$content = $this->content;
		$MODULE = $this->MODULE;
		$MODULE->Render($content, $this->path_template_phtml);
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

}

$ROUTER = new PrintoutRoute();