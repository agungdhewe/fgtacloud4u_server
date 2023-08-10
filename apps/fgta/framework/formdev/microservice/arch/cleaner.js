
const path = require('path')
const fs = require('fs')
const rimraf = require("rimraf");


let PROCESSLIST, FINISHEDPROCESS 


module.exports = {
	Construct: (options) => {  
		PROCESSLIST = options.processlist
		FINISHEDPROCESS = options.finishedprocess
	},

	Start: () => { CleanerStart() }
}


function CleanerStart() {
	setInterval(()=>{
		while (FINISHEDPROCESS.length>0) {
			var process_id = FINISHEDPROCESS.shift()
			var svcprocess = PROCESSLIST[process_id]

			rimraf.sync(svcprocess.tempdir);

			PROCESSLIST[process_id] = null
			delete PROCESSLIST[process_id]
		}

		var totalprocess = Object.keys(PROCESSLIST).length
		console.log(new Date(), ' pending process: ', totalprocess)
	}, 5000)



	// Cari proses2 yang pending
	setInterval(()=>{
		for (var process_id in PROCESSLIST) {
			var svcprocess = PROCESSLIST[process_id]
			var started = svcprocess.status.started
			var timedif = (new Date()).getTime() - svcprocess.timestamp.getTime();
			if (!started && timedif > 5000) {
				console.log(`Prepare to clean ${process_id} timedif: ${timedif}`)
				FINISHEDPROCESS.push(process_id)		
			}
		}
	}, 30000)

	console.log('worker cleaner started...')
}