const { Worker } = require('worker_threads')
const path = require('path')
const fs = require('fs')

let PROCESSLIST, FINISHEDPROCESS 


module.exports = {
	Construct: (options) => {  
		PROCESSLIST = options.processlist
		FINISHEDPROCESS = options.finishedprocess
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
		status: async() => { return await ServiceStatus(self)}
	}
}


async function ServiceInit(self) {
	var req = self.req
	var process_id = self.process_id
	

	try {
		var postdata = JSON.parse(req.PostData)
		if (!fs.existsSync(postdata.tempdir)) {
			throw `Temporary Direktori ${postdata.tempdir} tidak ada!`
		}
	

		if (PROCESSLIST[process_id]===undefined) {
			PROCESSLIST[process_id] = {
				worker: null,
				tempdir: path.join(postdata.tempdir, process_id),
				timestamp: new Date(),
				server_pid: process.pid,
				process_id: process_id,
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




	} catch (err) {
		throw err
	}
}



async function ServiceStart(self) {
	var req = self.req
	var process_id = self.process_id

	try {
		if (PROCESSLIST[process_id]===undefined) {
			throw `Process id ${process_id} error`
		}

		var postdata = JSON.parse(req.PostData)
		var svcprocess = PROCESSLIST[process_id]
		if (svcprocess.worker===null || svcprocess.worker===undefined) {
			svcprocess.worker = new Worker(path.join(__dirname, '/worker.js'), { workerData: postdata });
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
			throw `sessi untuk Process ${process_id} telah habis`
		}
		var svcprocess = PROCESSLIST[process_id]
		return svcprocess.status
	} catch (err) {
		throw err
	}

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