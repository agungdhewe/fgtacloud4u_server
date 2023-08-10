<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class AssetRoute extends Route {

	const ALLOWED_EXTENSIONS = array(
		'js' => ['contenttype'=>'application/javascript'],
		'mjs' => ['contenttype'=>'application/javascript'],
		'css' => ['contenttype'=>'text/css'],
		'gif' => ['contenttype'=>'image/gif'],
		'bmp' => ['contenttype'=>'image/bmp'],
		'png' => ['contenttype'=>'image/png'],
		'jpg' => ['contenttype'=>'image/jpeg'],
		'svg' => ['contenttype'=>'image/svg+xml'],
		'pdf' => ['contenttype'=>'application/pdf'],
		'woff2' => ['contenttype'=>'font/woff2']
	);

	private string $assetpath;
	private string $extension;

	function __construct() {
		parent::__construct();
	}

	public function ProcessRequest(object $reqinfo) : void {
		try {
			$modulefullname = $reqinfo->modulefullname;

			$assetname = $reqinfo->params->scriptparam;
			$assetpath = implode("/", [__ROOT_DIR, 'apps', $modulefullname, $assetname]);

			if (!is_file($assetpath)) {
				$err = new \Exception("'$assetname' tidak ditemukan!");
				$err->title = 'Not Found';
				header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found', true, 404);
				throw $err;
			} 
			
			$extension = pathinfo($assetpath, PATHINFO_EXTENSION);
			if (!array_key_exists($extension, self::ALLOWED_EXTENSIONS)) {
				$err = new \Exception("Akses ke asset '$assetname' tidak diperbolehkan!");
				$err->title = 'Not Allowed';
				header($_SERVER['SERVER_PROTOCOL'] . ' 403 Not Allowed', true, 403);
				throw $err;
			}

			$this->assetpath = $assetpath;
			$this->extension = $extension;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	public function SendHeader() : void {
		header("Content-type: " . self::ALLOWED_EXTENSIONS[$this->extension]['contenttype']);
		header('Content-Length: ' . filesize($this->assetpath));
	}

	public function ShowResult() : void {
		$content = $this->content;
		readfile($this->assetpath);	
	}


	public function ShowError(object $ex) : void {
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
	/*
	public function ProcessRequest($reqinfo) {
		$reqinfo->assetextension = pathinfo($reqinfo->modulerequestinfo, PATHINFO_EXTENSION);
		$reqinfo->assetpath = "$reqinfo->moduledir/$reqinfo->modulerequestinfo";
		var_dump($reqinfo);

		if ($reqinfo->modulerequestinfo=='') {
			$err = new \Exception("Asset tidak didefinisikan!");
			$err->title = 'Bad Request';
			header($_SERVER['SERVER_PROTOCOL'] . ' 400 Bad Request', true, 400);
			throw $err;			
		}

	
		// if (!in_array($reqinfo->assetextension, self::ALLOWED_EXTENSIONS)) {
		if (!array_key_exists($reqinfo->assetextension, self::ALLOWED_EXTENSIONS)) {
			$err = new \Exception("Akses ke asset tidak diperbolehkan!");
			$err->title = 'Not Allowed';
			header($_SERVER['SERVER_PROTOCOL'] . ' 403 Not Allowed', true, 403);
			throw $err;
		}	

		if (!is_file($reqinfo->assetpath)) {
			$err = new \Exception("Asset '$reqinfo->assetpath' tidak ditemukan!");
			$err->title = 'Not Found';
			header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found', true, 404);
			throw $err;
		}

		$this->reqinfo = $reqinfo;
	}

	public function ShowResult($content) {
		$reqinfo = $this->reqinfo;
		//header("Content-type: " . mime_content_type ( $reqinfo->assetpath));

		$assetpath = $reqinfo->assetpath;
		// if ($reqinfo->assetextension=='mjs') {
		// 	$assetpath_min = \str_replace('.mjs', '.min.mjs', $reqinfo->assetpath);
		// 	if (\is_file($assetpath_min)) {
		// 		$pmin_time = \filemtime($assetpath_min);
		// 		$pori_time = \filemtime($assetpath);
		// 		if ($pmin_time > $pori_time) {
		// 			$assetpath = $assetpath_min;
		// 		}
		// 	} else {
		// 		// minify js

		// 	}
		// }

		if ($reqinfo->assetextension=='mjs') {
			$modulerequest_min = \str_replace('.mjs', '.min.mjs', $reqinfo->modulerequestinfo);

			// cek di localdb dir
			$assetpath_min = __OBFUSCATED_DIR . "/$reqinfo->appsgroup/". $reqinfo->appsname . "%D%" .  $reqinfo->modulename . "%D%" . $modulerequest_min;
			if (\is_file($assetpath_min)) {
				$pmin_time = \filemtime($assetpath_min);
				$pori_time = \filemtime($assetpath);
				if ($pmin_time > $pori_time) {
					$assetpath = $assetpath_min;
				}				
			}
		}

		header("Content-type: " . self::ALLOWED_EXTENSIONS[$reqinfo->assetextension]['contenttype']);
		header('Content-Length: ' . filesize($assetpath));
		readfile($assetpath);		
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

// $ROUTER = new AssetRoute();
