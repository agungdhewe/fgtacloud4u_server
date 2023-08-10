CREATE TABLE `trn_jurnal` (
	`jurnal_id` varchar(14) NOT NULL , 
	`jurnal_date` date NOT NULL , 
	`jurnal_descr` varchar(90) NOT NULL , 
	`jurnal_isposted` tinyint(1) NOT NULL DEFAULT 0, 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`jurnal_id`)
) 
ENGINE=InnoDB
COMMENT='Master Jurnal';







CREATE TABLE `trn_jurnaldetil` (
	`jurnaldetil_id` varchar(14) NOT NULL , 
	`jurnaldetil_descr` varchar(90) NOT NULL , 
	`jurnaldetil_value` decimal(6, 0) NOT NULL DEFAULT 0, 
	`acc_id` varchar(10) NOT NULL , 
	`jurnal_id` varchar(14) NOT NULL , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`jurnaldetil_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Content Jurnal';

ALTER TABLE `trn_jurnaldetil` ADD KEY `acc_id` (`acc_id`);
ALTER TABLE `trn_jurnaldetil` ADD KEY `jurnal_id` (`jurnal_id`);

ALTER TABLE `trn_jurnaldetil` ADD CONSTRAINT `fk_trn_jurnaldetil_mst_acc` FOREIGN KEY (`acc_id`) REFERENCES `mst_acc` (`acc_id`);
ALTER TABLE `trn_jurnaldetil` ADD CONSTRAINT `fk_trn_jurnaldetil_trn_jurnal` FOREIGN KEY (`jurnal_id`) REFERENCES `trn_jurnal` (`jurnal_id`);





