'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Long Task",
	autoid: false,

	persistent: {
		'fgt_longtask': {
			comment: 'Daftar Long Task',
			primarykeys: ['longtask_id'],
			data: {
				longtask_id: { text: 'ID', type: dbtype.varchar(14)},
				longtask_name: { text: 'Name', type: dbtype.varchar(90) },
				longtask_start: {text:'Start', type: dbtype.datetime, comp:comp.Textbox() },
				longtask_expired: {text:'Expired', type: dbtype.datetime, comp:comp.Textbox() },
				longtask_progress: { text:'Progress', type: dbtype.int(4), null:false, default:'0'},
				longtask_taskdescr: { text: 'Task Descr', type: dbtype.varchar(255) },
				longtask_logfile: { text: 'Logfile', type: dbtype.varchar(255) },
				longtask_lastprogressid: { text: 'Last Progress ID', type: dbtype.varchar(14)},
				longtask_isrunning: {text:'Running', type: dbtype.boolean, null:false, default:'0'},
				longtask_isrequestcancel: {text:'Request Cancel', type: dbtype.boolean, null:false, default:'0'},
				longtask_iscanceled: {text:'Canceled', type: dbtype.boolean, null:false, default:'0'},
				longtask_iscomplete: {text:'Complete', type: dbtype.boolean, null:false, default:'0'},
				longtask_iserror: {text:'Error', type: dbtype.boolean, null:false, default:'0'},
			},

			defaultsearch: ['longtask_id', 'longtask_name'],
		},

	},

	schema: {
		header: 'fgt_longtask',
		detils: {
		}
	}
}