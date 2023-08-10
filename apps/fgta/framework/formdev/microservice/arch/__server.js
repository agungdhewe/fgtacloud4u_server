'use strict'

const path = require('path')
const config = require(path.join(__dirname, '..', 'formdev.json'))
const port = config.data.microservice_port
const http=require('http')
const url = require('url');
const server = http.createServer()
const server_pid = process.pid
const service = require('./service.js')
const cleaner = require('./cleaner.js')

const processlist = {}
const finishedprocess = []


cleaner.Construct({
		processlist: processlist,
		finishedprocess: finishedprocess
})

service.Construct({
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



// Mulai Servernya
process.stdout.write(`starting uoloader service at port \x1b[1m${port}\x1b[0m... `);
server.listen(port, ()=> {
	console.log(`\x1b[32mOK\x1b[0m`)
	console.log(`PID: ${server_pid}`)

	cleaner.Start()
})




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
	var svc = service.CreateService(process_id, req)


	if (req.method==='POST') {
		req.PostData = await GetPostData(req)
	}


	// console.log(pathname)
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
		}
	
		if (result==null || result === undefined) {
			result = {}
		}
	} catch (err) {
		var error = new Error(err)
		result.error = true
		result.errormessage = error.message
	}


	result.server_pid = server_pid
	result.process_id = process_id
	var json_result = JSON.stringify(result)

	// console.log(json_result)
	res.writeHead(200, {"Content-Type" : "application/json"});
	res.end(json_result);		
}



async function Server_Exit(exitcode) {
	console.log('SERVER TERMINATED')
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