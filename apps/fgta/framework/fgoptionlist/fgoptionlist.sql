-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `fgt_optionlist`;


CREATE TABLE IF NOT EXISTS `fgt_optionlist` (
	`optionlist_id` varchar(10) NOT NULL , 
	`optionlist_name` varchar(120)  , 
	`optionlist_descr` varchar(255)  , 
	`optionlist_tag` varchar(255)  , 
	`optionlist_order` int(4) NOT NULL DEFAULT 0, 
	`optionlist_data` varchar(2255)  , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `optionlist_name` (`optionlist_name`),
	PRIMARY KEY (`optionlist_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Model Timespan ';


ALTER TABLE `fgt_optionlist` ADD COLUMN IF NOT EXISTS  `optionlist_name` varchar(120)   AFTER `optionlist_id`;
ALTER TABLE `fgt_optionlist` ADD COLUMN IF NOT EXISTS  `optionlist_descr` varchar(255)   AFTER `optionlist_name`;
ALTER TABLE `fgt_optionlist` ADD COLUMN IF NOT EXISTS  `optionlist_tag` varchar(255)   AFTER `optionlist_descr`;
ALTER TABLE `fgt_optionlist` ADD COLUMN IF NOT EXISTS  `optionlist_order` int(4) NOT NULL DEFAULT 0 AFTER `optionlist_tag`;
ALTER TABLE `fgt_optionlist` ADD COLUMN IF NOT EXISTS  `optionlist_data` varchar(2255)   AFTER `optionlist_order`;


ALTER TABLE `fgt_optionlist` MODIFY COLUMN IF EXISTS  `optionlist_name` varchar(120)    AFTER `optionlist_id`;
ALTER TABLE `fgt_optionlist` MODIFY COLUMN IF EXISTS  `optionlist_descr` varchar(255)    AFTER `optionlist_name`;
ALTER TABLE `fgt_optionlist` MODIFY COLUMN IF EXISTS  `optionlist_tag` varchar(255)    AFTER `optionlist_descr`;
ALTER TABLE `fgt_optionlist` MODIFY COLUMN IF EXISTS  `optionlist_order` int(4) NOT NULL DEFAULT 0  AFTER `optionlist_tag`;
ALTER TABLE `fgt_optionlist` MODIFY COLUMN IF EXISTS  `optionlist_data` varchar(2255)    AFTER `optionlist_order`;


ALTER TABLE `fgt_optionlist` ADD CONSTRAINT `optionlist_name` UNIQUE IF NOT EXISTS  (`optionlist_name`);







