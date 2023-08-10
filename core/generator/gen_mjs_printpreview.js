const path = require('path')
const fs = require('fs')

const colReset = "\x1b[0m"
const colFgRed = "\x1b[31m"
const colFgGreen = "\x1b[32m"
const colFgYellow = "\x1b[33m"
const colFgBlack = "\x1b[30m"
const colBright = "\x1b[1m"
const BgYellow = "\x1b[43m"

module.exports = async (fsd, genconfig) => {

	var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'printpreview_mjs.tpl')
	var tplscript = fs.readFileSync(mjstpl).toString()
	tplscript = tplscript.replace(/<!--__PANELNAME__-->/g, fsd.panel)
	tplscript = tplscript.replace(/<!--__PAGENAME__-->/g, fsd.pagename)
	tplscript = tplscript.replace(/<!--__BASENAME__-->/g, genconfig.basename);
		

	fsd.script = tplscript
}