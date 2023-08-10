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


class PrintformRoute extends Route {

	public function ProcessRequest(object $reqinfo) : void {

		try {
			//$this->PrepareRequestModule($reqinfo);

			$modulename = $reqinfo->module;
			$modulefullname = $reqinfo->modulefullname;
			$reqinfo->moduledir = implode('/', [__ROOT_DIR, 'apps', $modulefullname]);

			$path_xprintform_php = implode('/', [$reqinfo->moduledir, $reqinfo->params->scriptparam . ".php"]);
			$path_xprintform_phtml = implode('/', [$reqinfo->moduledir, $reqinfo->params->scriptparam . ".phtml"]);

			if (!is_file($path_xprintform_php)) {
				throw new \Exception("file '$path_xprintform_php' tidak ditemukan");
			}

			if (!is_file($path_xprintform_phtml)) {
				throw new \Exception("file '$path_xprintform_phtml' tidak ditemukan");
			}

			require_once $path_xprintform_php;
			echo "test test test";
			

		} catch (\Exception $ex) {
			throw $ex;
		}
		
	}

	public function SendHeader() : void {
	}

	public function ShowResult() : void {
	}

	public function ShowError(object $ex) : void {
		echo $ex->getMessage();
	}



}

$ROUTER = new PrintformRoute();