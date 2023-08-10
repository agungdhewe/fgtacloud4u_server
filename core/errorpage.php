<?php namespace FGTA4;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class ErrorPage {
	const ERROR_STATUS_STYLES = [
		'500' => 'color:red'
	];

	function __construct($title = 'Internal Server Error', $errorstatus=500) {
		$this->titlestyle = "";
		if (array_key_exists("$errorstatus", self::ERROR_STATUS_STYLES)) {
			$this->titlestyle .= self::ERROR_STATUS_STYLES["$errorstatus"];
		}

		$this->errorstatus = $errorstatus;
		$this->title = $title;
		$this->content = '';
	}


	public function Show($message) {
		echo "<!DOCTYPE HTML>";
		echo "<html>";
		echo "<head>";
		echo "<base href=\"".__BASEADDRESS."\">";
		echo "<link rel=\"shortcut icon\" href=\"images/favicon.ico\">";
		echo "</head>";
		echo "<body style=\"margin-top: 0px !important; padding-top: 0px !important;\">";
		echo "<h1 style=\"$this->titlestyle\">$this->title</h1>";
		echo $message;
		if ($this->content!='') {
			echo "<div style=\"margin-top: 30px; margin-bottom: 20px\">$this->content</div>";
		}
		echo "<hr>";
		echo "<div style=\"font-size: 0.8em; margin-bottom: 30px\">fgtacloud4 server</div>";		
		echo "</body>";
		echo "</html>";

	}
}
