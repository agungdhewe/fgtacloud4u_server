<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}


require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __DIR__ . '/xapi.base.php';

if (is_file(__DIR__ .'/data-header-handler.php')) {
	require_once __DIR__ .'/data-header-handler.php';
}

use \FGTA4\exceptions\WebException;


/**
 * {__MODULEPROG__}
 *
 * ======
 * Delete
 * ======
 * Menghapus satu baris data/record berdasarkan PrimaryKey
 * pada tabel header {__BASENAME__} ({__TABLENAME__})
 *
 * Agung Nugroho <agung@fgta.net> http://www.fgta.net
 * Tangerang, 26 Maret 2021
 *
 * digenerate dengan FGTA4 generator
 * tanggal {__GENDATE__}
 */
$API = new class extends {__BASENAME__}Base {
	
	public function execute($data, $options) {
		$tablename = '/*{__TABLENAME__}*/';
		$primarykey = '/*{__PRIMARYID__}*/';

		$userdata = $this->auth->session_get_user();
		$handlerclassname = "\\FGTA4\\apis\\{__BASENAME__}_headerHandler";
		$hnd = null;
		if (class_exists($handlerclassname)) {
			$hnd = new /*__BASENAME__*/_headerHandler($options);
			$hnd->caller = &$this;
			$hnd->db = &$this->db;
			$hnd->auth = $this->auth;
			$hnd->reqinfo = $this->reqinfo;
		} else {
			$hnd = new \stdClass;
		}

		try {

			// cek apakah user boleh mengeksekusi API ini
			if (!$this->RequestIsAllowedFor($this->reqinfo, "delete", $userdata->groups)) {
				throw new \Exception('your group authority is not allowed to do this action.');
			}

			if (method_exists(get_class($hnd), 'init')) {
				// init(object &$options) : void
				$hnd->init($options);
			}

			$result = new \stdClass; 
			
			$key = new \stdClass;
			$key->{$primarykey} = $data->{$primarykey};


			if (method_exists(get_class($hnd), 'PreCheckDelete')) {
				// PreCheckDelete($data, &$key, &$options)
				$hnd->PreCheckDelete($data, $key, $options);
			}

			$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,0);
			$this->db->beginTransaction();

			try {
				/*{__DELETE_REFERENCE__}*/
				$cmd = \FGTA4\utils\SqlUtility::CreateSQLDelete($tablename, $key);
				$stmt = $this->db->prepare($cmd->sql);
				$stmt->execute($cmd->params);
				\FGTA4\utils\SqlUtility::WriteLog($this->db, $this->reqinfo->modulefullname, $tablename, $key->{$primarykey}, 'DELETE', $userdata->username, (object)[]);

				if (method_exists(get_class($hnd), 'DocumentDeleted')) {
					// DocumentDeleted(string $id)
					$hnd->DocumentDeleted($data->{$primarykey});
				}

				$this->db->commit();

				$result->success = true;
			} catch (\Exception $ex) {
				$result->success = false;
				$this->db->rollBack();
				throw $ex;
			} finally {
				$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,1);
			}			

			return $result;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

};