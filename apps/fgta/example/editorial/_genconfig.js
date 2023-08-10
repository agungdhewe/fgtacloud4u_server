'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Editorial",
	autoid: true,

	persistent: {
		'exm_editorial' : {
			primarykeys: ['editorial_id'],
			data: {
				editorial_id: {text:'ID', type: dbtype.varchar(14), null:false},
				editorial_title: {text:'Title', type: dbtype.varchar(255), options: {required:true, invalidMessage:'Title harus diisi'} },
				editorial_content: {
					text:'Content', type: dbtype.varchar(25000), suppresslist: true,
					hidden: true,
					after: `
					<div class="form_row pnl_edit_row" >
						<div class="form_label_col"  style="border: 0px solid black; vertical-align: top; margin-top: 7px;">Content</div>
						<div class="form_input_col" style="border: 0px solid black">
							<div id="pnl_edit-contenteditor" class="easyui-texteditor" style="width:400px;height:300px;padding:20px"></div>
						</div>
					</div>					
					`				
				
				},
			},
			uniques: {
				'editorial_title' : ['editorial_title']
			}			
		}
	},

	schema: {
		title: "Editorial",
		header: 'exm_editorial',
		detils: {}
	}
}
