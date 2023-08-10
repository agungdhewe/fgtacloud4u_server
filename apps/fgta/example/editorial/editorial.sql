-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `exm_editorial`;


CREATE TABLE IF NOT EXISTS `exm_editorial` (
	`editorial_id` varchar(14) NOT NULL , 
	`editorial_title` varchar(255)  , 
	`editorial_content` varchar(25000)  , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `editorial_title` (`editorial_title`),
	PRIMARY KEY (`editorial_id`)
) 
ENGINE=InnoDB
COMMENT='';


ALTER TABLE `exm_editorial` ADD COLUMN IF NOT EXISTS  `editorial_title` varchar(255)   AFTER `editorial_id`;
ALTER TABLE `exm_editorial` ADD COLUMN IF NOT EXISTS  `editorial_content` varchar(25000)   AFTER `editorial_title`;


ALTER TABLE `exm_editorial` MODIFY COLUMN IF EXISTS  `editorial_title` varchar(255)    AFTER `editorial_id`;
ALTER TABLE `exm_editorial` MODIFY COLUMN IF EXISTS  `editorial_content` varchar(25000)    AFTER `editorial_title`;


ALTER TABLE `exm_editorial` ADD CONSTRAINT `editorial_title` UNIQUE IF NOT EXISTS  (`editorial_title`);







