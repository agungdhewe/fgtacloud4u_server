-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `fgt_role`;
-- drop table if exists `fgt_rolepermission`;


CREATE TABLE IF NOT EXISTS `fgt_role` (
	`role_id` varchar(30) NOT NULL , 
	`role_name` varchar(90) NOT NULL , 
	`role_descr` varchar(255)  , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `role_name` (`role_name`),
	PRIMARY KEY (`role_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Role';


ALTER TABLE `fgt_role` ADD COLUMN IF NOT EXISTS  `role_name` varchar(90) NOT NULL  AFTER `role_id`;
ALTER TABLE `fgt_role` ADD COLUMN IF NOT EXISTS  `role_descr` varchar(255)   AFTER `role_name`;


ALTER TABLE `fgt_role` MODIFY COLUMN IF EXISTS  `role_name` varchar(90) NOT NULL  AFTER `role_id`;
ALTER TABLE `fgt_role` MODIFY COLUMN IF EXISTS  `role_descr` varchar(255)   AFTER `role_name`;


ALTER TABLE `fgt_role` ADD CONSTRAINT `role_name` UNIQUE IF NOT EXISTS  (`role_name`);




INSERT INTO fgt_role (`role_id`, `role_name`, `_createby`, `_createdate`) VALUES ('UPM', 'UPM', 'root', NOW());
INSERT INTO fgt_role (`role_id`, `role_name`, `_createby`, `_createdate`) VALUES ('EDI', 'EDITOR', 'root', NOW());
INSERT INTO fgt_role (`role_id`, `role_name`, `_createby`, `_createdate`) VALUES ('REP', 'REPORTER', 'root', NOW());
INSERT INTO fgt_role (`role_id`, `role_name`, `_createby`, `_createdate`) VALUES ('CAM', 'CAMERA PERSON', 'root', NOW());
INSERT INTO fgt_role (`role_id`, `role_name`, `_createby`, `_createdate`) VALUES ('PRO', 'PRODUCER', 'root', NOW());



CREATE TABLE IF NOT EXISTS `fgt_rolepermission` (
	`rolepermission_id` varchar(14) NOT NULL , 
	`permission_id` varchar(60) NOT NULL , 
	`role_id` varchar(30) NOT NULL , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `rolepermission_pair` (`role_id`, `permission_id`),
	PRIMARY KEY (`rolepermission_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Permission Role';


ALTER TABLE `fgt_rolepermission` ADD COLUMN IF NOT EXISTS  `permission_id` varchar(60) NOT NULL  AFTER `rolepermission_id`;
ALTER TABLE `fgt_rolepermission` ADD COLUMN IF NOT EXISTS  `role_id` varchar(30) NOT NULL  AFTER `permission_id`;


ALTER TABLE `fgt_rolepermission` MODIFY COLUMN IF EXISTS  `permission_id` varchar(60) NOT NULL  AFTER `rolepermission_id`;
ALTER TABLE `fgt_rolepermission` MODIFY COLUMN IF EXISTS  `role_id` varchar(30) NOT NULL  AFTER `permission_id`;


ALTER TABLE `fgt_rolepermission` ADD CONSTRAINT `rolepermission_pair` UNIQUE IF NOT EXISTS  (`role_id`, `permission_id`);

ALTER TABLE `fgt_rolepermission` ADD KEY IF NOT EXISTS `permission_id` (`permission_id`);
ALTER TABLE `fgt_rolepermission` ADD KEY IF NOT EXISTS `role_id` (`role_id`);

ALTER TABLE `fgt_rolepermission` ADD CONSTRAINT `fk_fgt_rolepermission_fgt_permission` FOREIGN KEY IF NOT EXISTS  (`permission_id`) REFERENCES `fgt_permission` (`permission_id`);
ALTER TABLE `fgt_rolepermission` ADD CONSTRAINT `fk_fgt_rolepermission_fgt_role` FOREIGN KEY IF NOT EXISTS (`role_id`) REFERENCES `fgt_role` (`role_id`);





