<?php namespace FGTA4;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __DIR__ . '/loginexception.php';


use FGTA4\exceptions\WebException;
use FGTA4\exceptions\LoginException;


class WebUser {
	public $username;
	public $userfullname;
	public $employee_id;
	public $groups = ['public'];

	public static $db;


	public static function setDb(object $db) : void {
		self::$db = $db;
	}

	public static function login(string $username, string $password) : WebUser {
		$md5password = md5($password);

		try {
			$options = new \stdClass;
			$options->criteria = [
				'user_name' => $username,
				'user_disabled' => 0
			];

			$where = \FGTA4\utils\SqlUtility::BuildCriteria(
				$options->criteria,
				[
					"user_name" => " user_name = :user_name ",
					"user_disabled" => " user_disabled = :user_disabled "
				]
			);

			$sql = \FGTA4\utils\SqlUtility::Select('fgt_user', [
				'user_id', 'user_name', 'user_fullname', 'user_email', 'user_password', 'user_disabled', 'group_id' 
			], $where->sql);			

			$stmt = self::$db->prepare($sql);
			$stmt->execute($where->params);
			$row  = $stmt->fetch(\PDO::FETCH_ASSOC);

			if ($row==null) {
				throw new LoginException("Login salah");
			}


			$record = [];
			foreach ($row as $key => $value) {
				$record[$key] = $value;
			}
			


			$user = array_merge($record, [
				'group_menu' => \FGTA4\utils\SqlUtility::Lookup($record['group_id'], self::$db, 'fgt_group', 'group_id', 'group_menu')
			]);			

			if ($user['user_password']!=$md5password) {
				throw new LoginException("Password yang anda masukkkan salah");
			}



			$where = \FGTA4\utils\SqlUtility::BuildCriteria(
				[	
					'user_id' => $user['user_id'],					
					'usergroups_isdisabled' => 0
				],
				[
					"user_id" => "user_id = :user_id ",
					"usergroups_isdisabled" => "usergroups_isdisabled = :usergroups_isdisabled"
				]
			);


			$user_groups = ['public', $user['group_id'] ];
			/* ambil group lain yang dipunyai user ini */
			$sql = \FGTA4\utils\SqlUtility::Select('fgt_usergroups', [
				'group_id'
			], $where->sql);			
			$stmt = self::$db->prepare($sql);
			$stmt->execute($where->params);
			$rows  = $stmt->fetchall(\PDO::FETCH_ASSOC);
			foreach ($rows as $row) {
				if (!in_array($row['group_id'], $user_groups)) {
					$user_groups[] = $row['group_id'];
				}
			}


			/* ambil daftar group yang bisa digunakan */
			$available_groups = ['public'];
			$group_file = __LOCALDB_DIR . "/grouppriv/groups.json";
			$group_file_path = realpath($group_file);

			if (!is_file($group_file_path)) {
				throw new WebException("File '$group_file' tidak ditemukan",  500);
			}

			$group_jsondata = file_get_contents($group_file_path);
			$group_rawdata = (object) json_decode($group_jsondata, true);
			if (json_last_error()) {
				throw new WebException("format json pada file '$group_file_path' salah",  500);
			}
			foreach ($group_rawdata->groups as $group_id) {
				$available_groups[] = $group_id;
			}


			/* ambil real group */ 
			$group_memberof = ['public'];
			foreach ($user_groups as $group_id) {
				$group_id = strtolower($group_id);
				$group_file = __LOCALDB_DIR . "/grouppriv/group.$group_id.json";
				if (is_file($group_file)) {
					$group_file_path = realpath($group_file);
					$group_jsondata = file_get_contents($group_file_path);
					$group_rawdata = (object) json_decode($group_jsondata, true);
					if (json_last_error()) {
						throw new WebException("format json pada file '$group_file_path' salah",  500);
					}
					
					$memberof = $group_rawdata->memberof;
					foreach ($memberof as $priv_group_id) {
						if (!in_array($priv_group_id, $group_memberof)) {
							if (!in_array($priv_group_id, $available_groups)) {
								throw new WebException("Group '$priv_group_id' pada 'group.$group_id.json' tidak terdaftar", 500);
							}
							$group_memberof[] = $priv_group_id;
						}
					}

				}	
			}


			$ret = new WebUser();
			$ret->username = $user['user_id'];
			$ret->userfullname =  $user['user_fullname'];
			$ret->groups = $group_memberof;
			$ret->menu = ($user['group_menu']!='' ? $user['group_menu'] : 'modules-public')  .  '.json';

			return $ret;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}



	public static function hasPermissions(string $username,  array $permissions, ?string $setting_id=null) : bool {
		// setting_id = null berarti harus
		
		try {
			// cek dulu apakah setting untuk ini di aktifkan atau nggak
			if ($setting_id!=null) {
				$sql = "
					select setting_id, setting_value 
					from
					fgt_setting
					where
					setting_id = :setting_id
				";
				$stmt = self::$db->prepare($sql);
				$stmt->execute([':setting_id'=>$setting_id]);
				$row = $stmt->fetch();
				if ($row==null) {
					return true;
				} else {
					$value = (boolean)$row['setting_value'];
					if (!$value) {
						return true; // kalau nilainya nol, berarti seluruh permission di sini boleh
					}
				}
			}

			$sql = "
				select * from view_userpermission where user_id = :user_id
			";
			$stmt = self::$db->prepare($sql);
			$stmt->execute([':user_id'=>$username]);
			$rows = $stmt->fetchall();
			foreach ($rows as $row) {
				$permission_id = $row['permission_id'];

				if (in_array($permission_id, $permissions)) {
					return true;
				}
			}
			return false;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

}
