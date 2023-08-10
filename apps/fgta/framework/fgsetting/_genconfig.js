'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Setting",
	autoid: false,

	persistent: {
		'fgt_setting' : {
			primarykeys: ['setting_id'],
			data: {
				setting_id: {text:'ID', type: dbtype.varchar(30), null:false, uppercase: true, options: {required:true, invalidMessage:'ID Setting harus diisi'}},
				setting_value: {text:'Value', type: dbtype.varchar(255), options: {required:true, invalidMessage:'Value harus diisi'} },
				setting_scope: {text:'Scope', type: dbtype.varchar(255)},
				setting_tag: {text:'Tag', type: dbtype.varchar(255)},
				setting_descr: {text:'Descr', type: dbtype.varchar(255), suppresslist: true}
			},
			defaultsearch: ['setting_id', 'setting_value']
		}
	},

	schema: {
		header: 'fgt_setting',
		detils: {}
	}
}



