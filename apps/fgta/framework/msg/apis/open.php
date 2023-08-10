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
 * fgta/framework/msg/apis/open.php
 *
 * ====
 * Open
 * ====
 * Menampilkan satu baris data/record sesuai PrimaryKey,
 * dari tabel header msg (que_msg)
 *
 * Agung Nugroho <agung@fgta.net> http://www.fgta.net
 * Tangerang, 26 Maret 2021
 *
 * digenerate dengan FGTA4 generator
 * tanggal 03/10/2022
 */
$API = new class extends msgBase {
	
	public function execute($options) {
		$event = 'on-open';
		$tablename = 'que_msg';
		$primarykey = 'msg_id';
		$userdata = $this->auth->session_get_user();

		$handlerclassname = "\\FGTA4\\apis\\msg_headerHandler";
		$hnd = null;
		if (class_exists($handlerclassname)) {
			$hnd = new msg_headerHandler($options);
			$hnd->caller = &$this;
			$hnd->db = $this->db;
			$hnd->auth = $this->auth;
			$hnd->reqinfo = $this->reqinfo;
			$hnd->event = $event;
		}

		try {

			// cek apakah user boleh mengeksekusi API ini
			if (!$this->RequestIsAllowedFor($this->reqinfo, "open", $userdata->groups)) {
				throw new \Exception('your group authority is not allowed to do this action.');
			}

			$criteriaValues = [
				"msg_id" => " msg_id = :msg_id "
			];
			if (is_object($hnd)) {
				if (method_exists(get_class($hnd), 'buildOpenCriteriaValues')) {
					// buildOpenCriteriaValues(object $options, array &$criteriaValues) : void
					$hnd->buildOpenCriteriaValues($options, $criteriaValues);
				}
			}
			$where = \FGTA4\utils\SqlUtility::BuildCriteria($options->criteria, $criteriaValues);
			$result = new \stdClass; 

			if (is_object($hnd)) {
				if (method_exists(get_class($hnd), 'prepareOpenData')) {
					// prepareOpenData(object $options, $criteriaValues) : void
					$hnd->prepareOpenData($options, $criteriaValues);
				}
			}


			$sqlFieldList = [
				'msg_id' => 'A.`msg_id`', 'msg_module' => 'A.`msg_module`', 'msg_batch' => 'A.`msg_batch`', 'msg_descr' => 'A.`msg_descr`',
				'msgtype_id' => 'A.`msgtype_id`', 'msg_hp' => 'A.`msg_hp`', 'msg_email' => 'A.`msg_email`', 'msg_nama' => 'A.`msg_nama`',
				'msg_subject' => 'A.`msg_subject`', 'msg_body' => 'A.`msg_body`', 'msg_isactive' => 'A.`msg_isactive`', 'msg_activedate' => 'A.`msg_activedate`',
				'msg_isprocess' => 'A.`msg_isprocess`', 'msg_processbatch' => 'A.`msg_processbatch`', 'msg_processdate' => 'A.`msg_processdate`', 'msg_issend' => 'A.`msg_issend`',
				'server_messageid' => 'A.`server_messageid`', 'msg_isfail' => 'A.`msg_isfail`', 'msg_failmessage' => 'A.`msg_failmessage`', 'msg_senddate' => 'A.`msg_senddate`',
				'msg_ismarktodel' => 'A.`msg_ismarktodel`', 'msg_cbtable' => 'A.`msg_cbtable`', 'msg_cbfieldkey' => 'A.`msg_cbfieldkey`', 'msg_cbfieldvalue' => 'A.`msg_cbfieldvalue`',
				'msg_cbfieldstatus' => 'A.`msg_cbfieldstatus`', '_createby' => 'A.`_createby`', '_createdate' => 'A.`_createdate`', '_modifyby' => 'A.`_modifyby`',
				'_createby' => 'A.`_createby`', '_createdate' => 'A.`_createdate`', '_modifyby' => 'A.`_modifyby`', '_modifydate' => 'A.`_modifydate`'
			];
			$sqlFromTable = "que_msg A";
			$sqlWhere = $where->sql;

			if (is_object($hnd)) {
				if (method_exists(get_class($hnd), 'SqlQueryOpenBuilder')) {
					// SqlQueryOpenBuilder(array &$sqlFieldList, string &$sqlFromTable, string &$sqlWhere, array &$params) : void
					$hnd->SqlQueryOpenBuilder($sqlFieldList, $sqlFromTable, $sqlWhere, $where->params);
				}
			}
			$sqlFields = \FGTA4\utils\SqlUtility::generateSqlSelectFieldList($sqlFieldList);

			
			$sqlData = "
				select 
				$sqlFields 
				from 
				$sqlFromTable 
				$sqlWhere 
			";

			$stmt = $this->db->prepare($sqlData);
			$stmt->execute($where->params);
			$row  = $stmt->fetch(\PDO::FETCH_ASSOC);

			$record = [];
			foreach ($row as $key => $value) {
				$record[$key] = $value;
			}



			$result->record = array_merge($record, [
				
				// // jikalau ingin menambah atau edit field di result record, dapat dilakukan sesuai contoh sbb: 
				// 'tambahan' => 'dta',
				//'tanggal' => date("d/m/Y", strtotime($record['tanggal'])),
				//'gendername' => $record['gender']
				
				'msgtype_name' => \FGTA4\utils\SqlUtility::Lookup($record['msgtype_id'], $this->db, 'mst_msgtype', 'msgtype_id', 'msgtype_name'),


				'_createby' => \FGTA4\utils\SqlUtility::Lookup($record['_createby'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),
				'_modifyby' => \FGTA4\utils\SqlUtility::Lookup($record['_modifyby'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),

			]);

			if (is_object($hnd)) {
				if (method_exists(get_class($hnd), 'DataOpen')) {
					//  DataOpen(array &$record) : void 
					$hnd->DataOpen($result->record);
				}
			}

			

			return $result;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

};