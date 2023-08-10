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


	var headertable_name = genconfig.schema.header
	var headertable = genconfig.persistent[headertable_name]

	var detil = genconfig.schema.detils[fsd.detilname]
	var tablename = detil.table
	var detiltable = genconfig.persistent[tablename]
	var data = detiltable.data



	var usecdb = false;
	var fileboxopen = '';
	var lookupfields = ''
	var tojsdate = ''
	var fields = []
	for (var fieldname in data) {
		// fields.push("'" + fieldname+ "'")
		fields.push(fieldname)

		var comptype = data[fieldname].comp.comptype
		if (comptype=='datebox') {
			tojsdate += `\t\t\t\t'${fieldname}' => date("d/m/Y", strtotime($record['${fieldname}'])),\r\n`
		}
		
		
		// untuk componen yang tienya combo, tambah lookup
		if (comptype=='combo') {
			var options = data[fieldname].comp.options
			var field_display_name = options.field_display;
			if (options.field_display_name!=null) {
				field_display_name = options.field_display_name;
			}
			
			var lookuptable = options.view != null ? options.view : options.table;
			lookupfields += `\t\t\t\t'${field_display_name}' => \\FGTA4\\utils\\SqlUtility::Lookup($record['${fieldname}'], $this->db, '${lookuptable}', '${options.field_value}', '${options.field_display}'),\r\n`
		}

		if (comptype=='filebox') {
			usecdb = true;
			var idsuffix = data[fieldname].idsuffix;
			var fileid = idsuffix===undefined || idsuffix=='' ? '$result->record[$primarykey]' : `$result->record[$primarykey] . "|${idsuffix}"`;
			fileboxopen += "\t\t\t" + `$file_id = "$tablename/" . ${fileid};\r\n`;
			fileboxopen += "\t\t\t" + `try { $result->record['${fieldname}_doc'] = $this->cdb->getAttachment($file_id, 'filedata'); } catch (\\Exception $ex) {}\r\n`;
		}

	}	


	var openfromcouch = "";
	if ( usecdb) {
		openfromcouch = fileboxopen;
	}




		/* tambah alias tablename */
		// var fieldsselect = 'A.' + fields.join(', A.');
		var sqlFieldRow = [];
		var tempRows = [];
		var tempRowSqlField = '';
		var imax = 4;
		var irow = 0;
		var jointemprow = false;
		for (var fieldname of fields) {
			if (irow%imax==0) {
				jointemprow = true;
			} else {
				jointemprow = false
			}

			if (jointemprow) {
				if (irow==0 && fields.length>1) {
				} else {
					sqlFieldRow.push(tempRowSqlField);	
				}

				tempRows = []
			}
			tempRows.push(`'${fieldname}' => 'A.\`${fieldname}\`'`);
			tempRowSqlField = tempRows.join(', ');
			irow++;
		}

		var sqlFieldRowIndented = [];
		for (var str of sqlFieldRow) {
			sqlFieldRowIndented.push(`\t\t\t\t${str}`);
		}
		sqlFieldRowIndented.push(`\t\t\t\t'_createby' => 'A.\`_createby\`', '_createdate' => 'A.\`_createdate\`', '_modifyby' => 'A.\`_modifyby\`', '_modifydate' => 'A.\`_modifydate\`'`);
		var sqlfieldlist = sqlFieldRowIndented.join(`,\r\n`);




	var primarykey = detiltable.primarykeys[0]
	// var primarycomppreix = data[primarykey].comp.prefix

	// var header_primarykey = headertable.primarykeys[0]
	// var header_primarycomppreix = data[primarykey].comp.prefix


	var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'tdetil-open_api.tpl')
	var tplscript = fs.readFileSync(mjstpl).toString()
	tplscript = tplscript.replace('/*{__SQLFIELDLIST__}*/', sqlfieldlist)
	tplscript = tplscript.replace('/*{__TOJSDATE__}*/', tojsdate)
	tplscript = tplscript.replace('/*{__LOOKUPFIELDS__}*/', lookupfields)
	tplscript = tplscript.replace('/*{__OPENFROMCOUCH__}*/', openfromcouch)


	tplscript = tplscript.replace(/(\/)(\*)({__CLASSNAME__})(\*)(\/)/gm, genconfig.basename + '_' + fsd.detilname);
	tplscript = tplscript.replace(/(\/)(\*)({__BASENAME__})(\*)(\/)/gm, genconfig.basename);
	tplscript = tplscript.replace(/(\/)(\*)({__TABLENAME__})(\*)(\/)/gm, tablename);
	tplscript = tplscript.replace(/(\/)(\*)({__HEADERTABLENAME__})(\*)(\/)/gm, headertable_name);
	tplscript = tplscript.replace(/(\/)(\*)({__PRIMARYID__})(\*)(\/)/gm, primarykey)


	tplscript = tplscript.replace(/{__BASENAME__}/gm, genconfig.basename);
	tplscript = tplscript.replace(/{__TABLENAME__}/gm, tablename);
	tplscript = tplscript.replace(/{__MODULEPROG__}/gm, genconfig.modulename + '/' + fsd.name);
	tplscript = tplscript.replace(/{__GENDATE__}/gm, ((date)=>{var year = date.getFullYear();var month=(1+date.getMonth()).toString();month=month.length>1 ? month:'0'+month;var day = date.getDate().toString();day = day.length > 1 ? day:'0'+day;return day+'/'+month+'/'+year;})(new Date()));
	tplscript = tplscript.replace(/{__DETILNAME__}/gm, fsd.detilname);


	fsd.script = tplscript
}