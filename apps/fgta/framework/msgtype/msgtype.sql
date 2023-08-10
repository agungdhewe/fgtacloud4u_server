-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `mst_msgtype`;


CREATE TABLE IF NOT EXISTS `mst_msgtype` (
	`msgtype_id` varchar(3) NOT NULL , 
	`msgtype_name` varchar(90) NOT NULL , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `msgtype_name` (`msgtype_name`),
	PRIMARY KEY (`msgtype_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Type Message';


ALTER TABLE `mst_msgtype` ADD COLUMN IF NOT EXISTS  `msgtype_name` varchar(90) NOT NULL  AFTER `msgtype_id`;


ALTER TABLE `mst_msgtype` MODIFY COLUMN IF EXISTS  `msgtype_name` varchar(90) NOT NULL  AFTER `msgtype_id`;


ALTER TABLE `mst_msgtype` ADD CONSTRAINT `msgtype_name` UNIQUE IF NOT EXISTS  (`msgtype_name`);




INSERT INTO mst_msgtype (`msgtype_id`, `msgtype_name`, `_createby`, `_createdate`) VALUES ('EML', 'Email', 'root', NOW());
INSERT INTO mst_msgtype (`msgtype_id`, `msgtype_name`, `_createby`, `_createdate`) VALUES ('WAB', 'Whatsapp', 'root', NOW());



