<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}


require_once __ROOT_DIR.'/core/couchdbclient.php';

use \FGTA4\CouchDbClient;



/**
 * Class untuk memproses api via GET
 * dan megembalikan hasil object dari CFS.
 * class ini digunakan untuk keperluan ajax dari browser.
 * 
 * @category Routing
 * @author Panji Tengkorak <panjitengkorak@null.net>
 * @copyright 2020 Panji Tengkorak
 * @license https://opensource.org/licenses/BSD-3-Clause BSD
 * @link https://www.fgta.net
 * 
 */
class CfsRoute extends Route {


	public function ProcessRequest(object $reqinfo) : void {
		$this->reqinfo = $reqinfo;

		try {
			$count = 1;
			$id = urldecode(str_replace('cfs/', "", $reqinfo->params->pathinfo, $count));

			$FSCONFIGNAME = $GLOBALS['MAINFS'];
			$this->cdb = new CouchDbClient((object)DB_CONFIG[$FSCONFIGNAME]);

			try {
				$this->result = $this->cdb->getAttachment($id, 'filedata');
				// $base64data = explode(',', $result->attachmentdata);
				// header("Content-type: " . $result->type);
				// header('Content-Length: ' . $result->size);
				// echo base64_decode($base64data[1]);
			} catch (\Exception $ex) {
				throw $ex;
			}

		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	public function SendHeader() : void {
		header("Content-type: " . $this->result->type);
		header('Content-Length: ' . $this->result->size);
	}


	public function ShowResult() : void {
		$base64data = explode(',', $this->result->attachmentdata);
		echo base64_decode($base64data[1]);
	}


	public function ShowError(object $ex) : void {
		echo $ex->getMessage();
	}


	/*
	public function ProcessRequest($reqinfo) {
		
		$count = 1;
		$datarequestline = str_replace($_SERVER['SCRIPT_NAME'] . '/cfs/', "", $_SERVER['REQUEST_URI'], $count);	
		$datarequests = explode("/", $datarequestline);
		$this->id = urldecode($datarequests[0]);
		$this->attachmentname = urldecode($datarequests[1]);
		$this->reqinfo = $reqinfo;
		$this->datarequests = $datarequests;
	}


	public function ShowResult($content) {
		$this->cdb = new CouchDbClient((object)DB_CONFIG['FGTAFS']);
		try {
			$fileid = $this->id;
			$result = $this->cdb->getAttachment($fileid, 'filedata');
			$base64data = explode(',', $result->attachmentdata);
			header("Content-type: " . $result->type);
			header('Content-Length: ' . $result->size);
			echo base64_decode($base64data[1]);
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	
	public function ShowError($ex) {
		$content = ob_get_contents();
		ob_end_clean();

		$title = 'Error';
		if (property_exists($ex, 'title')) {
			$title = $ex->title;
		}

		$err = new \FGTA4\ErrorPage($title);
		$err->titlestyle = 'color:orange; margin-top: 0px';
		$err->content = $content;
		$err->Show($ex->getMessage());		
	}
	*/
}

