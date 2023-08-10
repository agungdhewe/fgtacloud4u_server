<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';



use \FGTA4\exceptions\WebException;


class LogList extends WebAPI {
	function __construct() {
		$this->debugoutput = true;

		$DB_CONFIG = DB_CONFIG[$GLOBALS['MAINDB']];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM[$GLOBALS['MAINDBTYPE']];

		$this->db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);

	}

	public function execute($options) {
		try {
		
			$where = \FGTA4\utils\SqlUtility::BuildCriteria(
				$options->criteria,
				[
					"tablename" => " A.tablename = :tablename ",
					"id" => "A.id = :id"
				]
			);

			$result = new \stdClass; 
			$maxrow = 30;
			$offset = (property_exists($options, 'offset')) ? $options->offset : 0;

			$stmt = $this->db->prepare("select count(*) as n from xlog A" . $where->sql);
			$stmt->execute($where->params);
			$row  = $stmt->fetch(\PDO::FETCH_ASSOC);
			$total = (float) $row['n'];

			$limit = " LIMIT $maxrow OFFSET $offset ";
			$stmt = $this->db->prepare("
				select 
				tablename, id, action, note, remoteip, user_id, module, timestamp, rowid 
				from xlog A
			" . $where->sql . $limit);
			$stmt->execute($where->params);
			$rows  = $stmt->fetchall(\PDO::FETCH_ASSOC);

			$records = [];
			foreach ($rows as $row) {
				$record = [];
				foreach ($row as $key => $value) {
					$record[$key] = $value;
				}

				array_push($records, array_merge($record, [
					// // jikalau ingin menambah atau edit field di result record, dapat dilakukan sesuai contoh sbb: 
					//'tanggal' => date("d/m/y", strtotime($record['tanggal'])),
					 //'tambahan' => 'dta'
					 'user_name' => \FGTA4\utils\SqlUtility::Lookup($record['user_id'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),
				]));
			}

			// kembalikan hasilnya
			$result->total = $total;
			$result->offset = $offset + $maxrow;
			$result->maxrow = $maxrow;
			$result->records = $records;
			return $result;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

}

$API = new LogList();



/*

CREATE TABLE `xlog` (
	`tablename` varchar(90) NOT NULL,
	`id` varchar(90) NOT NULL,
	`action` varchar(30) NOT NULL,
	`note` varchar(255) NOT NULL,
	`remoteip` varchar(15) NOT NULL,
	`user_id` varchar(13) NOT NULL,
	`module` varchar(30) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
 	`rowid` varchar(13) NOT NULL, 
	PRIMARY KEY (`rowid`),
	KEY `idx_xlog_tablename_id` (`tablename`,`id`)
) ENGINE=InnoDB		
*/
