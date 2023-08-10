<?php

require_once dirname(__FILE__).'/../public/dbconfig.php';

$dbconfigovver = $argv[1];
if (is_file($dbconfigovver)) {
	require_once $dbconfigovver;
}

$config = new \stdClass;
$config->DB_CONFIG = DB_CONFIG;
$config->MAINDB = $GLOBALS['MAINDB'];
$config->MAINDBTYPE = $GLOBALS['MAINDBTYPE'];


echo (json_encode($config));