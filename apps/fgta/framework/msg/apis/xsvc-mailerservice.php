<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __ROOT_DIR.'/core/couchdbclient.php';
require_once __DIR__ . '/xapi.base.php';


use \FGTA4\CouchDbClient;
use \FGTA4\exceptions\WebException;
use \PHPMailer\PHPMailer\PHPMailer;

$API = new class extends msgBase {
	function __construct() {
		parent::__construct();
		$this->cdb = new CouchDbClient((object)DB_CONFIG['FGTAFS']);
	}

	public function execute() {
		$userdata = $this->auth->session_get_user();
		if ($userdata->username!='system') {
			throw new \Exception('Executed by system only');
		}
		
		
		$loopinterval = 600; // 10 menit
		$stmtPending = $this->stmt_getPendingQueuedMessage();
		$stmtMark = $this->stmt_markPendingMessage();
		$stmtMessage = $this->stmt_getMessageToProcess();
		$stmtMessageCopy = $this->stmt_getMessageCopy();
		$stmtMessageAttach =  $this->stmt_getMessageAttachment();
		$stmtSetProcessStatus = $this->stmt_setProcessStatus();
		$stmtSetSentStatus = $this->stmt_setSentStatus();

		while (true) {
			$process_id = uniqid(); 
			$stmtPending->execute();
			$rowsPending = $stmtPending->fetchall();
			foreach ($rowsPending as $row) {
				$msg_id = $row['msg_id'];

				$stmtMark->execute([
					':msg_processbatch' => $process_id,
					':msg_id' => $msg_id
				]);
			}

			// kerjakan yang sudah di marking
			while (true) {
				$stmtMessage->execute([
					':msg_processbatch' => $process_id
				]);
				$msg = $stmtMessage->fetch();
				if ($msg==null) {
					break;
				}

				$msg_id = $msg['msg_id'];
				$msg_cbtable = $msg['msg_cbtable']; 
				$msg_cbfieldkey = $msg['msg_cbfieldkey'];
				$msg_cbfieldvalue = $msg['msg_cbfieldvalue'];
				$msg_cbfieldstatus = $msg['msg_cbfieldstatus'];

				$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,0);
				$this->db->beginTransaction();
				try {
					$stmtSetProcessStatus->execute([':msg_id'=>$msg_id]); // update ke process = 1
					$data = [
						'msg_id' => $msg['msg_id'],
						'msg_email' => $msg['msg_email'],
						'msg_nama' => $msg['msg_nama'],
						'msg_subject' => $msg['msg_subject'],
						'mst_body' => $msg['msg_body'],
						'attachment' => [],
						'copyto' => []
					];

					$stmtMessageAttach->execute([':msg_id'=>$msg_id]);
					$attachments = $stmtMessageAttach->fetchall();
					foreach ($attachments  as $atch) {
						$data['attachment'][] = $atch['attachment_id'];
					}
					
					$stmtMessageCopy->execute([':msg_id'=>$msg_id]);
					$copyto = $stmtMessageCopy->fetchall();
					foreach ($copyto  as $copy) {
						$data['copyto'][] = [
							'msgcopy_id' => $copy['msgcopy_id'],
							'msgcopyto_email' => $copy['msgcopyto_email'],
							'msgcopyto_nama' => $copy['msgcopyto_nama'],
						];
					}

					$MessageID = $this->SendMessage($data);
					$stmtSetSentStatus->execute([
						':msg_id'=>$msg_id,
						':server_messageid' => $MessageID
					]);

					if ($msg_cbtable!=='') {
						$this->log('callback update table');
						$sqlCb = "update $msg_cbtable set $msg_cbfieldstatus=1 where $msg_cbfieldkey = :key";
						$stmtCb = $this->db->prepare($sqlCb);
						$stmtCb->execute([
							':key' => $msg_cbfieldvalue
						]);
					}

					$this->db->commit();
					sleep(3);
				} catch (\Exception $ex) {
					$this->db->rollBack();
					throw $ex;
				} finally {
					$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,1);
				}


				
			}


			break;
			sleep($loopinterval);
		}

	}

	public function SendMessage($data) {
		$attachedfiles_temp = [];

		try {
			$mailer = $this->CreateMailer();
			$mailer->addCustomHeader('X-Mailer-Module', 'fgta4mailer-module');
			$mailer->addAddress($data['msg_email'], $data['msg_nama']);
			$mailer->isHTML(true); 
			$mailer->Subject = $data['msg_subject'];
			$mailer->Body    = $data['mst_body'];
			$mailer->AltBody = strip_tags(nl2br($data['mst_body']));

			// copy message
			foreach ($data['copyto'] as $copyto) {
				$this->log($copyto);
				$msgcopy_id = $copyto['msgcopy_id'];
				if ($msgcopy_id=='CC') {
					$mailer->addCC($copyto['msgcopyto_email'], $copyto['msgcopyto_nama']);
				} elseif ($msgcopy_id=='BC') {
					$mailer->addBCC($copyto['msgcopyto_email'], $copyto['msgcopyto_nama']);
				} else {
					$mailer->addAddress($copyto['msgcopyto_email'], $copyto['msgcopyto_nama']);
				} 
			}
			
			//attachment
			foreach ($data['attachment'] as $file_id) {
				$temp = $this->getAttachmentFile($file_id);
				if ($temp==null) {
					throw new \Exception('Cannot read attachment');
				}
				$tempfilepath = $temp['path'];
				$mailer->addAttachment($temp['path'], basename($temp['filename']));  
				$attachedfiles_temp[] = $temp;
			}

			$mailer->send();
			$MessageID = $mailer->getLastMessageID();

			//  hapus temp filepath
			foreach ($attachedfiles_temp as $temp) {
				$tempfilepath = $temp['path'];
				unlink($tempfilepath);
			}

			return $MessageID;
		} catch (\Exception $ex) {
			throw $ex;
		}			
	}

	public function getAttachmentFile($file_id) {
		$tempfilepathname = "tmp_" . uniqid();
		$filepath = __LOCALDB_DIR . '/tempmsg' . '/' . $tempfilepathname;
		try {

			try { 
				$id = $file_id;
				$doc = $this->cdb->getAttachment($id, 'filedata'); 
			} catch (\Exception $ex) {
				$doc = null;
			}

			if ($doc!=null) {
				$filename = $doc->name;
				$output_file = $filepath . "-" . $filename;
				
				$base64_attachmentdata = $doc->attachmentdata;
				$type = $doc->type;
				$ifp = fopen( $output_file, 'wb'); 
				$attachmentdata = explode( ',', $base64_attachmentdata);
				$filedata = base64_decode($attachmentdata[1]);
				fwrite( $ifp, $filedata);
				fclose($ifp);
				
				$temp = [
					'path' => $output_file,
					'filename' => $filename
				];
	
				return $temp;
			}

		} catch (\Exception $ex) {
			debug::log($ex->getMessage());
		}
	}


	public function CreateMailer() {
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

			$mailer->setFrom($MAILSETTING['email'], $MAILSETTING['fromname']);

			return $mailer;
		} catch (\Exception $ex) {
			debug::log($ex->getMessage());
		}
	}	

	public function stmt_getPendingQueuedMessage() {
		$sql = "
			select 
			msg_id
			from que_msg
			WHERE 
				msgtype_id='EML'
			and msg_issend = 0
			and msg_isactive = 1
			and msg_activedate<=NOW() 
			limit 100;		
		";
		$stmt = $this->db->prepare($sql);
		return $stmt;
	}

	public function stmt_markPendingMessage() {
		$sql = "
			update que_msg set msg_processbatch = :msg_processbatch, msg_isprocess=0 where msg_id = :msg_id
		";
		$stmt = $this->db->prepare($sql);
		return $stmt;
	}


	public function stmt_getMessageToProcess() {
		$sql = "
			select 
			msg_id, msg_email, msg_nama, msg_subject, msg_body, 
			msg_cbtable, msg_cbfieldkey, msg_cbfieldvalue, msg_cbfieldstatus
			from que_msg where msg_processbatch=:msg_processbatch and msg_isprocess=0 limit 1
		";
		$stmt = $this->db->prepare($sql);
		return $stmt;
	}

	public function stmt_getMessageAttachment() {
		$sql = "
			select attachment_id from que_msgatch where msg_id = :msg_id 
		";
		$stmt = $this->db->prepare($sql);
		return $stmt;
	}

	public function stmt_getMessageCopy() {
		$sql = "
			select
			msgcopyto_email, msgcopyto_nama, msgcopy_id
			from 
			que_msgcopyto 
			where msg_id = :msg_id 
		";
		$stmt = $this->db->prepare($sql);
		return $stmt;
	}

	public function stmt_setProcessStatus() {
		$sql = "
			update que_msg set msg_isprocess=1 where msg_id=:msg_id
		";
		$stmt = $this->db->prepare($sql);
		return $stmt;		
	}

	public function stmt_setSentStatus() {
		$sql = "
			update que_msg set msg_issend=1, server_messageid=:server_messageid where msg_id=:msg_id
		";
		$stmt = $this->db->prepare($sql);
		return $stmt;	
	}

};