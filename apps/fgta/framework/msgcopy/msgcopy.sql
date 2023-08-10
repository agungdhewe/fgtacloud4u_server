-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `mst_msgcopy`;


CREATE TABLE IF NOT EXISTS `mst_msgcopy` (
	`msgcopy_id` varchar(2) NOT NULL , 
	`msgcopy_name` varchar(3) NOT NULL , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `msgcopy_name` (`msgcopy_name`),
	PRIMARY KEY (`msgcopy_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Copy Message';


ALTER TABLE `mst_msgcopy` ADD COLUMN IF NOT EXISTS  `msgcopy_name` varchar(3) NOT NULL  AFTER `msgcopy_id`;


ALTER TABLE `mst_msgcopy` MODIFY COLUMN IF EXISTS  `msgcopy_name` varchar(3) NOT NULL  AFTER `msgcopy_id`;


ALTER TABLE `mst_msgcopy` ADD CONSTRAINT `msgcopy_name` UNIQUE IF NOT EXISTS  (`msgcopy_name`);




INSERT INTO mst_msgcopy (`msgcopy_id`, `msgcopy_name`, `_createby`, `_createdate`) VALUES ('TO', 'TO', 'root', NOW());
INSERT INTO mst_msgcopy (`msgcopy_id`, `msgcopy_name`, `_createby`, `_createdate`) VALUES ('CC', 'CC', 'root', NOW());
INSERT INTO mst_msgcopy (`msgcopy_id`, `msgcopy_name`, `_createby`, `_createdate`) VALUES ('BC', 'BCC', 'root', NOW());



