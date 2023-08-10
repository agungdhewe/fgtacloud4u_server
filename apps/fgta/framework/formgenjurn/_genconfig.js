'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Gen Master Detil",
	autoid: true,

	persistent: {
		'fgt_testjurnal' : {
			primarykeys: ['jurnal_id'],
			data: {
				jurnal_id: {type: dbtype.varchar(13), null:false},
				jurnal_descr: {type: dbtype.varchar(90) },
				jurnal_note: {type: dbtype.varchar(255)},
			}
		},

		'fgt_testjurnaldetil' : {
			primarykeys: ['jurnaldetil_id'],
			data: {
				jurnal_id: {type: dbtype.varchar(13), null:false},
				jurnaldetil_id: {type: dbtype.varchar(13), null:false},
				jurnaldetil_info: {type: dbtype.varchar(255)},
				jurnaldetil_value: {type: dbtype.decimal(18,2), null:false, default:0},
			}
		},

		'fgt_testjurnalpaymn' : {
			primarykeys: ['jurnalpaymn_id'],
			data: {
				jurnal_id: {type: dbtype.varchar(13), null:false},
				jurnalpaymn_id: {type: dbtype.varchar(13), null:false},
				jurnalpaymn_data: {type: dbtype.varchar(255)},
				jurnalpaymn_value: {type: dbtype.decimal(18,2), null:false, default:0},
			}
		}		

	},

	schema: {
		header: 'fgt_testjurnal',
		detils: {
			'jurnaldetil' : {table:'fgt_testjurnaldetil', form: true},
			'jurnalpaymn' : {table:'fgt_testjurnalpaymn', form: true},
			'info' : {},
			'log' : {}
		}
	}
}



