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
 * fgta/framework/fgoptionlist/apis/delete.php
 *
 * ======
 * Delete
 * ======
 * Menghapus satu baris data/record berdasarkan PrimaryKey
 * pada tabel header fgoptionlist (fgt_optionlist)
 *
 * Agung Nugroho <agung@fgta.net> http://www.fgta.net
 * Tangerang, 26 Maret 2021
 *
 * digenerate dengan FGTA4 generator
 * tanggal 31/08/2023
 */
$API = new class extends fgoptionlistBase {
	
	public function execute($data, $options) {
		$tablename = 'fgt_optionlist';
		$primarykey = 'optionlist_id';

		$userdata = $this->auth->session_get_user();
		$handlerclassname = "\\FGTA4\\apis\\fgoptionlist_headerHandler";
		$hnd = null;
		if (class_exists($handlerclassname)) {
			$hnd = new fgoptionlist_headerHandler($options);
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
				
				// Deleting child data referenced to this table
				$tabletodelete = [];
				if (method_exists(get_class($hnd), 'DocumentDeleting')) {
					// ** DocumentDeleting(string $id, array &$tabletodelete)
					$hnd->DocumentDeleting($data->{$primarykey}, $tabletodelete);
				}

				foreach ($tabletodelete as $reftablename) {
					$detilkeys = clone $key;
					// handle data sebelum pada saat pembuatan SQL Delete
					if (method_exists(get_class($hnd), 'RowDeleting')) {
						// ** RowDeleting(string &$reftablename, object &$key, string $primarykey, string $primarykeyvalue)
						$hnd->RowDeleting($reftablename, $detilkeys, $key->{$primarykey}, $data->{$primarykey});
					}
					
					$cmd = \FGTA4\utils\SqlUtility::CreateSQLDelete($reftablename, $detilkeys);
					$stmt = $this->db->prepare($cmd->sql);
					$stmt->execute($cmd->params);
				}
		
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