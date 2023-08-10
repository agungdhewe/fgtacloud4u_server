<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __DIR__ . '/xapi.base.php';


use \FGTA4\exceptions\WebException;


$API = new class extends preferenceBase {

	public function execute($options) {

		$userdata = $this->auth->session_get_user();
		try {

			$sql = "
				select distinct 
				AX.dash_id, 
				(select dash_name from fgt_dash where dash_id=AX.dash_id) as dash_name
				from (
				
					select 
					B.group_id, B.dash_id 
					from fgt_user A inner join fgt_group B on B.group_id = A.group_id 
					where 
					A.user_id = :user_id
					
					union 
					
					select 
					B.group_id, C.dash_id
					from fgt_user A inner join fgt_group B on B.group_id = A.group_id 
									inner join fgt_groupdash C on C.group_id = B.group_id 
					where 
					A.user_id = :user_id
				
				) AX
				where 
				AX.dash_id is not null;			
			
			";

			$stmt = $this->db->prepare($sql);
			$stmt->execute([':user_id'=>$userdata->username]);
			$rows = $stmt->fetchall();

			$records = [];
			foreach ($rows as $row) {
				$records[] = (object)[
					'dash_id' => $row['dash_id'],
					'dash_name' => $row['dash_name']
				];
			}		

			// kembalikan hasilnya
			$result = new \stdClass;
			$result->total = count($records);
			$result->offset = 0;
			$result->maxrow = count($records);
			$result->records = $records;
			return $result;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

};
