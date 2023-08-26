<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}



class fgoptionlist_headerHandler extends WebAPI  {
	public function buildListCriteriaValues(object &$options, array &$criteriaValues) : void {
		$criteriaValues['optionlist_tag'] = " A.optionlist_tag LIKE CONCAT('%', :optionlist_tag, '%') "; 
	}
}


		
		
		