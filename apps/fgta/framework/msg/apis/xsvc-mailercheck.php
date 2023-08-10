<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __DIR__ . '/xapi.base.php';


$API = new class extends msgBase {
	function __construct() {
		parent::__construct();
	}

	
	public function execute() {
		try {
			if (!defined('FGTA4_MAILER')) {
				throw 'FGTA4_MAILER belum di define!';
			}

			$sql = "update que_msg set msg_isfail=1, msg_failmessage=:message where server_messageid=:messageid ";
			$stmt = $this->db->prepare($sql);

			$MAILERNAME = $GLOBALS['MAINMAILER'];
			$MAILSETTING = FGTA4_MAILER[$MAILERNAME];
			$imap = \imap_open($MAILSETTING['imap_inbox'], $MAILSETTING['username'], $MAILSETTING['password']);
			
			try {
				$result  = \imap_search($imap, 'TEXT "X-Mailer-Module: fgta4mailer-module"');
				if (is_array($result) && count($result)>=0){
					foreach($result as $key=>$msgno) {
						$overview = \imap_fetch_overview($imap, $msgno, 0);
						$subject = $overview[0]->subject;
						if ($subject=="Undelivered Mail Returned to Sender") {
							$body = \imap_body($imap, $msgno);
	
							// echo $body;
							// get Message-ID
							$pattern = '/Message-ID: <(.+?)>/m';
							preg_match($pattern, $body, $matches);
							if (count($matches)>=1) {

								$MessageID = "<".$matches[1].">";

								$pattern = '/The mail system([\s\S]*?)--/m';
								preg_match($pattern, $body, $matches);
								$failmessage = '';
								if (count($matches)>=1) {
									$failmessage = trim($matches[1]);
								}

								echo $failmessage;
								$stmt->execute([
									':messageid' => $MessageID,
									':message' => $failmessage
								]);

								\imap_delete($imap, $msgno);

							}
						}
					}
					\imap_expunge($imap);
				}

			} catch (\Exception $ex) {
				throw $ex;
			} finally {
				\imap_close($imap);
			}


			
			
		} catch (\Exception $ex) {
			throw $ex;
		}


		
	}
	

	/*
	public function execute() {
		$batch = uniqid();
		$filepath = __LOCALDB_DIR . '/tempmsg' . '/undeliver.txt';


		try {

			if (!defined('FGTA4_MAILER')) {
				throw 'FGTA4_MAILER belum di define!';
			}
			
			$MAILSETTING = FGTA4_MAILER['NOREPLY'];

			$imap = \imap_open($MAILSETTING['imap_inbox'], $MAILSETTING['username'], $MAILSETTING['password']);
			$fp = fopen($filepath, 'a+');
			fputs($fp, "\r\n"); 
			
			try {
				$result  = \imap_search($imap, 'SUBJECT "Undelivered Mail Returned to Sender"');
				if (is_array($result) && count($result)>=0){
					$total = count($result);
					$i=0;
					foreach($result as $key=>$msgno) {
						$i++;
						$body = \imap_body($imap, $msgno);
						
						$pattern = '/Your e-receipt Invoice \((.+?)\)/im';
						preg_match($pattern, $body, $matches);

						if (count($matches)>=2) {
							$bon_id = $matches[1];
							if ($bon_id!="") {
								$pattern = '/To: (.+?) <(.+?)>/im';
								preg_match($pattern, $body, $matches);
								$nama = $matches[1];
								$email = $matches[2];
		
								$linedata = "$batch|$total|$i|$bon_id|$nama|$email\r\n";
								fputs($fp, $linedata); 
								echo $linedata;
	
								// \imap_delete($imap, $msgno);
							}
						} else {
							echo "not match ($i) [$total]\r\n";
						}
						
					}
					echo "Expunging imap..";
					// \imap_expunge($imap);
					echo "done.";
				}


			} catch (\Exception $ex) {
				throw $ex;
			} finally{
				imap_close($imap);
				fclose($fp);
			}
		} catch (\Exception $ex) {
			throw $ex;
		}
	}
	*/

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
