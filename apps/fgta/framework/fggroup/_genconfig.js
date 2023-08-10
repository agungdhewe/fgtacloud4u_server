'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Groups",
	autoid: false,

	persistent: {
		'fgt_group' : {
			primarykeys: ['group_id'],
			data: {
				group_id: {text:'ID', type: dbtype.varchar(13), null:false, uppercase: true, options: {required:true, invalidMessage:'ID Group harus diisi'}},
				group_name: {text:'Group', type: dbtype.varchar(30), uppercase: true, options: {required:true, invalidMessage:'Nama Group harus diisi'} },
				group_descr: {text:'Descr', type: dbtype.varchar(255), suppresslist: true},
				group_disabled: {text:'Disabled', type: dbtype.boolean, null:false, default:'1'},
				group_menu: {text:'Menu', type: dbtype.varchar(90), uppercase: false, suppresslist: true, options: {required:true, invalidMessage:'Menu Group harus diisi'} },

				dash_id: {
					text:'Main Dashboard', type: dbtype.varchar(14), null:true, 
					options: {required:false, prompt:'NONE'},
					comp: comp.Combo({
						table: 'fgt_dash', 
						field_value: 'dash_id', field_display: 'dash_name', 
						api: 'fgta/framework/dash/list',
						onDataLoadingHandler: false,
						onDataLoadedHandler: false,
						onSelectingHandler: false,
						onSelectedHandler: false
					})

				},

			},
			uniques: {
				'group_name' : ['group_name']
			}			
		},

		'fgt_groupdash' : {
			primarykeys: ['groupdash_id'],
			data: {
				groupdash_id: {text:'ID', type: dbtype.varchar(14), null:false},
				dash_id: {
					text:'Dashboard', type: dbtype.varchar(14), null:true, 
					options:{required:true,invalidMessage:'Dashboard harus diisi', prompt:'-- PILIH --'},
					comp: comp.Combo({
						table: 'fgt_dash', 
						field_value: 'dash_id', field_display: 'dash_name', 
						api: 'fgta/framework/dash/list'})
				},
				group_id: {text:'User', type: dbtype.varchar(13), null:false},			
			},
			uniques: {
				'groupdash_pair' : ['groupdash_id', 'dash_id']
			}				
		},

		'fgt_grouprole' : {
			primarykeys: ['grouprole_id'],
			data: {
				grouprole_id: {text:'ID', type: dbtype.varchar(14), null:false},
				role_id: {
					text:'Role', type: dbtype.varchar(30), null:true, 
					options:{required:true,invalidMessage:'Role harus diisi', prompt:'-- PILIH --'},
					comp: comp.Combo({
						table: 'fgt_role', 
						field_value: 'role_id', field_display: 'role_name', 
						api: 'fgta/framework/fgrole/list'})
				},
				group_id: {text:'User', type: dbtype.varchar(13), null:false},			
			},
			uniques: {
				'grouprole_pair' : ['grouprole_id', 'role_id'],
			}				
		}		
	},

	schema: {
		title: "Groups",
		header: 'fgt_group',
		detils: {
			'groupdash' : {
				title: 'Other Dashboards', table: 'fgt_groupdash', form: true, headerview: 'group_name', 
				editorHandler: true,
				listHandler: true
			},
			'grouprole' : {
				title: 'Roles', table: 'fgt_grouprole', form: true, headerview: 'group_name', 
				editorHandler: true,
				listHandler: true
			},
		}
	}
}





// INSERT INTO kalistadblocal.fgt_group (group_id,group_name,group_descr,group_disabled,group_menu,dash_id,`_createby`,`_createdate`,`_modifyby`,`_modifydate`) VALUES
// 	 ('DEV','DEVELOPER','',0,'modules-kalista-all',NULL,'root','2022-03-04 10:09:47.0',NULL,NULL),
// 	 ('IT','IT','',0,'modules-tfi-it',NULL,'5effbb0a0f7d1','2022-12-29 10:27:14.0',NULL,NULL),
// 	 ('STORE','STORE','',0,'modules-store',NULL,'root','2022-01-19 00:32:39.0',NULL,NULL),
// 	 ('WORKSHOP','WORKSHOP','',0,'modules-workshop',NULL,'5effbb0a0f7d1','2021-04-13 02:10:45.0','5effbb0a0f7d1','2021-04-13 02:11:32.0');
