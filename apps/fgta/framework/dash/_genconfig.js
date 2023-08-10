'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Dashboards",
	autoid: true,

	persistent: {
		'fgt_dash' : {
			primarykeys: ['dash_id'],
			data: {
				dash_id: {text:'ID', type: dbtype.varchar(14), null:false},
				dash_name: {text:'Nama', type: dbtype.varchar(90), options: {required:true, invalidMessage:'Nama Dashboard harus diisi'} },
				dash_descr: {text:'Descr', type: dbtype.varchar(255), suppresslist: true},
				dash_module: {text:'Module', type: dbtype.varchar(255), suppresslist: true, options: {required:true, invalidMessage:'Nama module harus diisi'} },

			},
			uniques: {
				'dash_name' : ['dash_name']
			}			
		}
	},

	schema: {
		title: "Dashboards",
		header: 'fgt_dash',
		detils: {}
	}
}



