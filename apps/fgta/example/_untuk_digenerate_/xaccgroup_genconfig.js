'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Account Group",
	autoid: false,

	persistent: {
		'mst_accgroup' : {
			primarykeys: ['accgroup_id'],
			comment: 'Master Account Group',
			data: {
				accgroup_id: {text:'ID', type: dbtype.varchar(10), null:false, uppercase: true, options:{required:true,invalidMessage:'ID harus diisi'}},
				accgroup_name: {text:'Group', type: dbtype.varchar(60), null:false, uppercase: true, options:{required:true,invalidMessage:'Nama Account Group harus diisi'}},
				accgroup_descr: {text:'Descr', type: dbtype.varchar(90), null:true},
				accgroup_isdisabled: {text:'Disabled', type: dbtype.boolean, null:false, default:'0'},
			},
			uniques: {
				'accgroup_name' : ['accgroup_name']
			},
			values: [
				{accgroup_id:"1", accgroup_name:"AKTIVA"},
				{accgroup_id:"2", accgroup_name:"HUTANG"},
				{accgroup_id:"3", accgroup_name:"MODAL"},
				{accgroup_id:"4", accgroup_name:"PENGHASILAN"},
				{accgroup_id:"5", accgroup_name:"BIAYA"},
				{accgroup_id:"6", accgroup_name:"LAIN-LAIN"}				
			]	
		}
	},

	schema: {
		title: 'Account Group',
		header: 'mst_accgroup',
		detils: {
		}
	}
}



