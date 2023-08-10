<?php namespace FGTA4\exceptions;

if (!defined('FGTA4')) {
	die('Forbiden');
}


class WebException extends \Exception {

	const HTTP_ERROR_CODES = [
		'200' => "Ok",
		'500' => "Internal Server Error",
		'501' => "Not Implemented",
		'400' => "Bad Request",
		'401' => "Unauthorized",
		'403' => "Forbidden",
		'404' => "Not Found",
		'405' => "Method Not Allowed"
	];


    public function __construct($message, $errorstatus=200, $code = 0, Exception $previous = null) {
		$this->errorstatus = $errorstatus;
		$this->redirecttologin = ($errorstatus==401) ? true : false;
		if (array_key_exists("$errorstatus", self::HTTP_ERROR_CODES)) {
			$errorstatusmessage = self::HTTP_ERROR_CODES["$errorstatus"];
			$this->errorstatusmessage = " $errorstatus $errorstatusmessage";
		} else {
			$this->errorstatusmessage = " 501 Not Implemented (Status $errorstatus)";
		}
		parent::__construct($message, $code, $previous);
    }

    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }	
}