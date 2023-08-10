-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `fgt_group`;
-- drop table if exists `fgt_groupdash`;
-- drop table if exists `fgt_grouprole`;


CREATE TABLE IF NOT EXISTS `fgt_group` (
	`group_id` varchar(13) NOT NULL , 
	`group_name` varchar(30)  , 
	`group_descr` varchar(255)  , 
	`group_disabled` tinyint(1) NOT NULL DEFAULT 1, 
	`group_menu` varchar(90)  , 
	`dash_id` varchar(14)  , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `group_name` (`group_name`),
	PRIMARY KEY (`group_id`)
) 
ENGINE=InnoDB
COMMENT='';


ALTER TABLE `fgt_group` ADD COLUMN IF NOT EXISTS  `group_name` varchar(30)   AFTER `group_id`;
ALTER TABLE `fgt_group` ADD COLUMN IF NOT EXISTS  `group_descr` varchar(255)   AFTER `group_name`;
ALTER TABLE `fgt_group` ADD COLUMN IF NOT EXISTS  `group_disabled` tinyint(1) NOT NULL DEFAULT 1 AFTER `group_descr`;
ALTER TABLE `fgt_group` ADD COLUMN IF NOT EXISTS  `group_menu` varchar(90)   AFTER `group_disabled`;
ALTER TABLE `fgt_group` ADD COLUMN IF NOT EXISTS  `dash_id` varchar(14)   AFTER `group_menu`;


ALTER TABLE `fgt_group` MODIFY COLUMN IF EXISTS  `group_name` varchar(30)   AFTER `group_id`;
ALTER TABLE `fgt_group` MODIFY COLUMN IF EXISTS  `group_descr` varchar(255)   AFTER `group_name`;
ALTER TABLE `fgt_group` MODIFY COLUMN IF EXISTS  `group_disabled` tinyint(1) NOT NULL DEFAULT 1 AFTER `group_descr`;
ALTER TABLE `fgt_group` MODIFY COLUMN IF EXISTS  `group_menu` varchar(90)   AFTER `group_disabled`;
ALTER TABLE `fgt_group` MODIFY COLUMN IF EXISTS  `dash_id` varchar(14)   AFTER `group_menu`;


ALTER TABLE `fgt_group` ADD CONSTRAINT `group_name` UNIQUE IF NOT EXISTS  (`group_name`);

ALTER TABLE `fgt_group` ADD KEY IF NOT EXISTS `dash_id` (`dash_id`);

ALTER TABLE `fgt_group` ADD CONSTRAINT `fk_fgt_group_fgt_dash` FOREIGN KEY IF NOT EXISTS  (`dash_id`) REFERENCES `fgt_dash` (`dash_id`);





CREATE TABLE IF NOT EXISTS `fgt_groupdash` (
	`groupdash_id` varchar(14) NOT NULL , 
	`dash_id` varchar(14)  , 
	`group_id` varchar(13) NOT NULL , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `groupdash_pair` (`groupdash_id`, `dash_id`),
	PRIMARY KEY (`groupdash_id`)
) 
ENGINE=InnoDB
COMMENT='';


ALTER TABLE `fgt_groupdash` ADD COLUMN IF NOT EXISTS  `dash_id` varchar(14)   AFTER `groupdash_id`;
ALTER TABLE `fgt_groupdash` ADD COLUMN IF NOT EXISTS  `group_id` varchar(13) NOT NULL  AFTER `dash_id`;


ALTER TABLE `fgt_groupdash` MODIFY COLUMN IF EXISTS  `dash_id` varchar(14)   AFTER `groupdash_id`;
ALTER TABLE `fgt_groupdash` MODIFY COLUMN IF EXISTS  `group_id` varchar(13) NOT NULL  AFTER `dash_id`;


ALTER TABLE `fgt_groupdash` ADD CONSTRAINT `groupdash_pair` UNIQUE IF NOT EXISTS  (`groupdash_id`, `dash_id`);

ALTER TABLE `fgt_groupdash` ADD KEY IF NOT EXISTS `dash_id` (`dash_id`);
ALTER TABLE `fgt_groupdash` ADD KEY IF NOT EXISTS `group_id` (`group_id`);

ALTER TABLE `fgt_groupdash` ADD CONSTRAINT `fk_fgt_groupdash_fgt_dash` FOREIGN KEY IF NOT EXISTS  (`dash_id`) REFERENCES `fgt_dash` (`dash_id`);
ALTER TABLE `fgt_groupdash` ADD CONSTRAINT `fk_fgt_groupdash_fgt_group` FOREIGN KEY IF NOT EXISTS (`group_id`) REFERENCES `fgt_group` (`group_id`);





CREATE TABLE IF NOT EXISTS `fgt_grouprole` (
	`grouprole_id` varchar(14) NOT NULL , 
	`role_id` varchar(30)  , 
	`group_id` varchar(13) NOT NULL , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `grouprole_pair` (`grouprole_id`, `role_id`),
	PRIMARY KEY (`grouprole_id`)
) 
ENGINE=InnoDB
COMMENT='';


ALTER TABLE `fgt_grouprole` ADD COLUMN IF NOT EXISTS  `role_id` varchar(30)   AFTER `grouprole_id`;
ALTER TABLE `fgt_grouprole` ADD COLUMN IF NOT EXISTS  `group_id` varchar(13) NOT NULL  AFTER `role_id`;


ALTER TABLE `fgt_grouprole` MODIFY COLUMN IF EXISTS  `role_id` varchar(30)   AFTER `grouprole_id`;
ALTER TABLE `fgt_grouprole` MODIFY COLUMN IF EXISTS  `group_id` varchar(13) NOT NULL  AFTER `role_id`;


ALTER TABLE `fgt_grouprole` ADD CONSTRAINT `grouprole_pair` UNIQUE IF NOT EXISTS  (`grouprole_id`, `role_id`);

ALTER TABLE `fgt_grouprole` ADD KEY IF NOT EXISTS `role_id` (`role_id`);
ALTER TABLE `fgt_grouprole` ADD KEY IF NOT EXISTS `group_id` (`group_id`);

ALTER TABLE `fgt_grouprole` ADD CONSTRAINT `fk_fgt_grouprole_fgt_role` FOREIGN KEY IF NOT EXISTS  (`role_id`) REFERENCES `fgt_role` (`role_id`);
ALTER TABLE `fgt_grouprole` ADD CONSTRAINT `fk_fgt_grouprole_fgt_group` FOREIGN KEY IF NOT EXISTS (`group_id`) REFERENCES `fgt_group` (`group_id`);





