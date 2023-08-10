<?php namespace FGTA4\module; if (!defined('FGTA4')) { die('Forbiden'); } 


$MODULE = new class extends WebModule {
	
	public function LoadPage() {
		$this->incontainer = true;
		try {
			$userdata = $this->auth->session_get_user();
			if (\property_exists($userdata, 'dash_module')) {
				$this->dash_module = $userdata->dash_module;
			} else {
				$this->dash_module = null;
			}


			$this->preloadstyles = [
				'index.php/public/jslibs/fgta/fgta-sidenav.css',
			];


			$container_version = "-v2.0";
			$this->reqinfo->module_path_phtml = str_replace("container.phtml", "container$container_version.phtml", $this->reqinfo->module_path_phtml);
			$this->reqinfo->module_path_css = str_replace("container.css", "container$container_version.css", $this->reqinfo->module_path_css);
			$this->reqinfo->module_path_mjs = str_replace("container.mjs", "container$container_version.mjs", $this->reqinfo->module_path_mjs);

			if (!is_file($this->reqinfo->module_path_mjs)) {
				throw new \Exception("File ". $this->reqinfo->module_path_mjs . " tidak ditemukan ");
			}

			if (!is_file($this->reqinfo->module_path_css)) {
				throw new \Exception("File ". $this->reqinfo->module_path_css . " tidak ditemukan ");
			}

			$this->reqinfo->module_url_css = "index.php/asset/fgta/framework/container/container$container_version.css";
			$this->reqinfo->module_url_mjs = "./index.php/asset/fgta/framework/container/container$container_version.mjs";

		} catch (\Exception $ex) {
			throw $ex;
		}
	}
};

