'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Jurnal",
	autoid: true,

	persistent: {
		'trn_jurnal' : {
			primarykeys: ['jurnal_id'],
			comment: 'Master Jurnal',
			data: {
				jurnal_id: {text:'ID', type: dbtype.varchar(14), null:false},
				jurnal_date: {text:'Tanggal', type: dbtype.date, null:false},
				jurnal_descr: {text:'Descr', type: dbtype.varchar(90), null:false, options:{required:true,invalidMessage:'Deskripsi jurnal harus diisi'}},
				jurnal_isposted: {text:'Disabled', type: dbtype.boolean, null:false, default:'0', options:{disabled:true}},
			}		
		},

		'trn_jurnaldetil' : {
			primarykeys: ['jurnaldetil_id'],
			comment: 'Daftar Content Jurnal',
			data: {
				jurnaldetil_id: {text:'ID', type: dbtype.varchar(14), null:false, suppresslist: true},
				jurnaldetil_descr: {text:'Descr', type: dbtype.varchar(90), null:false, options:{required:true,invalidMessage:'Deskripsi jurnal harus diisi'}},
				jurnaldetil_value: {text:'Value', type: dbtype.decimal(6,0), null:false, default:'0'},
				acc_id: {
					text:'Account', type: dbtype.varchar(10), null:false, uppercase: true,
					options:{required:true,invalidMessage:'Account harus diisi'},
					comp: comp.Combo({
						table: 'mst_acc', 
						field_value: 'acc_id', field_display: 'acc_name', 
						api: 'fgta/example/xacc/list'})				
				},				
				jurnal_id: {text:'ID', type: dbtype.varchar(14), null:false}
			}		
		}
	},

	schema: {
		title: 'Jurnal',
		header: 'trn_jurnal',
		detils: {
			'jurnaldetil' : {title: 'Detil Jurnal', table:'trn_jurnaldetil', form: true, headerview:'jurnal_descr'},  
		}
	}
}



