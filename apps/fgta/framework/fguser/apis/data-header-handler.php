<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}



class fguser_headerHandler extends WebAPI  {

	public function buildListCriteriaValues(object &$options, array &$criteriaValues) : void {
		$criteriaValues['search'] = " 
			   A.user_id=:search 
			OR A.user_name LIKE CONCAT('%', :search, '%') 
			OR A.user_fullname LIKE CONCAT('%', :search, '%') 
		";
	}

}		
		
		
		