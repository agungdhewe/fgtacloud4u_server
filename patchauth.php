<?php

die("program expired");

(new class() {

	const PARENT_DIR = ['.', '..'];
	const APPPATH =__DIR__. '/apps';


	public function main() : void {
		echo "pathc data\r\n";

		foreach (scandir(self::APPPATH) as $entry) {
			if (in_array($entry, self::PARENT_DIR)) continue;
			
			$packagepath = implode('/', [self::APPPATH, $entry]);
			if (is_file($packagepath)) continue;
			
		
			if ($entry==='fgta') continue;

			echo "$packagepath\r\n";
			foreach (scandir($packagepath) as $entry) {
				if (in_array($entry, self::PARENT_DIR)) continue;
		
				$appspath = implode('/', [$packagepath, $entry]);
				if (is_file($appspath)) continue;
		
				
				if (str_starts_with($entry, '.')) continue;
		
				foreach (scandir($appspath) as $entry) {
					if (in_array($entry, self::PARENT_DIR)) continue;
		
					$modulespath = implode('/', [$appspath, $entry]);
					if (is_file($modulespath)) continue;
		
					$modulename = $entry;
					$jsonfile = implode('/', [$modulespath, $modulename . ".json"]);
		
					if (is_file($jsonfile)) {
						$this->patchjsonfile($jsonfile);
					}
				}
				
			}
		
		
			
		
		}
	}

	function patchjsonfile(string $jsonfile) : void {
		// echo "$jsonfile\r\n";

		try {
			$jsonbackup = "$jsonfile.bak";
			$jsontemp = "$jsonfile.temp";

			if (!is_file($jsonbackup)) {
				copy($jsonfile, $jsonbackup);
			}

			$fpt = fopen($jsontemp , "w");
			$fp = fopen($jsonfile, "r");

			$fcontent = "";
			while (!feof($fp)) {
				$line = fgets($fp, 255*1000);
				$line = str_replace('"allowanonymous" : true,', '"allowanonymous" : false,', $line);
				$fcontent .= $line;
				echo $line;
			}

			fputs($fpt, $fcontent);

			fclose($fp);
			fclose($fpt);
			
			copy($jsontemp, $jsonfile);
			unlink($jsontemp);

		} catch (Exception $ex) {
			die ("\r\n" . $ex->getMessage() . "\r\n\r\n");
		}

	}



})->main();


/*


*/