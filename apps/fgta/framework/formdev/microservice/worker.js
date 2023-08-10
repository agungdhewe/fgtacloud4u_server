const { workerData, parentPort } = require('worker_threads')


var max = 100
var error_at = 0

parentPort.postMessage({ progress: 1 })

//rs
var i = 0
var intv = setInterval(()=>{
	++i
	var progress = 1 + Math.floor((i/max)*99)	

	console.log(i, progress)
	parentPort.postMessage({ progress: progress, i: i })



	if (i==max) {
		clearInterval(intv)
		parentPort.postMessage({ finished: true })
	}

	if (error_at!=null) {
		if (i==error_at) {
			throw 'ini error ini'
		}
	}
}, 1000)

