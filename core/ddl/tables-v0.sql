CREATE TABLE `fgt_group` (
 `group_id` varchar(13) NOT NULL,
 `group_name` varchar(30) DEFAULT NULL,
 `group_descr` varchar(255) DEFAULT NULL,
 `group_disabled` tinyint(1) NOT NULL DEFAULT 1,
 `group_menu` varchar(90) NOT NULL,
 `_createby` varchar(30) NOT NULL,
 `_createdate` datetime NOT NULL DEFAULT current_timestamp(),
 `_modifyby` varchar(30) DEFAULT NULL,
 `_modifydate` datetime DEFAULT NULL,
 PRIMARY KEY (`group_id`),
 UNIQUE KEY `group_name` (`group_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Daftarg Group / Role dari user';

CREATE TABLE `fgt_user` (
 `user_id` varchar(13) NOT NULL,
 `user_name` varchar(30) DEFAULT NULL,
 `user_fullname` varchar(90) NOT NULL,
 `user_email` varchar(150) DEFAULT NULL,
 `user_password` varchar(255) DEFAULT NULL,
 `user_disabled` tinyint(1) NOT NULL DEFAULT 1,
 `group_id` varchar(13) NOT NULL,
 `_createby` varchar(30) NOT NULL,
 `_createdate` datetime NOT NULL DEFAULT current_timestamp(),
 `_modifyby` varchar(30) DEFAULT NULL,
 `_modifydate` datetime DEFAULT NULL,
 PRIMARY KEY (`user_id`),
 UNIQUE KEY `user_name` (`user_name`),
 UNIQUE KEY `user_email` (`user_email`),
 KEY `group_id` (`group_id`),
 CONSTRAINT `fk_fgt_user_fgt_group` FOREIGN KEY (`group_id`) REFERENCES `fgt_group` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Daftar User';


CREATE TABLE `xlog` (
 `tablename` varchar(90) NOT NULL,
 `id` varchar(90) NOT NULL,
 `action` varchar(30) NOT NULL,
 `note` varchar(255) NOT NULL,
 `remoteip` varchar(15) NOT NULL,
 `user_id` varchar(13) NOT NULL,
 `module` varchar(90) NOT NULL,
 `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
 `rowid` varchar(13) NOT NULL,
 PRIMARY KEY (`rowid`),
 KEY `idx_xlog_tablename_id` (`tablename`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1