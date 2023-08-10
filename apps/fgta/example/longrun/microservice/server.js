const path = require('path')

console.log('Reuqire MARIADB');
const mariadb = require('mariadb');


const config = require(path.join(__dirname, '..', 'longrun.json'))
const port = config.data.microservice_port
const rootdir = process.cwd()
const serverpath = path.join(rootdir, 'core', 'longrunserver.js')
const server = require(serverpath)

server.Start({
	port: port,
	workerpath: path.join(__dirname, '/worker.js')
})
