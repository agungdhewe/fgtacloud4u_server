<?php namespace FGTA4\module; if (!defined('FGTA4')) { die('Forbiden'); } 


class editorial_pageHandler {
	public function LoadPage() {

		$this->caller->preloadscripts = [
			'jslibs/easyui/jquery.texteditor.js'
		];

		$this->caller->preloadstyles = [
			'jslibs/easyui/texteditor.css'
		];
	}
}