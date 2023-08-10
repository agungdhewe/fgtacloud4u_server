CREATE TABLE `fgt_formgen` (
	`id` varchar(10) NOT NULL , 
	`nama` varchar(90)  , 
	`alamat` varchar(255)  , 
	`disabled` tinyint(1) NOT NULL DEFAULT 1, 
	`city` varchar(10)  , 
	`tanggal` date NOT NULL , 
	`gender` varchar(1) NOT NULL , 
	`_createby` varchar(30) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(30)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`id`)
) 
ENGINE=InnoDB DEFAULT CHARSET=latin1
COMMENT=''


CREATE TABLE `fgt_formgentelp` (
	`id` varchar(10) NOT NULL , 
	`line` int(8) NOT NULL , 
	`telp` varchar(255)  , 
	PRIMARY KEY (`id`, `line`)
) 
ENGINE=InnoDB DEFAULT CHARSET=latin1
COMMENT=''


