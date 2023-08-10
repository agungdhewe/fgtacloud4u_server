<?php namespace FGTA4;
define('FGTA4', 1);

date_default_timezone_set('Asia/Jakarta');

if (!defined('__ROOT_DIR')) {
	define('__ROOT_DIR', dirname(__FILE__));
}


require_once __CONFIG_PATH;
require_once __ROOT_DIR.'/core/webexception.php';
require_once __ROOT_DIR.'/core/vendor/autoload.php';
require_once __ROOT_DIR . '/core/dbsetting.php';


if (!defined('__LOCAL_CURR')) {
	define('__LOCAL_CURR',  'IDR');
}


global $argc, $argv;
console::execute($argv);



class color {
	public const reset = "\x1b[0m";
	public const red = "\x1b[31m";
	public const green = "\x1b[32m";
	public const yellow = "\x1b[33m";
	public const bright = "\x1b[1m";

}

class clibase {

}

class console {

	public const format = "\r\n\r\n" . color::bright . "Format:". color::reset ."\r\n\r\n\tphp cli.php <module_dir>/<command> [parameters]\r\n\r\n";

	public static function execute($argv) {
		try {

			if (strpos($argv[0], 'phpunit') !== false) {
				// potong array ke 0
				// unset($argv[0]);
				array_splice($argv, 0, 1);
			}

			$args = self::getcommandparameter($argv);
			$cmd = self::loadcommand($args->command, $args);

		} catch (Exception $ex) {
			echo "\r\n";
			echo color::red . "ERROR\r\n=====" . color::reset , "\r\n";
			echo $ex->getMessage();
			echo "\r\n\r\n";
		}
		
	}

	public static function getcommandparameter($argv) {
		try {
			if (count($argv)<2) {
				throw new Exception("perintah belum didefinisikan" . self::format);
			}

			$params = [];
			$i=0; $current_param_name = '';
			foreach ($argv as $arg) {
				$i++; if ($i<3) continue;
				// echo "$i $arg\r\n";
				if (substr($arg, 0, 2 ) === "--") {
					$current_param_name = $arg;
					$value_candidate = (count($argv)>$i) ? $argv[$i] : true;
					if (substr($value_candidate, 0, 2 ) === "--") {
						$value_candidate = true;
					}
					$params[$current_param_name] = $value_candidate;
				}
			}

			return (object) array(
				'command' => $argv[1],
				'params' => $params
			);
		} catch (Exception $ex) {
			throw $ex;
		}
	}

	public static function loadcommand($command, $args) {
		try {
			$command_basename = basename($command);
			$command_dir = str_replace("/".$command_basename ."$$", "", $command . "$$");
			$command_dir = $command_dir . "/cli/" . $command_basename . ".php";
			$command_path = __ROOT_DIR . "/apps/" . $command_dir;
			
			if (!is_file($command_path)) {
				throw new Exception(color::yellow . $command_dir . color::reset . " tidak ditemukan.");
			}

			if (!defined('DB_CONFIG')) {
				throw new Exception('Konfigurasi database belum di-set');
			}

			if (!is_array(DB_CONFIG) || !is_array(DB_CONFIG_PARAM)) {
				throw new Exception('Konfigurasi database belum di-set');
			}

			require_once $command_path;


		} catch (Exception $ex) {
			throw $ex;
		}
	}

	public static function require($filename) {

	}


	public static function class($obj) {
		$obj->execute();

	}

}


