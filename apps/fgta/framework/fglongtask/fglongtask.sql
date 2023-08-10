-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `fgt_longtask`;


CREATE TABLE IF NOT EXISTS `fgt_longtask` (
	`longtask_id` varchar(14)  , 
	`longtask_name` varchar(90)  , 
	`longtask_start` datetime  , 
	`longtask_expired` datetime  , 
	`longtask_progress` int(4) NOT NULL DEFAULT 0, 
	`longtask_taskdescr` varchar(255)  , 
	`longtask_logfile` varchar(255)  , 
	`longtask_lastprogressid` varchar(14)  , 
	`longtask_isrunning` tinyint(1) NOT NULL DEFAULT 0, 
	`longtask_isrequestcancel` tinyint(1) NOT NULL DEFAULT 0, 
	`longtask_iscanceled` tinyint(1) NOT NULL DEFAULT 0, 
	`longtask_iscomplete` tinyint(1) NOT NULL DEFAULT 0, 
	`longtask_iserror` tinyint(1) NOT NULL DEFAULT 0, 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`longtask_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Long Task';


ALTER TABLE `fgt_longtask` ADD COLUMN IF NOT EXISTS  `longtask_name` varchar(90)   AFTER `longtask_id`;
ALTER TABLE `fgt_longtask` ADD COLUMN IF NOT EXISTS  `longtask_start` datetime   AFTER `longtask_name`;
ALTER TABLE `fgt_longtask` ADD COLUMN IF NOT EXISTS  `longtask_expired` datetime   AFTER `longtask_start`;
ALTER TABLE `fgt_longtask` ADD COLUMN IF NOT EXISTS  `longtask_progress` int(4) NOT NULL DEFAULT 0 AFTER `longtask_expired`;
ALTER TABLE `fgt_longtask` ADD COLUMN IF NOT EXISTS  `longtask_taskdescr` varchar(255)   AFTER `longtask_progress`;
ALTER TABLE `fgt_longtask` ADD COLUMN IF NOT EXISTS  `longtask_logfile` varchar(255)   AFTER `longtask_taskdescr`;
ALTER TABLE `fgt_longtask` ADD COLUMN IF NOT EXISTS  `longtask_lastprogressid` varchar(14)   AFTER `longtask_logfile`;
ALTER TABLE `fgt_longtask` ADD COLUMN IF NOT EXISTS  `longtask_isrunning` tinyint(1) NOT NULL DEFAULT 0 AFTER `longtask_lastprogressid`;
ALTER TABLE `fgt_longtask` ADD COLUMN IF NOT EXISTS  `longtask_isrequestcancel` tinyint(1) NOT NULL DEFAULT 0 AFTER `longtask_isrunning`;
ALTER TABLE `fgt_longtask` ADD COLUMN IF NOT EXISTS  `longtask_iscanceled` tinyint(1) NOT NULL DEFAULT 0 AFTER `longtask_isrequestcancel`;
ALTER TABLE `fgt_longtask` ADD COLUMN IF NOT EXISTS  `longtask_iscomplete` tinyint(1) NOT NULL DEFAULT 0 AFTER `longtask_iscanceled`;
ALTER TABLE `fgt_longtask` ADD COLUMN IF NOT EXISTS  `longtask_iserror` tinyint(1) NOT NULL DEFAULT 0 AFTER `longtask_iscomplete`;


ALTER TABLE `fgt_longtask` MODIFY COLUMN IF EXISTS  `longtask_name` varchar(90)    AFTER `longtask_id`;
ALTER TABLE `fgt_longtask` MODIFY COLUMN IF EXISTS  `longtask_start` datetime    AFTER `longtask_name`;
ALTER TABLE `fgt_longtask` MODIFY COLUMN IF EXISTS  `longtask_expired` datetime    AFTER `longtask_start`;
ALTER TABLE `fgt_longtask` MODIFY COLUMN IF EXISTS  `longtask_progress` int(4) NOT NULL DEFAULT 0  AFTER `longtask_expired`;
ALTER TABLE `fgt_longtask` MODIFY COLUMN IF EXISTS  `longtask_taskdescr` varchar(255)    AFTER `longtask_progress`;
ALTER TABLE `fgt_longtask` MODIFY COLUMN IF EXISTS  `longtask_logfile` varchar(255)    AFTER `longtask_taskdescr`;
ALTER TABLE `fgt_longtask` MODIFY COLUMN IF EXISTS  `longtask_lastprogressid` varchar(14)    AFTER `longtask_logfile`;
ALTER TABLE `fgt_longtask` MODIFY COLUMN IF EXISTS  `longtask_isrunning` tinyint(1) NOT NULL DEFAULT 0  AFTER `longtask_lastprogressid`;
ALTER TABLE `fgt_longtask` MODIFY COLUMN IF EXISTS  `longtask_isrequestcancel` tinyint(1) NOT NULL DEFAULT 0  AFTER `longtask_isrunning`;
ALTER TABLE `fgt_longtask` MODIFY COLUMN IF EXISTS  `longtask_iscanceled` tinyint(1) NOT NULL DEFAULT 0  AFTER `longtask_isrequestcancel`;
ALTER TABLE `fgt_longtask` MODIFY COLUMN IF EXISTS  `longtask_iscomplete` tinyint(1) NOT NULL DEFAULT 0  AFTER `longtask_iscanceled`;
ALTER TABLE `fgt_longtask` MODIFY COLUMN IF EXISTS  `longtask_iserror` tinyint(1) NOT NULL DEFAULT 0  AFTER `longtask_iscomplete`;









