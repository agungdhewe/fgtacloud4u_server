'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Message Copy",
	autoid: false,

	persistent: {
		'mst_msgcopy': {
			comment: 'Daftar Copy Message',
			primarykeys: ['msgcopy_id'],
			data: {
				msgcopy_id: { text: 'ID', type: dbtype.varchar(2), uppercase: true, null: false, options: { required: true, invalidMessage: 'ID harus diisi' } },
				msgcopy_name: { text: 'Copy', type: dbtype.varchar(3), null: false, uppercase: true, options: { required: true, invalidMessage: 'Nama Type harus diisi' } },
			},

			uniques: {
				'msgcopy_name': ['msgcopy_name']
			},
			defaultsearch: ['msgcopy_id', 'msgcopy_name'],

			values: [
				{msgcopy_id:'TO', msgcopy_name:'TO'},
				{msgcopy_id:'CC', msgcopy_name:'CC'},
				{msgcopy_id:'BC', msgcopy_name:'BCC'},
			]
		},
	},

	schema: {
		title: "Message Type",
		header: 'mst_msgcopy',
		detils: {
		}
	}


}