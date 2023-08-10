<?php namespace FGTA4;

if (!defined('__TEMPLATE_LOCATION')) {
	define('__TEMPLATE_DIR', __ROOT_DIR . "/public/templates");
} else {
	define('__TEMPLATE_DIR', __ROOT_DIR . "/apps/" . __TEMPLATE_LOCATION);
}


class setting {
	public static string $TemplateUse;
	public static string $TemplateDir;
	public static string $TemplateFile;
	public static string $TemplateLocationDir;
	public static string $BaseTitle;


	private static string $DefaultTemplateName = 'fgta-erp';
	private static string $DefaultTemplateLocationDir = __TEMPLATE_DIR; //__ROOT_DIR . "/public/templates";


	public static function init() : void {
		self::$TemplateUse = self::$DefaultTemplateName;
		self::$TemplateLocationDir = self::$DefaultTemplateLocationDir;
		self::$TemplateDir = self::$TemplateLocationDir . '/' . self::$TemplateUse;
	}

	public static function useTemplate(string $template_name, ?string $template_dir=null) : void {
		self::$TemplateUse = $template_name;
		if ($template_dir!=null) {
			self::$TemplateLocationDir = $template_dir;
		} 
		self::$TemplateDir = self::$TemplateLocationDir . '/' . self::$TemplateUse;
		if (!is_dir(self::$TemplateDir)) {
			die("Template: '". self::$TemplateDir ."' not found, please check server environtment setting.");
		}
	
	}

	public static function setTemplateFile(string $template_file) : void {
		self::$TemplateFile = $template_file;
	}

	public static function getTemplate() : string {	
		return implode('/', [self::$TemplateDir, self::$TemplateFile]);
	}
}
