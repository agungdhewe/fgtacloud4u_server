CREATE TABLE `mst_accgroup` (
	`accgroup_id` varchar(10) NOT NULL , 
	`accgroup_name` varchar(60) NOT NULL , 
	`accgroup_descr` varchar(90)  , 
	`accgroup_isdisabled` tinyint(1) NOT NULL DEFAULT 0, 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `accgroup_name` (`accgroup_name`),
	PRIMARY KEY (`accgroup_id`)
) 
ENGINE=InnoDB
COMMENT='Master Account Group';




INSERT INTO mst_accgroup (`accgroup_id`, `accgroup_name`, `_createby`, `_createdate`) VALUES ('1', 'AKTIVA', 'root', NOW());
INSERT INTO mst_accgroup (`accgroup_id`, `accgroup_name`, `_createby`, `_createdate`) VALUES ('2', 'HUTANG', 'root', NOW());
INSERT INTO mst_accgroup (`accgroup_id`, `accgroup_name`, `_createby`, `_createdate`) VALUES ('3', 'MODAL', 'root', NOW());
INSERT INTO mst_accgroup (`accgroup_id`, `accgroup_name`, `_createby`, `_createdate`) VALUES ('4', 'PENGHASILAN', 'root', NOW());
INSERT INTO mst_accgroup (`accgroup_id`, `accgroup_name`, `_createby`, `_createdate`) VALUES ('5', 'BIAYA', 'root', NOW());
INSERT INTO mst_accgroup (`accgroup_id`, `accgroup_name`, `_createby`, `_createdate`) VALUES ('6', 'LAIN-LAIN', 'root', NOW());



