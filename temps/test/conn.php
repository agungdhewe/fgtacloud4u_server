<?php


echo "test koneksi\r\n";


$FRM2 = [
	'DSN' => 'dblib:host=172.18.10.254;dbname=E_FRM2_BACKUP',
	'user' => 'sa',
	'pass' => 'rahasia'	
];


try {

	$db_frm2 = new \PDO(
		$FRM2['DSN'], 
		$FRM2['user'], 
		$FRM2['pass'],
		[
			\PDO::ATTR_CASE => \PDO::CASE_NATURAL,
			\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
			\PDO::ATTR_ORACLE_NULLS => \PDO::NULL_NATURAL,
			\PDO::ATTR_STRINGIFY_FETCHES => false
		]
	);

	echo "Connected.";
} catch (\Exception $ex) {
	echo $ex->getMessage();
}

echo "\r\n";


