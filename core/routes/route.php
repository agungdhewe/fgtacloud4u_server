<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/webmodulesetting.php';
require_once __ROOT_DIR.'/core/webexception.php';
require_once __ROOT_DIR.'/core/debug.php';


use \FGTA4\WebModuleConfig;
use \FGTA4\WebModuleSetting;
use \FGTA4\exceptions\WebException;
use \FGTA4\debug;

/**
 * Base Class untuk membuat routing ke modul-modul FGTA
 * 
 * @category Routing
 * @author Panji Tengkorak <panjitengkorak@null.net>
 * @copyright 2020 Panji Tengkorak
 * @license https://opensource.org/licenses/BSD-3-Clause BSD
 * @link https://www.fgta.net
 * 
 */
abstract class Route {

	protected bool $_isapps = true;
	protected string $content = "";


	function __construct() {
	}

	public static function getAvailable() : array {
		return [
			'module' => ['class' => '\FGTA4\routes\ModuleRoute', 'path' => __DIR__ . '/route-module.php' ],
			'public' => ['class' => '\FGTA4\routes\PublicRoute', 'path' => __DIR__ . '/route-public.php'],
			'asset' => ['class' => '\FGTA4\routes\AssetRoute', 'path' => __DIR__ . '/route-asset.php'],
			'api' => ['class' => '\FGTA4\routes\ApiRoute', 'path' => __DIR__ . '/route-api.php'],
			'get' => ['class' => '\FGTA4\routes\GetRoute', 'path' => __DIR__ . '/route-get.php'],
			'cfs' => ['class' => '\FGTA4\routes\CfsRoute', 'path' => __DIR__ . '/route-cfs.php'],
			'download' => ['class' => '\FGTA4\routes\DownloadRoute', 'path' => __DIR__ . '/route-download.php'],
			'profilepicture' => ['class' => '\FGTA4\routes\ProfilePictureRoute', 'path' => __DIR__ . '/route-profilepicture.php'],
			'printout' => ['class' => '\FGTA4\routes\PrintoutRoute', 'path' => __DIR__ . '/route-printout.php'],
			'printform' => ['class' => '\FGTA4\routes\PrintformRoute', 'path' => __DIR__ . '/route-printform.php'],
			'jslibs' => ['class' => '\FGTA4\routes\JslibsRoute', 'path' => __DIR__ . '/route-jslibs.php'],
		];
	}

	public function isApps() : bool {
		return $this->_isapps;
	}


	public function setContentOutput($content) {
		$this->content = $content;
	}


	public function ReadConfiguration(string $path) : object{
		try {
			$moduleconfig =  new WebModuleConfig($path);
			return $moduleconfig;
		} catch (\Exception $ex) {
			return $ex;
		}
	}

	public function ReadVarianceData(string $variancename, object $configuration) : ?object {
		if (property_exists($configuration->variance, $variancename)) {
			$variancedata = $configuration->variance->{$variancename}; 
			return $variancedata; 
		} 
		return null;
	}




	/**
	 * Fungsi ini akan diimplementasi di class turunan
	 * untuk memproses request url dan mengembalikan hasil ke browser
	 * 
	 * @param array $reqs array request yang dikrimkan dari url
	 * 
	 * @return void
	 */
	abstract public function ProcessRequest(object $reqinfo) : void; 


	/**
	 * Fungsi ini akan diimplementasi di class turunan
	 * untuk mengirimkan header ke browser
	 * 
	 * @return void 
	 */
	abstract public function SendHeader() : void;

	abstract public function ShowResult() : void;

	abstract public function ShowError(object $ex) : void;
	
}



//https://www.google.com/maps?saddr=My+Location&daddr=-6.189324050997315,106.79654239440968