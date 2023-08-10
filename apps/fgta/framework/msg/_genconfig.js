'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Messaging",
	autoid: true,

	persistent: {
		'que_msg': {
			comment: 'Daftar Antrian Message',
			primarykeys: ['msg_id'],
			data: {
				msg_id: { text: 'ID', type: dbtype.varchar(14), null: false },

				msg_module: {text:'Module', type: dbtype.varchar(60)},
				msg_batch: {text:'Batch', type: dbtype.varchar(60)},
				msg_descr: {text:'Descr', type: dbtype.varchar(60)},

				msgtype_id: {
					text: 'Type', type: dbtype.varchar(3), null: true,
					options: { required: true, invalidMessage: 'Type harus diisi'},
					comp: comp.Combo({
						table: 'mst_msgtype',
						field_value: 'msgtype_id', field_display: 'msgtype_name',
						api: 'fgta/framework/msgtype/list',
						// onDataLoadingHandler: false,
						// onDataLoadedHandler: false,
						// onSelectingHandler: false,
						// onSelectedHandler: false	
					})
				},

				msg_hp: {text:'To HP', type: dbtype.varchar(60)},
				msg_email: {text:'To Email', type: dbtype.varchar(60)},
				msg_nama: {text:'To Nama', type: dbtype.varchar(60)},
				msg_subject: {text:'Subject', type: dbtype.varchar(60), suppresslist: true},
				msg_body: {text:'Body', type: dbtype.varchar(2600), suppresslist: true},

				msg_isactive: {
					text:'Active', type: dbtype.boolean, null:false, default:'0', unset:true, suppresslist: true, options:{disabled:true}
				},				
				msg_activedate: {
					text:'Active Date', type: dbtype.datetime, suppresslist: true, unset:true, comp:comp.Textbox(), options:{disabled:true},
				},	
				msg_isprocess: {
					text:'On Process', type: dbtype.boolean, null:false, default:'0', unset:true, suppresslist: true, options:{disabled:true}
				},
				msg_processbatch: {text:'Process Batch', type: dbtype.varchar(14)},					
				msg_processdate: {
					text:'Process Date', type: dbtype.datetime, suppresslist: true, unset:true, comp:comp.Textbox(), options:{disabled:true},
				},	
				msg_issend: {
					text:'Send', type: dbtype.boolean, null:false, default:'0', unset:true, suppresslist: true, options:{disabled:true}
				},
				server_messageid: {text:'MessageID', type: dbtype.varchar(160)},

				msg_isfail: {
					text:'Fail', type: dbtype.boolean, null:false, default:'0', unset:true, suppresslist: true, options:{disabled:true}
				},	
				msg_failmessage: {
					text:'Fail Message', type: dbtype.varchar(2600), suppresslist: true
				},
				msg_senddate: {
					text:'SendDate', type: dbtype.datetime, suppresslist: true, unset:true, comp:comp.Textbox(), options:{disabled:true},
				},					
				msg_ismarktodel: {
					text:'Mark To Delete', type: dbtype.boolean, null:false, default:'0', unset:true, suppresslist: true, options:{disabled:true}
				},

				msg_cbtable: {text:'Callback Table', type: dbtype.varchar(60)},
				msg_cbfieldkey: {text:'Callback PK', type: dbtype.varchar(60)},
				msg_cbfieldvalue: {text:'Callback PK Value', type: dbtype.varchar(60)},
				msg_cbfieldstatus: {text:'Callback Status Field', type: dbtype.varchar(60)},

			},

		},

		'que_msgatch' : {
			comment: 'Daftar Attachment Notifier',
			primarykeys: ['msgatch_id'],
			data: {
				msgatch_id: {text:'ID', type: dbtype.varchar(14), null:false},
				attachment_id: { text: 'Attachment ID', type: dbtype.varchar(60) },
				msg_id: { text: 'ID', type: dbtype.varchar(14), null: false },
			},
			uniques: {
				'msgatch_pair': ['msg_id', 'attachment_id']
			},			
		},

		'que_msgcopyto' : {
			comment: 'Daftar Copy Message Notifier (email)',
			primarykeys: ['msgcopyto_id'],
			data: {
				msgcopyto_id: {text:'ID', type: dbtype.varchar(14), null:false},
				msgcopy_id: {
					text: 'Copy', type: dbtype.varchar(2), null: true,
					options: { required: true, invalidMessage: 'Copy harus diisi'},
					comp: comp.Combo({
						table: 'mst_msgcopy',
						field_value: 'msgcopy_id', field_display: 'msgcopy_name',
						api: 'fgta/framework/msgcopy/list',
						// onDataLoadingHandler: false,
						// onDataLoadedHandler: false,
						// onSelectingHandler: false,
						// onSelectedHandler: false	
					})
				},
				msgcopyto_email: {text:'Copy To Email', type: dbtype.varchar(60)},
				msgcopyto_nama: {text:'Copy To Nama', type: dbtype.varchar(60)},
				msg_id: { text: 'ID', type: dbtype.varchar(14), null: false },
			},
			uniques: {
				'msgcopyto_pair': ['msg_id', 'msgcopyto_email']
			},		
		}

	},

	schema: {
		header: 'que_msg',
		detils: {
			'attachement': {title: 'Attachment', table: 'que_msgatch', form: true, headerview: 'msg_subject' },
			'copy': {title: 'Copy Message To', table: 'que_msgcopyto', form: true, headerview: 'msg_subject' },
		}
	},

	get: {
		getimage : { allowanonymous: true }
	}


}