const { Worker } = require('worker_threads')
const path = require('path')
const fs = require('fs')

let PROCESSLIST, FINISHEDPROCESS, WORKERPATH 


module.exports = {
	Construct: (options) => {  
		PROCESSLIST = options.processlist
		FINISHEDPROCESS = options.finishedprocess
	},

	setWorkerPath: (workerpath) => {
		WORKERPATH = workerpath
	},

	CreateService: (process_id, req) => { return CreateService(process_id, req) }
}

function CreateService(process_id, req) {
	let self = this

	self.req = req
	self.process_id = process_id
	// self.PostData = JSON.parse(req.PostData)

	return {
		init: async() => { return await ServiceInit(self) },
		start: async() => { return await ServiceStart(self)},
		status: async() => { return await ServiceStatus(self)},
		list: async() => { return await ServiceProcessList(self) },
		kill: async(target_process_id) => { return await ServiceProcessKill(target_process_id) }
	}
}


async function ServiceInit(self) {
	try {
		var postdata = JSON.parse(req.PostData)
		self.tempdir = postdata.tempdir
		self.username = postdata.username
	} catch (err) {
		throw err
	}
}



async function ServiceStart(self) {
	var req = self.req
	var process_id = self.process_id

	try {
		
		if (!fs.existsSync(self.tempdir)) {
			throw `Temporary Direktori ${self.tempdir} tidak ada!`
		}
	
		if (PROCESSLIST[process_id]===undefined) {
			PROCESSLIST[process_id] = {
				worker: null,
				tempdir: path.join(self.tempdir, process_id),
				timestamp: new Date(),
				server_pid: process.pid,
				process_id: process_id,
				username: self.username,
				status: {
					started: false,
					progress: 0,
					error: false,
					errormessage: null
				}
			}

			// siapkan temp folder
			var processtempdir = PROCESSLIST[process_id].tempdir
			if (!fs.existsSync(processtempdir)) {
				fs.mkdirSync(processtempdir)
			}

		}



		// BEGIN -------------------


		if (PROCESSLIST[process_id]===undefined) {
			throw `Process id ${process_id} error`
		}

		var postdata = JSON.parse(req.PostData)
		postdata.process_id = process_id

		var svcprocess = PROCESSLIST[process_id]
		if (svcprocess.worker===null || svcprocess.worker===undefined) {
			svcprocess.worker = new Worker(WORKERPATH, { workerData: postdata });
			svcprocess.status.started = true;

			svcprocess.worker.on("error", (err)=>{
				WorkerError(self, svcprocess, err)
			})

			svcprocess.worker.on("message", (status)=>{
				WorkerMessage(self, svcprocess, status)
			})			

			svcprocess.worker.on("exit", (exitcode)=>{
				WorkerExit(self, svcprocess, exitcode)
			})	

		} else {
			console.log('worker sudah ada')
		}

		return svcprocess.status
	} catch (err) {
		throw err
	}

}



async function ServiceStatus(self) {
	// var req = self.req
	var process_id = self.process_id

	try {

		if (PROCESSLIST[process_id]==null || PROCESSLIST[process_id]===undefined) {
			throw `Process ${process_id} has been terminated by host process`
		}
		var svcprocess = PROCESSLIST[process_id]
		return svcprocess.status
	} catch (err) {
		throw err
	}

}


async function ServiceProcessList() {
	var res = '<html>'
	res += '<head>'
	res += '<title>Daftar Service Pending</title>'
	res += '<meta http-equiv="refresh" content="30">'
	res += '</head>'
	res += '<body>'
	res += '<h2>Process List</h2>'
	res += `PID: ${process.pid}`
	res += '<table border="1">'
	res += '<tr>'
	res += '<td style="text-align:center; font-weight:bold; background-color:#ccc">No</td>'
	res += '<td style="text-align:center; font-weight:bold; background-color:#ccc">ProcessId</td>'
	res += '<td style="text-align:center; font-weight:bold; background-color:#ccc">Username</td>'
	res += '<td style="text-align:center; font-weight:bold; background-color:#ccc">Age (sec)</td>'
	res += '<td style="text-align:center; font-weight:bold; background-color:#ccc">Started</td>'
	res += '<td style="text-align:center; font-weight:bold; background-color:#ccc">Progress</td>'
	res += '<td style="text-align:center; font-weight:bold; background-color:#ccc">Tempdir</td>'
	res += '<td style="text-align:center; font-weight:bold; background-color:#ccc">Action</td>'
	res += '</tr>'
	var i = 0;
	for (var process_id in PROCESSLIST) {
		var svcprocess = PROCESSLIST[process_id]

		if (svcprocess===undefined) {
			continue
		}
		
		var timedif = (new Date()).getTime() - svcprocess.timestamp.getTime();
		var started = svcprocess.status.started ? "yes" : "no"
		var progress = svcprocess.status.progress
		var killed = svcprocess.status.killed
		var tempdir = svcprocess.tempdir

		var color = '#000'
		if (killed===true) {
			color = '#aaa'
		} 

		++i
		res += '<tr>'
		res += `<td style="text-align:right; color: ${color}">${i}</td>`
		res += `<td style="text-align:center; color: ${color}">${process_id}</td>`
		res += `<td style="text-align:center; color: ${color}">${svcprocess.username}</td>`	
		res += `<td style="text-align:right; color: ${color}">${Math.floor(timedif/1000)}</td>`
		res += `<td style="text-align:center; color: ${color}">${started}</td>`	
		res += `<td style="text-align:right; color: ${color}">${progress}</td>`	
		res += `<td style="text-align:right; color: ${color}">${tempdir}</td>`	
		if (killed===true) {
			res += `<td style="text-align:center">killed</td>`
		} else {
			res += `<td style="text-align:center"><a href="/kill?target_process_id=${process_id}">kill</a></td>`
		}
		res += '</tr>'
	}
	res += '</table>'
	res += '</body>'
	res += '</html>'

	return res
}

async function ServiceProcessKill(target_process_id) {
	var svcprocess = PROCESSLIST[target_process_id]

	if (svcprocess!==undefined) {
		svcprocess.status.killed = true
		FINISHEDPROCESS.push(target_process_id)	
	}

	var res = '<html>'
	res += '<head>'
	res += '<title>Daftar Service Pending</title>'
	res += '<script>'
	res += `location.href='/list'`
	res += '</script>'
	res += '</head>'
	res += '<body>'
	res += 'redirecting to list...'
	res += '</body>'
	res += '</html>'		
	
	return res
}



function WorkerError(self, svcprocess, err) {
	Object.assign(svcprocess.status, {
		error: true,
		errormessage: err
	})
}

function WorkerMessage(self, svcprocess, status) {
	if (status!=null) {
		Object.assign(svcprocess.status, status)
	}
	//console.log(`progres: ${svcprocess.status.progress}`)
	// console.log(svcprocess.status)
}

function WorkerExit(self, svcprocess, exitcode) {
	if (exitcode!=0) {
		console.log(`Worker exit Error (${exitcode})`)
		console.log(svcprocess.status.errormessage)
	} else {
		console.log(`Worker exit finished`)
		svcprocess.status.finished = true
	}
	
	svcprocess.worker = null
	delete svcprocess.worker

	var process_id = svcprocess.process_id
	FINISHEDPROCESS.push(process_id)
}