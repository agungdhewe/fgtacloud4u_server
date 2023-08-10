'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "test title",
	autoid: false,

	persistent: {
		'mst_test' : {
			primarykeys: ['id'],
			data: {
				id: {type: dbtype.varchar(10), null:false},
				nama: {type: dbtype.varchar(90) },
				alamat: {type: dbtype.varchar(255)},
				disabled: {type: dbtype.boolean, null:false, default:'1'},
				city: {type: dbtype.varchar(10)},
				//city: {type: dbtype.varchar(10), null:false, comp: comp.PageSelector({page:'city', table:'mst_city', id:'city_id', text:'city_name'}) },
				tanggal: {type: dbtype.date, null:false},
				gender: {type: dbtype.varchar(1), null:false, comp: comp.Combobox({table:'mst_gender', id:'gender_id', text:'gender_name'}) }
			}
		}
	},

	schema: {
		header: 'mst_test',
		detils: {
		//	'telp' : {table:'fgt_formgentelp', form: true},
		//	'info' : {},
		//	'log' : {}
		}
	}
}



