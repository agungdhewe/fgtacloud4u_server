<?php namespace FGTA4\module; if (!defined('FGTA4')) { die('Forbiden'); } 


$MODULE = new class extends WebModule {
	
	public function LoadPage() {
		try {
			$userdata = $this->auth->session_get_user();

			$this->userfullname = $userdata->userfullname;

		} catch (\Exception $ex) {
			throw $ex;
		}			
	}
};