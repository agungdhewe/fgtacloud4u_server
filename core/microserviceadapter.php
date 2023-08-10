<?php namespace FGTA4\utils;

if (!defined('FGTA4')) {
	die('Forbiden');
}

use \FGTA4\exceptions\WebException;



class MicroServiceAdapter {
	private $server_pid;
	private $process_id;
	 

	function __construct($host, $port, $process_id, $data) {
		// Dapatkan Server PID
		$service_url = $host . ":" . $port . "/init?process_id=" . $process_id;
		$ch = \curl_init(); 
		\curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
		\curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));   
		\curl_setopt($ch, CURLOPT_URL, $service_url); 
		\curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
		$output = \curl_exec($ch);			
		\curl_close($ch); 
		$result = json_decode($output);
		if ($result==null) { throw new \Exception('mikroservice error'); } 


		
		$this->server_pid = $result->server_pid;
		$this->process_id =  $result->process_id;
		$this->host = $host;
		$this->port = $port;
	
		$error = property_exists($result, "error") ? $result->error : false;
		if ($error) {
			$errormessage = property_exists($result, "errormessage") ? " : " . $result->errormessage : "";
			throw new \Exception("Error on init microservice" . $errormessage);
		}

	}


	public function execute($command, $options) {
		$method = property_exists($options, "method") ? $options->method : 'GET';
		$data = property_exists($options, "data") ? $options->data : null;

		if ($data!=null & $method!="POST") {
			throw new \Exception('Pengiriman data harus menggunakan method POST');
		}

		$json_data = json_encode($data);
		$service_url = $this->host . ":" . $this->port . "/$command?process_id=" . $this->process_id;
		
		$result = new \stdClass;
		
		$ch = \curl_init(); 
		if ($method=="POST") {
			\curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");  
			\curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data)); 
		}

		\curl_setopt($ch, CURLOPT_URL, $service_url); 
		\curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
		$output = \curl_exec($ch);			
		
		\curl_close($ch); 
		$result = json_decode($output);

		$error = property_exists($result, "error") ? $result->error : false;
		if ($error) {
			$errormessage = property_exists($result, "errormessage") ? " : " . $result->errormessage : "";
			throw new \Exception("Eror on execute $command" . $errormessage);
		}

		return $result;
	}

	public function getServerPid() {
		return $this->server_pid;
	}

	public function getProcessId() {
		return $this->process_id;
	}
}