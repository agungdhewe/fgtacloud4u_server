<?php namespace FGTA4;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR . '/core/webprog.php';

use \FGTA4\WebProg;


$PRG = new class extends WebProg {

	public function execute($lineparam) {
		$file = $lineparam;
	}

};
