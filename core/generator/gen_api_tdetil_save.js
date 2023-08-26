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
	var header_primarykey = headertable.primarykeys[0]

	var detil = genconfig.schema.detils[fsd.detilname]
	var tablename = detil.table
	var detiltable = genconfig.persistent[tablename]
	var data = detiltable.data

	var fk_to_header = detiltable.fk_to_header;
	if (fk_to_header==null) {
		 fk_to_header = header_primarykey;
	}

	
	// console.log(data)
	var lookupfields = ''
	var uppercasefields = ''
	var setnullfields = ''
	var unsetfields = ''
	var tosqldate = ''
	var fields = []
	var fieldreturn = []	
	var cdbsave = '';
	var withupload = false;
	
	for (var fieldname in data) {
		fields.push(fieldname);
		fieldreturn.push(fieldname);
		var options = data[fieldname].comp.options
		var comptype = data[fieldname].comp.comptype

		if (options==undefined) {
			options = {}
		}

		var comptype = data[fieldname].comp.comptype
		if (comptype=='datebox') {
			tosqldate += `\t\t\t$obj->${fieldname} = (\\DateTime::createFromFormat('d/m/Y',$obj->${fieldname}))->format('Y-m-d');\r\n`
			lookupfields += `\t\t\t\t\t'${fieldname}' => date("d/m/Y", strtotime($row['${fieldname}'])),\r\n`;
		}
		
		var uppercase = data[fieldname].uppercase;
		var lowercase = data[fieldname].lowercase;
		if (uppercase===true) {
			uppercasefields += `\t\t\t$obj->${fieldname} = strtoupper($obj->${fieldname});\r\n`
		} else if (lowercase===true) {
			uppercasefields += `\t\t\t$obj->${fieldname} = strtolower($obj->${fieldname});\r\n`
		}		 

		if (comptype!='combo') {
			var allownull = data[fieldname].null;
			if (allownull) {
				var required = options.required;;
				if (!(required===true)) {
					// setnullfields += `\t\t\t// if ($obj->${fieldname}=='--NULL--') { unset($obj->${fieldname}); }\r\n`
					setnullfields += `\t\t\tif ($obj->${fieldname}=='') { $obj->${fieldname} = '--NULL--'; }\r\n`
				}
			}
		}



		// untuk componen yang tienya combo, tambah lookup
		if (comptype=='combo') {
			var field_display_name = options.field_display;
			if (options.field_display_name!=null) {
				field_display_name = options.field_display_name;
			}			
			lookupfields += `\t\t\t\t\t'${field_display_name}' => \\FGTA4\\utils\\SqlUtility::Lookup($record['${fieldname}'], $this->db, '${options.table}', '${options.field_value}', '${options.field_display}'),\r\n`
		}



		if (comptype=='filebox') { 
			withupload = true;
			var idsuffix = data[fieldname].idsuffix;
			var fileid = idsuffix===undefined || idsuffix=='' ? '$obj->{$primarykey}' : `$obj->{$primarykey} . "|${idsuffix}"`;
			cdbsave += `
				$fieldname = '${fieldname}';	
				if (property_exists($files, $fieldname)) {

					$file_id = "$tablename/" .${fileid};
					$doc = $files->{$fieldname};
					$doc->doctype = $tablename;
					$doc->docid = ${fileid};
					$file_base64data = $doc->data;
					unset($doc->data);

					$overwrite = true;
					$res = $this->cdb->addAttachment($file_id, $doc, 'filedata', $file_base64data, $overwrite);	
					$rev = $res->asObject()->rev;

					$key->{$primarykey} = "$tablename/" .$obj->{$primarykey};
					
					$objfile = new \\stdClass;
					$objfile->{$primarykey} = $key->{$primarykey};
					$objfile->${fieldname} = $rev;
					$cmd = \\FGTA4\\utils\\SqlUtility::CreateSQLUpdate($tablename, $objfile, $key);
					$stmt = $this->db->prepare($cmd->sql);
					$stmt->execute($cmd->params);
				}				
			
			`;
			
		}

		// * Field yang tidak ikut di save */
		var unset = data[fieldname].unset===true;
		if (unset) {
			unsetfields += `\t\t\tunset($obj->${fieldname});\r\n`
		}		


	}

	// $obj->tanggal = (\DateTime::createFromFormat('d/m/Y',$obj->tanggal))->format('Y-m-d');
	var primarykey = detiltable.primarykeys[0]
	
	fieldreturn.push('_createby')
	fieldreturn.push('_createdate')
	fieldreturn.push('_modifyby')
	fieldreturn.push('_modifydate')
	var fieldresturnsel = "'" + fieldreturn.join("', '") + "'"

	if (withupload) {
		uploadfileparam = ', $files';
	}




	/* tambah alias tablename */
	// var fieldsselect = 'A.' + fields.join(', A.');
	var update_sqlFieldRow = [];
	var update_tempRows = [];
	var update_tempRowSqlField = '';

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
				update_sqlFieldRow.push(update_tempRowSqlField);
			}

			tempRows = []
			update_tempRows = [];
		}
		tempRows.push(`'${fieldname}' => 'A.\`${fieldname}\`'`);
		tempRowSqlField = tempRows.join(', ');

		if (!['_createby', '_createdate', '_modifyby', '_modifydate'].includes(fieldname)) {
			update_tempRows.push(`'${fieldname}'`);
			update_tempRowSqlField = update_tempRows.join(', ');
		}


		irow++;
	}

	var sqlFieldRowIndented = [];
	for (var str of sqlFieldRow) {
		sqlFieldRowIndented.push(`\t\t\t\t\t${str}`);
	}
	sqlFieldRowIndented.push(`\t\t\t\t\t'_createby' => 'A.\`_createby\`', '_createdate' => 'A.\`_createdate\`', '_modifyby' => 'A.\`_modifyby\`', '_modifydate' => 'A.\`_modifydate\`'`);
	var sqlfieldlist = sqlFieldRowIndented.join(`,\r\n`);


	var update_sqlFieldRowIndented = [];
	for (var str of update_sqlFieldRow) {
		update_sqlFieldRowIndented.push(`\t\t\t\t\t${str}`);
	}
	var sqlupdatefield = update_sqlFieldRowIndented.join(`,\r\n`);






	var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'tdetil-save_api.tpl')
	var tplscript = fs.readFileSync(mjstpl).toString()
	tplscript = tplscript.replace('/*{__SQLUPDATEFIELD__}*/', sqlupdatefield)
	tplscript = tplscript.replace('/*{__SQLFIELDLIST__}*/', sqlfieldlist)

	tplscript = tplscript.replace('/*{__TOSQLDATE__}*/', tosqldate)
	tplscript = tplscript.replace('/*{__TOUPPERCASE__}*/', uppercasefields)
	tplscript = tplscript.replace('/*{__FIELDRETSEL__}*/', fieldresturnsel)
	tplscript = tplscript.replace('/*{__SETNULLFIELD__}*/', setnullfields)
	tplscript = tplscript.replace('/*{__LOOKUPFIELD__}*/', lookupfields)
	tplscript = tplscript.replace('/*{__UNSETFIELD__}*/', unsetfields)
	tplscript = tplscript.replace('/*{__CDBSAVE__}*/', cdbsave)
	tplscript = tplscript.replace('/*{__UPLOADFILEPARAM__}*/', uploadfileparam)


	tplscript = tplscript.replace(/(\/)(\*)({__CLASSNAME__})(\*)(\/)/gm, genconfig.basename + '_' + fsd.detilname);
	tplscript = tplscript.replace(/(\/)(\*)({__BASENAME__})(\*)(\/)/gm, genconfig.basename);
	tplscript = tplscript.replace(/(\/)(\*)({__TABLENAME__})(\*)(\/)/gm, tablename);
	tplscript = tplscript.replace(/(\/)(\*)({__PRIMARYID__})(\*)(\/)/gm, primarykey);
	tplscript = tplscript.replace(/(\/)(\*)({__HEADERTABLE__})(\*)(\/)/gm, headertable_name)
	tplscript = tplscript.replace(/(\/)(\*)({__HEADERPRIMARYKEY__})(\*)(\/)/gm, header_primarykey)


	tplscript = tplscript.replace(/{__BASENAME__}/g, genconfig.basename);
	tplscript = tplscript.replace(/{__TABLENAME__}/g, tablename);
	tplscript = tplscript.replace(/{__PRIMARYID__}/g, primarykey);
	tplscript = tplscript.replace(/{__HEADERTABLE__}/g, headertable_name);
	tplscript = tplscript.replace(/{__HEADERPRIMARYKEY__}/g, header_primarykey);
	tplscript = tplscript.replace(/{__MODULEPROG__}/g, genconfig.modulename + '/' + fsd.name);
	tplscript = tplscript.replace(/{__GENDATE__}/g, ((date)=>{var year = date.getFullYear();var month=(1+date.getMonth()).toString();month=month.length>1 ? month:'0'+month;var day = date.getDate().toString();day = day.length > 1 ? day:'0'+day;return day+'/'+month+'/'+year;})(new Date()));
	tplscript = tplscript.replace(/{__DETILNAME__}/g, fsd.detilname);
	tplscript = tplscript.replace(/{__FK_TO_HEADER__}/g, `${fk_to_header}`)

	
	tplscript = tplscript.replace('{__PRIMARYID__}', primarykey)
	

	fsd.script = tplscript
}