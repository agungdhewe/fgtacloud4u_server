CREATE TABLE `fgt_testjurnal` (
	`jurnal_id` varchar(13) NOT NULL , 
	`jurnal_descr` varchar(90)  , 
	`jurnal_note` varchar(255)  , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`jurnal_id`)
) 
ENGINE=InnoDB DEFAULT CHARSET=latin1
COMMENT=''


CREATE TABLE `fgt_testjurnaldetil` (
	`jurnal_id` varchar(13) NOT NULL , 
	`jurnaldetil_id` varchar(13) NOT NULL , 
	`jurnaldetil_info` varchar(255)  , 
	`jurnaldetil_value` decimal(18, 2) NOT NULL DEFAULT 0, 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`jurnaldetil_id`)
) 
ENGINE=InnoDB DEFAULT CHARSET=latin1
COMMENT=''


CREATE TABLE `fgt_testjurnalpaymn` (
	`jurnal_id` varchar(13) NOT NULL , 
	`jurnalpaymn_id` varchar(13) NOT NULL , 
	`jurnalpaymn_data` varchar(255)  , 
	`jurnalpaymn_value` decimal(18, 2) NOT NULL DEFAULT 0, 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`jurnalpaymn_id`)
) 
ENGINE=InnoDB DEFAULT CHARSET=latin1
COMMENT=''


