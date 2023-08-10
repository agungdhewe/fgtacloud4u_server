'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Account",
	autoid: false,

	persistent: {
		'mst_acc' : {
			primarykeys: ['acc_id'],
			comment: 'Master Account',
			data: {
				acc_id: {text:'ID', type: dbtype.varchar(10), null:false, uppercase: true, options:{required:true,invalidMessage:'ID harus diisi'}},
				acc_name: {text:'Account', type: dbtype.varchar(60), null:false, uppercase: true, options:{required:true,invalidMessage:'Nama Account harus diisi'}},
				acc_descr: {text:'Descr', type: dbtype.varchar(90), null:true},
				acc_isdisabled: {text:'Disabled', type: dbtype.boolean, null:false, default:'0'},
				accgroup_id: {
					text:'Group', type: dbtype.varchar(10), null:false, uppercase: true,
					options:{required:true,invalidMessage:'Account Group harus diisi'},
					comp: comp.Combo({
						table: 'mst_accgroup', 
						field_value: 'accgroup_id', field_display: 'accgroup_name', 
						api: 'fgta/example/xaccgroup/list'})				
				},
			},
			uniques: {
				'acc_name' : ['acc_name']
			}			
		}


	},

	schema: {
		title: 'Account',
		header: 'mst_acc',
		detils: {
		}
	}
}



