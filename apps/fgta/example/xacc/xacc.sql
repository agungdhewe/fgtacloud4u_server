CREATE TABLE `mst_acc` (
	`acc_id` varchar(10) NOT NULL , 
	`acc_name` varchar(60) NOT NULL , 
	`acc_descr` varchar(90)  , 
	`acc_isdisabled` tinyint(1) NOT NULL DEFAULT 0, 
	`accgroup_id` varchar(10) NOT NULL , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `acc_name` (`acc_name`),
	PRIMARY KEY (`acc_id`)
) 
ENGINE=InnoDB
COMMENT='Master Account';

ALTER TABLE `mst_acc` ADD KEY `accgroup_id` (`accgroup_id`);

ALTER TABLE `mst_acc` ADD CONSTRAINT `fk_mst_acc_mst_accgroup` FOREIGN KEY (`accgroup_id`) REFERENCES `mst_accgroup` (`accgroup_id`);





