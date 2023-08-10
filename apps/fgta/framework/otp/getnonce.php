<?php namespace FGTA4;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR . '/core/webprog.php';

use \FGTA4\WebProg;


$PRG = new class extends WebProg {

	public function execute($lineparam) {

		$modulename = $lineparam;
		if (!array_key_exists('nonces', $_SESSION)) {
			$_SESSION['nonces'] = [];
		} else {
			// hapus nonce yg expired
			$currenttime = new \DateTime();
			foreach ($_SESSION['nonces'] as $nonce=>$obj) {
				$expired = $obj['expired'];
				$is_expired = $expired < $currenttime;
				if ($is_expired) {
					unset($_SESSION['nonces'][$nonce]);
				}
			}
		}

		$expired = new \DateTime();
		$expired->modify('+1 minutes');
		$nonce = uniqid();
		$_SESSION['nonces'][$nonce] = [
			'nonce' => $nonce,
			'modulename' => $modulename,
			'expired' => $expired
		];

		return (object)[
			'nonce' => $nonce
		];
	}
};
