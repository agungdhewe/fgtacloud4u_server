-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `fgt_dash`;


CREATE TABLE IF NOT EXISTS `fgt_dash` (
	`dash_id` varchar(14) NOT NULL , 
	`dash_name` varchar(90)  , 
	`dash_descr` varchar(255)  , 
	`dash_module` varchar(255)  , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `dash_name` (`dash_name`),
	PRIMARY KEY (`dash_id`)
) 
ENGINE=InnoDB
COMMENT='';


ALTER TABLE `fgt_dash` ADD COLUMN IF NOT EXISTS  `dash_name` varchar(90)   AFTER `dash_id`;
ALTER TABLE `fgt_dash` ADD COLUMN IF NOT EXISTS  `dash_descr` varchar(255)   AFTER `dash_name`;
ALTER TABLE `fgt_dash` ADD COLUMN IF NOT EXISTS  `dash_module` varchar(255)   AFTER `dash_descr`;


ALTER TABLE `fgt_dash` MODIFY COLUMN IF EXISTS  `dash_name` varchar(90)   AFTER `dash_id`;
ALTER TABLE `fgt_dash` MODIFY COLUMN IF EXISTS  `dash_descr` varchar(255)   AFTER `dash_name`;
ALTER TABLE `fgt_dash` MODIFY COLUMN IF EXISTS  `dash_module` varchar(255)   AFTER `dash_descr`;


ALTER TABLE `fgt_dash` ADD CONSTRAINT `dash_name` UNIQUE IF NOT EXISTS  (`dash_name`);







