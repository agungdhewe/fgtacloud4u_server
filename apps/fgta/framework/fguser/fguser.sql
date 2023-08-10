-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `fgt_user`;
-- drop table if exists `fgt_usergroups`;
-- drop table if exists `fgt_userfavemod`;


CREATE TABLE IF NOT EXISTS `fgt_user` (
	`user_id` varchar(14) NOT NULL , 
	`user_name` varchar(30)  , 
	`user_fullname` varchar(90)  , 
	`user_email` varchar(150)  , 
	`user_password` varchar(255)  , 
	`group_id` varchar(13) NOT NULL , 
	`user_disabled` tinyint(1) NOT NULL DEFAULT 0, 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `user_name` (`user_name`),
	PRIMARY KEY (`user_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar User';


ALTER TABLE `fgt_user` ADD COLUMN IF NOT EXISTS  `user_name` varchar(30)   AFTER `user_id`;
ALTER TABLE `fgt_user` ADD COLUMN IF NOT EXISTS  `user_fullname` varchar(90)   AFTER `user_name`;
ALTER TABLE `fgt_user` ADD COLUMN IF NOT EXISTS  `user_email` varchar(150)   AFTER `user_fullname`;
ALTER TABLE `fgt_user` ADD COLUMN IF NOT EXISTS  `user_password` varchar(255)   AFTER `user_email`;
ALTER TABLE `fgt_user` ADD COLUMN IF NOT EXISTS  `group_id` varchar(13) NOT NULL  AFTER `user_password`;
ALTER TABLE `fgt_user` ADD COLUMN IF NOT EXISTS  `user_disabled` tinyint(1) NOT NULL DEFAULT 0 AFTER `group_id`;


ALTER TABLE `fgt_user` MODIFY COLUMN IF EXISTS  `user_name` varchar(30)    AFTER `user_id`;
ALTER TABLE `fgt_user` MODIFY COLUMN IF EXISTS  `user_fullname` varchar(90)    AFTER `user_name`;
ALTER TABLE `fgt_user` MODIFY COLUMN IF EXISTS  `user_email` varchar(150)    AFTER `user_fullname`;
ALTER TABLE `fgt_user` MODIFY COLUMN IF EXISTS  `user_password` varchar(255)    AFTER `user_email`;
ALTER TABLE `fgt_user` MODIFY COLUMN IF EXISTS  `group_id` varchar(13) NOT NULL   AFTER `user_password`;
ALTER TABLE `fgt_user` MODIFY COLUMN IF EXISTS  `user_disabled` tinyint(1) NOT NULL DEFAULT 0  AFTER `group_id`;


ALTER TABLE `fgt_user` ADD CONSTRAINT `user_name` UNIQUE IF NOT EXISTS  (`user_name`);

ALTER TABLE `fgt_user` ADD KEY IF NOT EXISTS `group_id` (`group_id`);

ALTER TABLE `fgt_user` ADD CONSTRAINT `fk_fgt_user_fgt_group` FOREIGN KEY IF NOT EXISTS  (`group_id`) REFERENCES `fgt_group` (`group_id`);





CREATE TABLE IF NOT EXISTS `fgt_usergroups` (
	`usergroups_id` varchar(14) NOT NULL , 
	`usergroups_isdisabled` tinyint(1) NOT NULL DEFAULT 0, 
	`group_id` varchar(13) NOT NULL , 
	`user_id` varchar(14) NOT NULL , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`usergroups_id`)
) 
ENGINE=InnoDB
COMMENT='Group yang dipunyai user, selain group utamanya';


ALTER TABLE `fgt_usergroups` ADD COLUMN IF NOT EXISTS  `usergroups_isdisabled` tinyint(1) NOT NULL DEFAULT 0 AFTER `usergroups_id`;
ALTER TABLE `fgt_usergroups` ADD COLUMN IF NOT EXISTS  `group_id` varchar(13) NOT NULL  AFTER `usergroups_isdisabled`;
ALTER TABLE `fgt_usergroups` ADD COLUMN IF NOT EXISTS  `user_id` varchar(14) NOT NULL  AFTER `group_id`;


ALTER TABLE `fgt_usergroups` MODIFY COLUMN IF EXISTS  `usergroups_isdisabled` tinyint(1) NOT NULL DEFAULT 0  AFTER `usergroups_id`;
ALTER TABLE `fgt_usergroups` MODIFY COLUMN IF EXISTS  `group_id` varchar(13) NOT NULL   AFTER `usergroups_isdisabled`;
ALTER TABLE `fgt_usergroups` MODIFY COLUMN IF EXISTS  `user_id` varchar(14) NOT NULL   AFTER `group_id`;



ALTER TABLE `fgt_usergroups` ADD KEY IF NOT EXISTS `group_id` (`group_id`);
ALTER TABLE `fgt_usergroups` ADD KEY IF NOT EXISTS `user_id` (`user_id`);

ALTER TABLE `fgt_usergroups` ADD CONSTRAINT `fk_fgt_usergroups_fgt_group` FOREIGN KEY IF NOT EXISTS  (`group_id`) REFERENCES `fgt_group` (`group_id`);
ALTER TABLE `fgt_usergroups` ADD CONSTRAINT `fk_fgt_usergroups_fgt_user` FOREIGN KEY IF NOT EXISTS (`user_id`) REFERENCES `fgt_user` (`user_id`);





CREATE TABLE IF NOT EXISTS `fgt_userfavemod` (
	`userfavemod_id` varchar(14) NOT NULL , 
	`title` varchar(100)  , 
	`modulefullname` varchar(100) NOT NULL , 
	`variancename` varchar(100) NOT NULL , 
	`forecolor` varchar(30)  , 
	`backcolor` varchar(30)  , 
	`icon` varchar(100)  , 
	`user_id` varchar(14) NOT NULL , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `userfavemod_pair` (`user_id`, `modulefullname`, `variancename`),
	PRIMARY KEY (`userfavemod_id`)
) 
ENGINE=InnoDB
COMMENT='Module favorit yang dipunyai user';


ALTER TABLE `fgt_userfavemod` ADD COLUMN IF NOT EXISTS  `title` varchar(100)   AFTER `userfavemod_id`;
ALTER TABLE `fgt_userfavemod` ADD COLUMN IF NOT EXISTS  `modulefullname` varchar(100) NOT NULL  AFTER `title`;
ALTER TABLE `fgt_userfavemod` ADD COLUMN IF NOT EXISTS  `variancename` varchar(100) NOT NULL  AFTER `modulefullname`;
ALTER TABLE `fgt_userfavemod` ADD COLUMN IF NOT EXISTS  `forecolor` varchar(30)   AFTER `variancename`;
ALTER TABLE `fgt_userfavemod` ADD COLUMN IF NOT EXISTS  `backcolor` varchar(30)   AFTER `forecolor`;
ALTER TABLE `fgt_userfavemod` ADD COLUMN IF NOT EXISTS  `icon` varchar(100)   AFTER `backcolor`;
ALTER TABLE `fgt_userfavemod` ADD COLUMN IF NOT EXISTS  `user_id` varchar(14) NOT NULL  AFTER `icon`;


ALTER TABLE `fgt_userfavemod` MODIFY COLUMN IF EXISTS  `title` varchar(100)    AFTER `userfavemod_id`;
ALTER TABLE `fgt_userfavemod` MODIFY COLUMN IF EXISTS  `modulefullname` varchar(100) NOT NULL   AFTER `title`;
ALTER TABLE `fgt_userfavemod` MODIFY COLUMN IF EXISTS  `variancename` varchar(100) NOT NULL   AFTER `modulefullname`;
ALTER TABLE `fgt_userfavemod` MODIFY COLUMN IF EXISTS  `forecolor` varchar(30)    AFTER `variancename`;
ALTER TABLE `fgt_userfavemod` MODIFY COLUMN IF EXISTS  `backcolor` varchar(30)    AFTER `forecolor`;
ALTER TABLE `fgt_userfavemod` MODIFY COLUMN IF EXISTS  `icon` varchar(100)    AFTER `backcolor`;
ALTER TABLE `fgt_userfavemod` MODIFY COLUMN IF EXISTS  `user_id` varchar(14) NOT NULL   AFTER `icon`;


ALTER TABLE `fgt_userfavemod` ADD CONSTRAINT `userfavemod_pair` UNIQUE IF NOT EXISTS  (`user_id`, `modulefullname`, `variancename`);

ALTER TABLE `fgt_userfavemod` ADD KEY IF NOT EXISTS `user_id` (`user_id`);

ALTER TABLE `fgt_userfavemod` ADD CONSTRAINT `fk_fgt_userfavemod_fgt_user` FOREIGN KEY IF NOT EXISTS (`user_id`) REFERENCES `fgt_user` (`user_id`);





