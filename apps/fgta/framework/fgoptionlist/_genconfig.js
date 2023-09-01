'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
  title: "Option List",
  autoid: false,
 
  persistent: {
    'fgt_optionlist': {
		comment: 'Daftar Model Timespan ',
		primarykeys: ['optionlist_id'],
		data: {
			optionlist_id: { text: 'ID', type: dbtype.varchar(10), uppercase: true, null: false, options: { required: true, invalidMessage: 'ID harus diisi' } },
			optionlist_name: { text: 'Option Name', type: dbtype.varchar(120), options: { required: true, invalidMessage: 'Nama Option harus diisi' } },
			optionlist_descr: { text: 'Descr', type: dbtype.varchar(255), suppresslist: true },
			optionlist_tag: { text: 'Tag', type: dbtype.varchar(255), suppresslist: true },
			optionlist_order: { 
				text: 'Order', type: dbtype.int(4), suppresslist: true, null: false, default: 0, 
				options: { required: true, invalidMessage: 'Order harus diisi' }, 
			},
			optionlist_data: { text: 'Data', type: dbtype.varchar(2255), suppresslist: true },

		},
		uniques: {
			'optionlist_name': ['optionlist_name']
		},
		defaultsearch: ['optionlist_id', 'optionlist_name', 'optionlist_tag'],
    }
  },

  schema: {
	title: "Option List",
    header: 'fgt_optionlist',
    detils: {
    }
  }
}