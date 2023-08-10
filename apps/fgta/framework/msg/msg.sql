-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `que_msg`;
-- drop table if exists `que_msgatch`;
-- drop table if exists `que_msgcopyto`;


CREATE TABLE IF NOT EXISTS `que_msg` (
	`msg_id` varchar(14) NOT NULL , 
	`msg_module` varchar(60)  , 
	`msg_batch` varchar(60)  , 
	`msg_descr` varchar(60)  , 
	`msgtype_id` varchar(3)  , 
	`msg_hp` varchar(60)  , 
	`msg_email` varchar(60)  , 
	`msg_nama` varchar(60)  , 
	`msg_subject` varchar(60)  , 
	`msg_body` varchar(2600)  , 
	`msg_isactive` tinyint(1) NOT NULL DEFAULT 0, 
	`msg_activedate` datetime  , 
	`msg_isprocess` tinyint(1) NOT NULL DEFAULT 0, 
	`msg_processbatch` varchar(14)  , 
	`msg_processdate` datetime  , 
	`msg_issend` tinyint(1) NOT NULL DEFAULT 0, 
	`server_messageid` varchar(160)  , 
	`msg_isfail` tinyint(1) NOT NULL DEFAULT 0, 
	`msg_failmessage` varchar(2600)  , 
	`msg_senddate` datetime  , 
	`msg_ismarktodel` tinyint(1) NOT NULL DEFAULT 0, 
	`msg_cbtable` varchar(60)  , 
	`msg_cbfieldkey` varchar(60)  , 
	`msg_cbfieldvalue` varchar(60)  , 
	`msg_cbfieldstatus` varchar(60)  , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`msg_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Antrian Message';


ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_module` varchar(60)   AFTER `msg_id`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_batch` varchar(60)   AFTER `msg_module`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_descr` varchar(60)   AFTER `msg_batch`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msgtype_id` varchar(3)   AFTER `msg_descr`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_hp` varchar(60)   AFTER `msgtype_id`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_email` varchar(60)   AFTER `msg_hp`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_nama` varchar(60)   AFTER `msg_email`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_subject` varchar(60)   AFTER `msg_nama`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_body` varchar(2600)   AFTER `msg_subject`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_isactive` tinyint(1) NOT NULL DEFAULT 0 AFTER `msg_body`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_activedate` datetime   AFTER `msg_isactive`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_isprocess` tinyint(1) NOT NULL DEFAULT 0 AFTER `msg_activedate`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_processbatch` varchar(14)   AFTER `msg_isprocess`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_processdate` datetime   AFTER `msg_processbatch`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_issend` tinyint(1) NOT NULL DEFAULT 0 AFTER `msg_processdate`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `server_messageid` varchar(160)   AFTER `msg_issend`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_isfail` tinyint(1) NOT NULL DEFAULT 0 AFTER `server_messageid`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_failmessage` varchar(2600)   AFTER `msg_isfail`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_senddate` datetime   AFTER `msg_failmessage`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_ismarktodel` tinyint(1) NOT NULL DEFAULT 0 AFTER `msg_senddate`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_cbtable` varchar(60)   AFTER `msg_ismarktodel`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_cbfieldkey` varchar(60)   AFTER `msg_cbtable`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_cbfieldvalue` varchar(60)   AFTER `msg_cbfieldkey`;
ALTER TABLE `que_msg` ADD COLUMN IF NOT EXISTS  `msg_cbfieldstatus` varchar(60)   AFTER `msg_cbfieldvalue`;


ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_module` varchar(60)   AFTER `msg_id`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_batch` varchar(60)   AFTER `msg_module`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_descr` varchar(60)   AFTER `msg_batch`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msgtype_id` varchar(3)   AFTER `msg_descr`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_hp` varchar(60)   AFTER `msgtype_id`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_email` varchar(60)   AFTER `msg_hp`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_nama` varchar(60)   AFTER `msg_email`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_subject` varchar(60)   AFTER `msg_nama`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_body` varchar(2600)   AFTER `msg_subject`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_isactive` tinyint(1) NOT NULL DEFAULT 0 AFTER `msg_body`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_activedate` datetime   AFTER `msg_isactive`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_isprocess` tinyint(1) NOT NULL DEFAULT 0 AFTER `msg_activedate`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_processbatch` varchar(14)   AFTER `msg_isprocess`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_processdate` datetime   AFTER `msg_processbatch`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_issend` tinyint(1) NOT NULL DEFAULT 0 AFTER `msg_processdate`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `server_messageid` varchar(160)   AFTER `msg_issend`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_isfail` tinyint(1) NOT NULL DEFAULT 0 AFTER `server_messageid`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_failmessage` varchar(2600)   AFTER `msg_isfail`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_senddate` datetime   AFTER `msg_failmessage`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_ismarktodel` tinyint(1) NOT NULL DEFAULT 0 AFTER `msg_senddate`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_cbtable` varchar(60)   AFTER `msg_ismarktodel`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_cbfieldkey` varchar(60)   AFTER `msg_cbtable`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_cbfieldvalue` varchar(60)   AFTER `msg_cbfieldkey`;
ALTER TABLE `que_msg` MODIFY COLUMN IF EXISTS  `msg_cbfieldstatus` varchar(60)   AFTER `msg_cbfieldvalue`;



ALTER TABLE `que_msg` ADD KEY IF NOT EXISTS `msgtype_id` (`msgtype_id`);

ALTER TABLE `que_msg` ADD CONSTRAINT `fk_que_msg_mst_msgtype` FOREIGN KEY IF NOT EXISTS  (`msgtype_id`) REFERENCES `mst_msgtype` (`msgtype_id`);





CREATE TABLE IF NOT EXISTS `que_msgatch` (
	`msgatch_id` varchar(14) NOT NULL , 
	`attachment_id` varchar(60)  , 
	`msg_id` varchar(14) NOT NULL , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `msgatch_pair` (`msg_id`, `attachment_id`),
	PRIMARY KEY (`msgatch_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Attachment Notifier';


ALTER TABLE `que_msgatch` ADD COLUMN IF NOT EXISTS  `attachment_id` varchar(60)   AFTER `msgatch_id`;
ALTER TABLE `que_msgatch` ADD COLUMN IF NOT EXISTS  `msg_id` varchar(14) NOT NULL  AFTER `attachment_id`;


ALTER TABLE `que_msgatch` MODIFY COLUMN IF EXISTS  `attachment_id` varchar(60)   AFTER `msgatch_id`;
ALTER TABLE `que_msgatch` MODIFY COLUMN IF EXISTS  `msg_id` varchar(14) NOT NULL  AFTER `attachment_id`;


ALTER TABLE `que_msgatch` ADD CONSTRAINT `msgatch_pair` UNIQUE IF NOT EXISTS  (`msg_id`, `attachment_id`);

ALTER TABLE `que_msgatch` ADD KEY IF NOT EXISTS `msg_id` (`msg_id`);

ALTER TABLE `que_msgatch` ADD CONSTRAINT `fk_que_msgatch_que_msg` FOREIGN KEY IF NOT EXISTS (`msg_id`) REFERENCES `que_msg` (`msg_id`);





CREATE TABLE IF NOT EXISTS `que_msgcopyto` (
	`msgcopyto_id` varchar(14) NOT NULL , 
	`msgcopy_id` varchar(2)  , 
	`msgcopyto_email` varchar(60)  , 
	`msgcopyto_nama` varchar(60)  , 
	`msg_id` varchar(14) NOT NULL , 
	`_createby` varchar(14) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(14)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `msgcopyto_pair` (`msg_id`, `msgcopyto_email`),
	PRIMARY KEY (`msgcopyto_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Copy Message Notifier (email)';


ALTER TABLE `que_msgcopyto` ADD COLUMN IF NOT EXISTS  `msgcopy_id` varchar(2)   AFTER `msgcopyto_id`;
ALTER TABLE `que_msgcopyto` ADD COLUMN IF NOT EXISTS  `msgcopyto_email` varchar(60)   AFTER `msgcopy_id`;
ALTER TABLE `que_msgcopyto` ADD COLUMN IF NOT EXISTS  `msgcopyto_nama` varchar(60)   AFTER `msgcopyto_email`;
ALTER TABLE `que_msgcopyto` ADD COLUMN IF NOT EXISTS  `msg_id` varchar(14) NOT NULL  AFTER `msgcopyto_nama`;


ALTER TABLE `que_msgcopyto` MODIFY COLUMN IF EXISTS  `msgcopy_id` varchar(2)   AFTER `msgcopyto_id`;
ALTER TABLE `que_msgcopyto` MODIFY COLUMN IF EXISTS  `msgcopyto_email` varchar(60)   AFTER `msgcopy_id`;
ALTER TABLE `que_msgcopyto` MODIFY COLUMN IF EXISTS  `msgcopyto_nama` varchar(60)   AFTER `msgcopyto_email`;
ALTER TABLE `que_msgcopyto` MODIFY COLUMN IF EXISTS  `msg_id` varchar(14) NOT NULL  AFTER `msgcopyto_nama`;


ALTER TABLE `que_msgcopyto` ADD CONSTRAINT `msgcopyto_pair` UNIQUE IF NOT EXISTS  (`msg_id`, `msgcopyto_email`);

ALTER TABLE `que_msgcopyto` ADD KEY IF NOT EXISTS `msgcopy_id` (`msgcopy_id`);
ALTER TABLE `que_msgcopyto` ADD KEY IF NOT EXISTS `msg_id` (`msg_id`);

ALTER TABLE `que_msgcopyto` ADD CONSTRAINT `fk_que_msgcopyto_mst_msgcopy` FOREIGN KEY IF NOT EXISTS  (`msgcopy_id`) REFERENCES `mst_msgcopy` (`msgcopy_id`);
ALTER TABLE `que_msgcopyto` ADD CONSTRAINT `fk_que_msgcopyto_que_msg` FOREIGN KEY IF NOT EXISTS (`msg_id`) REFERENCES `que_msg` (`msg_id`);





