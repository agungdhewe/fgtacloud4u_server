<?php namespace FGTA4\exceptions;

if (!defined('FGTA4')) {
	die('Forbiden');
}


// use FGTA4\exceptions\WebException;

class LoginException extends WebException {

	public function __construct($message) {
		parent::__construct($message, 401);
		$this->redirecttologin = false;
	}

}
