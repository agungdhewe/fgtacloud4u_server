<?php

$filename = "data.txt";
$filepath = implode("/", [__DIR__,  $filename]);
$fp = fopen($filepath, "w+");
for ($i=0; $i<=17305; $i++) {
	$id = uniqid();
	fputs($fp, "$id\r\n");
}
fclose($fp);