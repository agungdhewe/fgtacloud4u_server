<?php namespace FGTA4\module; if (!defined('FGTA4')) { die('Forbiden'); } 


$MODULE = new class extends WebModule {

	public function LoadPage() {
		$userdata = $this->auth->session_get_user();

		try {
			
			// ambil data variance
			$variancename = '';
			$variancedata = new \stdClass;
			if (array_key_exists('variancename', $_GET)) {
				$variancename = $_GET['variancename'];
				if (property_exists($this->configuration, "variance")) {
					if (property_exists($this->configuration->variance, $variancename)) {
						if (property_exists($this->configuration->variance->{$variancename}, "data")) {
							$variancedata = $this->configuration->variance->{$variancename}->data;
						}
					}
				}
			}


			// parameter=parameter yang bisa diakses langsung dari javascript module
			// dengan memanggil variable global.setup.<namavariable>
			$this->setup = (object)array(
				'variancename' => $variancename,
				'variancedata' => $variancedata,
				'print_to_new_window' => false,
				'username' => $userdata->username,
			);

		} catch (\Exception $ex) {
			$this->error($ex->getMessage());
		}			
	
	}
};
