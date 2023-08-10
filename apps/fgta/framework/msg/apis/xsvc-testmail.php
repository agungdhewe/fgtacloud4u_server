<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __DIR__ . '/xapi.base.php';



use \PHPMailer\PHPMailer\PHPMailer;


$API = new class extends msgBase {
	function __construct() {
		parent::__construct();
	}

	public function execute() {



		try {

			if (!defined('FGTA4_MAILER')) {
				throw 'FGTA4_MAILER belum di define!';
			}
			
			$MAILERNAME = $GLOBALS['MAINMAILER'];
			$MAILSETTING = FGTA4_MAILER[$MAILERNAME];

			$mailer = new PHPMailer(true);
			$mailer->Host = $MAILSETTING['host'];
			$mailer->Port = $MAILSETTING['port'];
			$mailer->Username = $MAILSETTING['username'];
			$mailer->Password = $MAILSETTING['password'];
			$MAILSETTING['setup']($mailer);

			$to = 'agung_dhewe@yahoo.com';
			$toname = "Agung Nugroho";

			$mailer->setFrom($MAILSETTING['email'], $MAILSETTING['fromname']);
			$mailer->addAddress($to, $toname);
			$mailer->isHTML(true); 
			$mailer->Subject = "test email saja";
			$mailer->Body    = "ini <b>test</b> email ya...<br>ok ok";
			
			$breaks = array("<br />","<br>","<br/>");  
			$mailer->AltBody = strip_tags(str_ireplace($breaks, "\r\n", $mailer->Body));

			echo "testing sending mail to $to ... ";
			$mailer->send();
			echo "done.\r\n";
			$MessageID = $mailer->getLastMessageID();
			echo "$MessageID";
			echo "\r\n\r\n";


		} catch (\Exception $ex) {
			throw $ex;
		}
	}

};



/****
 * 
 * untuk ambil invoice yg tidak terkirim
 * 
 * $result  = \imap_search($imap, 'TEXT "Subject: Your e-receipt Invoice"');
 * 
 * $pattern = '/Your e-receipt Invoice \((.+?)\)/im';
 * preg_match($pattern, $str, $matches);
 * echo $matches[1];  // nomor SL yang tidak berhail terkirim
 * 
 * Nama dan email yang salah
 * $pattern = '/To: (.+?) <(.+?)>/im';
 * preg_match($pattern, $str, $matches);
 * $matches[1] // nama
 * $matches[2] // email
 */
