<?php require_once dirname(__FILE__).'/<!--__BASENAME__-->-list.phtml' ?>
<?php require_once dirname(__FILE__).'/<!--__BASENAME__-->-edit.phtml' ?>
<!--__PHTML_REQUIRED__-->


<?php
$customrecordstatus = __DIR__.'/<!--__BASENAME__-->-customrecordstatus.phtml'; 
if (is_file($customrecordstatus)) {
	include $customrecordstatus;
} else { ?>
<!--__RECORDSTATUS__-->
<?php } ?>
