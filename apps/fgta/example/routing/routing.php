<?php
namespace FGTA4\module; 
if (!defined('FGTA4')) { die('Forbiden'); } 

$MODULE = new class extends WebModule {
	public function LoadPage() {
		try {
			$this->variable = "1234";
		} catch (\Exception $ex) {
		}
	}
};

