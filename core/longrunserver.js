'use strict'

const path = require('path')
const http=require('http')
const url = require('url');
const server = http.createServer()
const server_pid = process.pid
const service = require(path.join(__dirname, 'longrunservice.js'))
const cleaner = require(path.join(__dirname, 'longruncleaner.js'))


const processlist = {}
const finishedprocess = []

service.Construct({
	processlist: processlist,
	finishedprocess: finishedprocess
})

cleaner.Construct({
	processlist: processlist,
	finishedprocess: finishedprocess
})


server.on('request', async (req, res) => {
	await Server_Request(req, res)
})

server.on('error', async (err)=>{
	await Server_Error(err)
})

server.on('exit', async (exitcode)=>{
	await Server_Exit(exitcode)
})



module.exports = {
	Start : (options) => { DoLongRun(options) }
}




function DoLongRun(options) {
	var port = options.port
	var workerpath = options.workerpath

	service.setWorkerPath(workerpath)

	// Mulai Servernya
	process.stdout.write(`starting service at port \x1b[1m${port}\x1b[0m... `);
	server.listen(port, ()=> {
		console.log(`\x1b[32mOK\x1b[0m`)
		console.log(`PID: ${server_pid}`)
		cleaner.Start()
	})
}


async function Server_Exit(exitcode) {
	console.log('SERVER TERMINATED')
}

async function Server_Error(err) {
	console.log(`\x1b[31mError\x1b[0m`)
	console.log(err.message)
	console.log('\n')
	process.exit(0)
}


async function Server_Request(req, res) {
	var urlinfo = url.parse(req.url, true);
	var pathname = urlinfo.pathname
	var querydata = urlinfo.query
	var process_id = querydata.process_id

	var result = {}
	var defresult = {
		descr: 'fgtacloud4u longrung microserver'
	}
	var svc = service.CreateService(process_id, req)


	if (req.method==='POST') {
		req.PostData = await GetPostData(req)
	}


	// console.log(pathname)
	var result_as_json = true
	try {
		switch (pathname) {
			case "/init":
				result = await svc.init()
				break
			case "/start":
				result = await svc.start()
				break;
			case "/status" :
				result = await svc.status()
				break;
			case "/list" :
				result_as_json = false
				result = await svc.list()
				break;	
			case "/kill" :
				var target_process_id = querydata.target_process_id
				result_as_json = false
				result = await svc.kill(target_process_id)	
				break
			default :
				result = defresult
		}
	
		if (result==null || result === undefined) {
			result = defresult
		}
	} catch (err) {
		var error = new Error(err)
		if (typeof result === 'object') {
			result.error = true
			result.errormessage = error.message
		}
	}

	if (typeof result === 'object') {
		result.server_pid = server_pid
		result.process_id = process_id
	}


	var server_response
	if (result_as_json) {
		server_response = JSON.stringify(result)
		res.writeHead(200, {"Content-Type" : "application/json"});
	} else {
		server_response = result
		res.writeHead(200, {"Content-Type" : "text/html"});
	}

	
	res.end(server_response);		
}





async function GetPostData(request) {
	return new Promise((resolve) => {
		const FORM_URLENCODED = 'application/x-www-form-urlencoded';
		if(request.headers['content-type'] === FORM_URLENCODED) {
			let body = '';
			request.on('data', chunk => {
				body += chunk.toString();
			});
			request.on('end', () => {
				resolve(body.toString());
			});
		}
		else {
			resolve(null);
		}
	})
}