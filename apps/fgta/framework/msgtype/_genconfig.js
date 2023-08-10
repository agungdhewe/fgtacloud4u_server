'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Message Type",
	autoid: false,

	persistent: {
		'mst_msgtype': {
			comment: 'Daftar Type Message',
			primarykeys: ['msgtype_id'],
			data: {
				msgtype_id: { text: 'ID', type: dbtype.varchar(3), uppercase: true, null: false, options: { required: true, invalidMessage: 'ID harus diisi' } },
				msgtype_name: { text: 'Type', type: dbtype.varchar(90), null: false, uppercase: true, options: { required: true, invalidMessage: 'Nama Type harus diisi' } },
			},

			uniques: {
				'msgtype_name': ['msgtype_name']
			},
			defaultsearch: ['msgtype_id', 'msgtype_name'],

			values: [
				{msgtype_id:'EML', msgtype_name:'Email'},
				{msgtype_id:'WAB', msgtype_name:'Whatsapp'},
			]
		},
	},

	schema: {
		title: "Message Type",
		header: 'mst_msgtype',
		detils: {
		}
	}


}