-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `fgt_setting`;


CREATE TABLE IF NOT EXISTS `fgt_setting` (
	`setting_id` varchar(30) NOT NULL , 
	`setting_value` varchar(255)  , 
	`setting_scope` varchar(255)  , 
	`setting_tag` varchar(255)  , 
	`setting_descr` varchar(255)  , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`setting_id`)
) 
ENGINE=InnoDB
COMMENT='';


ALTER TABLE `fgt_setting` ADD COLUMN IF NOT EXISTS  `setting_value` varchar(255)   AFTER `setting_id`;
ALTER TABLE `fgt_setting` ADD COLUMN IF NOT EXISTS  `setting_scope` varchar(255)   AFTER `setting_value`;
ALTER TABLE `fgt_setting` ADD COLUMN IF NOT EXISTS  `setting_tag` varchar(255)   AFTER `setting_scope`;
ALTER TABLE `fgt_setting` ADD COLUMN IF NOT EXISTS  `setting_descr` varchar(255)   AFTER `setting_tag`;


ALTER TABLE `fgt_setting` MODIFY COLUMN IF EXISTS  `setting_value` varchar(255)    AFTER `setting_id`;
ALTER TABLE `fgt_setting` MODIFY COLUMN IF EXISTS  `setting_scope` varchar(255)    AFTER `setting_value`;
ALTER TABLE `fgt_setting` MODIFY COLUMN IF EXISTS  `setting_tag` varchar(255)    AFTER `setting_scope`;
ALTER TABLE `fgt_setting` MODIFY COLUMN IF EXISTS  `setting_descr` varchar(255)    AFTER `setting_tag`;









