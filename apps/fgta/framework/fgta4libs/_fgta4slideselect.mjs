
export function fgta4slideselect(obj, options) {
	var self =  {
		obj: obj,
		options: options,
		grd_list: {}
	}

	if (typeof self.options.OnSelecting !== 'function') {
		self.options.OnSelecting = (criteria) => {}
	}

	init(self)
	return obj
}


function init(self) {
	var panelname = 'pnl_' + self.obj.name + '_select'
	var panelreferencename = self.options.returnpage
	var title = self.options.title
	var fields = self.options.fields
	CreatePanel(self, panelname, panelreferencename, title, fields)
}

function CreatePanel(self, panelname, panelreferencename, title, fields) {
	var obj = self.obj
	var pnl_reference = document.getElementById(panelreferencename)
	if (pnl_reference!=null) {
		setTimeout(()=>{
			var page_id = panelname
			if ($ui.getPages().ITEMS[page_id]!==undefined) {
				return
			}

			var content = CreatePanelContent(self, panelname, title, fields)

			$(content).insertAfter(`#${panelreferencename}`)
			$.parser.parse(`#${panelname}`)

			var pHandler = CreateHandler(self, panelname, panelreferencename)
			var pnl_content = $(`#${panelname}`)

			var page = {panel: pnl_content, handler: pHandler}
			page.panel.id = panelname
			page.panel.pagenum = Object.keys($ui.getPages().ITEMS).length + 1
			page.panel.handler = page.handler
			$ui.getPages().ITEMS[page.panel.id] = page.panel

			pnl_content.hide()


			obj.combo({
				panelHeight: '0px',
				onShowPanel: () => { 
					$ui.KeepScroll()
					obj.combo('hidePanel'); 
					$ui.getPages().show(panelname)
					$ui.getPages().ITEMS[panelname].handler.retrieveData()							
				}
			})



		}, 500);
	
	}	

}


function CreateHandler(self, panelname, panelreferencename) {
	var btn_load = $(`#${panelname}-btn_load`)
	var tbl_list = $(`#${panelname}-tbl_list`)
	var txt_search = $(`#${panelname}-txt_search`)

	self.grd_list = new global.fgta4grid(tbl_list, {
		OnRowClick: (tr, ev) => { 
			var dataid = tr.getAttribute('dataid')
			var record = self.grd_list.DATA[dataid]
			$ui.mask('setdata')
			$ui.getPages().show(panelreferencename)

			$ui.ResumeScroll(()=>{ $ui.unmask() })
			self.options.form.setValue(self.obj, "1", "satu")

		},
	})	
	
	btn_load.linkbutton({
		onClick: () => { console.log('btn_click') }
	})	
	

	document.addEventListener('OnButtonBack', (ev) => {
		if ($ui.getPages().getCurrentPage()==panelname) {
			ev.detail.cancel = true;
			$ui.getPages().show(panelreferencename)
			$ui.ResumeScroll()
		}
	})
	

	var api = self.options.api
	
	return {
		init: async (opt) => {},


		retrieveData: () => {
			self.grd_list.clear()

			var fn_listloading = async (options) => {
				options.api = api
				var search = txt_search.textbox('getText')
				if (search!='') {
					options.criteria['search'] = search
				}

				self.options.OnSelecting(options.criteria)

			}
		
			var fn_listloaded = async (result, options) => {
			}
		
			self.grd_list.listload(fn_listloading, fn_listloaded)

		}
	}
}


function CreatePanelContent(self, panelname, title, fields) {
	var th = ''
	var trhead = ''
	for (var t of fields) {
		th += `<th mapping="${t.mapping}">${t.text}</th>`
		trhead += `<td style="width: 100px; border-bottom: 1px solid #000000">${t.text}</td>`
	}


	return `
		<div id="${panelname}">
			<div class="fgta-page-title" style="display: flex; align-items: center ">
				<div>${title}</div>
			</div>

			<div style="width: calc(100% - 65px); display: flex;">
				<div style="width: 100px;">Cari</div>
				<div style="width: 150px">
					<input id="${panelname}-txt_search" class="easyui-textbox" style="width: 100%">
				</div>
				<div>
					<a href="javascript:void(0)" id="${panelname}-btn_load" class="easyui-linkbutton c8" style="width: 45px">Load</a>
				</div>
			</div>

			<div style="margin-top: 10px">
				<table id="${panelname}-tbl_list" paging="true" cellspacing="0" width="100%">
					<thead>
						<tr>
							${th}
						</tr>
						<tr style="background-color: #cccccc; height: 30px">
							${trhead}
						</tr>
					</thead>
				</table>
			</div>

		</div>		
	`
}
 
