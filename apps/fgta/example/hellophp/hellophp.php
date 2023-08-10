<?php namespace FGTA4\module; if (!defined('FGTA4')) { die('Forbiden'); } 


class HelloPHP extends WebModule {
	
	public function LoadPage() {
		$this->variable = 'ini variable yang diset dari PHP';
	}
}

$MODULE = new HelloPHP();