<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR . '/core/webprog.php';
require_once __ROOT_DIR . '/core/websession.php';

use \FGTA4\WebProg;
use \FGTA4\WebSession;




/**
 * Class untuk memproses api via GET
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
class GetRoute extends Route {

	public $debugoutput = false;
	
	private $mode = "";
	private $PRG = null;
	private $result = null;





	public function ProcessRequest(object $reqinfo) : void {
		$this->reqinfo = $reqinfo;

		try {
			//$this->PrepareRequestModule($reqinfo);

			$modulename = $reqinfo->module;
			$modulefullname = $reqinfo->modulefullname;

			$module_dir = implode('/', [__ROOT_DIR , 'apps', $modulefullname]); 
			$module_path_json = implode('/', [$module_dir, $reqinfo->module . '.json']);

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


			$requestparams = explode('/', $reqinfo->params->scriptparam);
			$scripttoexecute = $requestparams[0];
			if ($scripttoexecute=="") {
				throw new \Exception("format request get salah!");
			}
			$scriptparam =  substr_replace(
				$reqinfo->params->scriptparam, '', 0, 1+strlen($scripttoexecute)
			);			


			$configuration = $this->ReadConfiguration($module_path_json);
			$authmodel = $this->getAuthenticationModel($configuration, $scripttoexecute);


			if (array_key_exists('HTTP_FGTA_MODE', $_SERVER)) {
				$this->mode = $_SERVER['HTTP_FGTA_MODE'];
			}

			if (!array_key_exists('HTTP_FGTA_TOKENID', $_SERVER)) {
				// untuk yg not anonim, harus ada tokenid
				if (!$authmodel->allowanonymous) {
					throw new \Exception (
						'Tokenid error, tidak ditemukan di header',
						WEB_GENERAL_ERROR
					);
				}
			} else {
				$tokenid = $_SERVER['HTTP_FGTA_TOKENID'];
				if (!$authmodel->allowanonymous) {
					WebSession::start($tokenid, (object)['allow_blank_token'=>false]);
				}
			}


			$scriptpath = implode('/', [$module_dir, "$scripttoexecute.php"]);

			if (!is_file($scriptpath)) {
				throw new \FGTA4\exceptions\WebException(
					"program '$scripttoexecute' tidak ditemukan di '$modulefullname'.", 
					WEB_GENERAL_ERROR
				);		
			}

			$PRG = null;
			require_once $scriptpath;

			if (!is_object($PRG)) {
				throw new \FGTA4\exceptions\WebException(
					"Object API belum terdefinisi dengan benar!", 
					WEB_GENERAL_ERROR
				);		
			}

			if (!($PRG instanceof WebProg)) {
				throw new \FGTA4\exceptions\WebException(
					"Object API harus inherit dari WebAPI!", 
					WEB_GENERAL_ERROR
				);		
			}

			if (!method_exists($PRG, 'execute')) {
				throw new \FGTA4\exceptions\WebException(
					"metode execute tidak ditemukan pada API", 
					WEB_GENERAL_ERROR
				);	
			}

			$this->PRG = $PRG;
			$this->result = $this->PRG->execute($scriptparam);
	

		} catch (\Exception $ex) {
			throw $ex;
		}

	}




	public function SendHeader() : void {
		$content = $this->content;		

		if (method_exists($this->PRG, 'SendHeader')) {
			$this->PRG->SendHeader($content);
			return;
		} 

		if ($this->mode=='api') {
			\header('Content-Type: application/json');
		} else {
			\header('Content-Type: text/html');
		}
	}

	public function ShowResult() : void {
		$content = $this->content;
		$result = $this->result;
		if (is_object($this->PRG)) {
			if (method_exists($this->PRG, 'ShowResult')) {
				$this->PRG->ShowResult($result, $content);
				return;
			}
		}

		if ($this->mode=='api') {
			$output = json_encode([
				"code" => 0,
				"responseData" => $result,
				"contentoutput" => $content			
			]);
			echo $output;
		}
	}

	public function ShowError(object $ex) : void {
		$content = $this->content;		

		if (is_object($this->PRG)) {
			if (method_exists($this->PRG, 'ShowError')) {
				$this->PRG->ShowResult($ex, $content);
				return;
			}
		}

		if ($this->mode=='api') {
			$code = $ex->getCode();
			$output = json_encode([
				"code" => $code==0 ? WEB_GENERAL_ERROR : $code,
				"message" => $ex->getMessage(),
				"contentoutput" => $content			
			]);
			echo $output;
		} else {
			echo $ex->getMessage();
		}
	}


	public function getAuthenticationModel(object $configuration, string $scriptname) : object {
		$allowanonymous = false;
		$allowedgroups = ['public'];

		try {

			if (property_exists($configuration, 'get')) {
				if (property_exists($configuration->get, $scriptname)) {
					if (property_exists($configuration->get->$scriptname, 'allowanonymous')) {
						$allowanonymous = $configuration->get->$scriptname->allowanonymous;
					}
					if (property_exists($configuration->get->$scriptname, 'allowedgroups')) {
						$allowedgroups = $configuration->get->$scriptname->allowedgroups;
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

