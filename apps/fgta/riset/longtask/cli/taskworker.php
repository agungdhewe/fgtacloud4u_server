<?php namespace FGTA4;

require_once __ROOT_DIR.'/core/cliworker.php';	

/*
 * Syncronisasi RV dari TB ke kalista
 * 
 */
console::class(new class($args) extends cliworker {
	private array $params;
	
	function __construct($args) {
		parent::__construct($args);

		$DB_CONFIG = DB_CONFIG[$GLOBALS['MAINDB']];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM[$GLOBALS['MAINDBTYPE']];		
		$this->db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);


		// get executing parameter
		$this->params = $args->params;
	}

	function execute() {
		$name = $this->params['--name'];
		$pid = $this->params['--pid'];
		$username = $this->params['--username'];
		$data = $this->params['--data'];

		echo "Execute long process\r\n";
		print_r($this->params);
		

		try {
			$this->registerProcess($name, $pid, $username);

			$progress = 0;
			$taskdescr = 'Preparing data';
			$this->updateProcess($progress, $taskdescr);


			// Jalankan persiapan disini
			sleep(1);



			$max = 5;
			for ($i=0; $i<=$max; $i++) {
				$cancel = $this->isRequestingCancel();
				if ($cancel) {
					$this->cancelProcess();
					break;
				}

				$progress = 10 + ((int)(80*((float)$i/(float)$max)));
				$taskdescr = "progress sofar $progress%";
				$this->updateProcess($progress, $taskdescr);
				
				// Jalankan proses disini
				sleep(1);



				
			}		

			$progress = 91;
			$taskdescr = "finishing task";
			$this->updateProcess($progress, $taskdescr);

			// Finisihing proses disini
			sleep(1);

			$this->updateProcess(100, 'done.');
			$this->commitProcess();


			// 

		} catch (\Exception $ex) {
			$this->haltProcess($ex->getMessage());
			echo "\r\n\x1b[31m"."ERROR"."\x1b[0m"."\r\n";
			echo "\x1b[1m".$ex->getMessage()."\x1b[0m"."\r\n";
		}
	}
});