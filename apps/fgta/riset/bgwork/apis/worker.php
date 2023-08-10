<?php


class Worker {
	public function run() {
		$opt = getopt("i:");
		$outputpath = implode('/', ['/mnt/ramdisk', "output-". $opt['i'] . ".txt"]);
		$fp = fopen($outputpath, "w+");

		print_r($opt);
		for ($i=1; $i<=100; $i++) {
			echo "$i";
			fputs($fp, $i);
			sleep(1);
		}

		fclose($fp);
		unlink($outputpath);
	}
}


$w = new Worker();
$w->run();