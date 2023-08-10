-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `fgt_permission`;


CREATE TABLE IF NOT EXISTS `fgt_permission` (
	`permission_id` varchar(60) NOT NULL , 
	`permission_name` varchar(90) NOT NULL , 
	`permission_descr` varchar(255)  , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `permission_name` (`permission_name`),
	PRIMARY KEY (`permission_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Permission';


ALTER TABLE `fgt_permission` ADD COLUMN IF NOT EXISTS  `permission_name` varchar(90) NOT NULL  AFTER `permission_id`;
ALTER TABLE `fgt_permission` ADD COLUMN IF NOT EXISTS  `permission_descr` varchar(255)   AFTER `permission_name`;


ALTER TABLE `fgt_permission` MODIFY COLUMN IF EXISTS  `permission_name` varchar(90) NOT NULL  AFTER `permission_id`;
ALTER TABLE `fgt_permission` MODIFY COLUMN IF EXISTS  `permission_descr` varchar(255)   AFTER `permission_name`;


ALTER TABLE `fgt_permission` ADD CONSTRAINT `permission_name` UNIQUE IF NOT EXISTS  (`permission_name`);




INSERT INTO fgt_permission (`permission_id`, `permission_name`, `_createby`, `_createdate`) VALUES ('ASSET_BOOK_ALLOW', 'ASSET_BOOK_ALLOW', 'root', NOW());



