var this_page_id;


const txt_title = $('#pnl_editjurnaldetilform-title')
const btn_edit = $('#pnl_editjurnaldetilform-btn_edit')
const btn_save = $('#pnl_editjurnaldetilform-btn_save')
const btn_delete = $('#pnl_editjurnaldetilform-btn_delete')
const btn_prev = $('#pnl_editjurnaldetilform-btn_prev')
const btn_next = $('#pnl_editjurnaldetilform-btn_next')
const btn_addnew = $('#pnl_editjurnaldetilform-btn_addnew')
const chk_autoadd = $('#pnl_editjurnaldetilform-autoadd')

const pnl_form = $('#pnl_editjurnaldetilform-form')
const obj = {
	txt_jurnal_id: $('#pnl_editjurnaldetilform-txt_jurnal_id'),
	txt_jurnaldetil_id: $('#pnl_editjurnaldetilform-txt_jurnaldetil_id'),
	txt_jurnaldetil_info: $('#pnl_editjurnaldetilform-txt_jurnaldetil_info'),
	txt_jurnaldetil_value: $('#pnl_editjurnaldetilform-txt_jurnaldetil_value')
}


let form = {}
let header_data = {}



export async function init(opt) {
	this_page_id = opt.id
	
	setTimeout(()=>{
		$.parser.parse('#pnl_editjurnaldetilform');
	}, 500)


	form = new global.fgta4form(pnl_form, {
		primary: obj.txt_jurnaldetil_id,
		autoid: true,
		btn_edit: btn_edit,
		btn_save: btn_save,
		btn_delete: btn_delete,		
		objects : obj,
		OnDataSaving: async (data, options) => { await form_datasaving(data, options) },
		OnDataSaved: async (result, options) => {  await form_datasaved(result, options) },
		OnDataDeleting: async (data, options) => { await form_deleting(data, options) },
		OnDataDeleted: async (result, options) => { await form_deleted(result, options) },
		OnIdSetup : (options) => { form_idsetup(options) },
		OnViewModeChanged : (viewonly) => { form_viewmodechanged(viewonly) }
	})	

	form.AllowAddRecord = true
	form.AllowRemoveRecord = true
	form.CreateRecordStatusPage(this_page_id)


	btn_addnew.linkbutton({
		onClick: () => { btn_addnew_click() }
	})

	btn_prev.linkbutton({
		onClick: () => { btn_prev_click() }
	})

	btn_next.linkbutton({
		onClick: () => { btn_next_click() }
	})


	document.addEventListener('OnButtonBack', (ev) => {
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			ev.detail.cancel = true;
			if (form.isDataChanged()) {
				form.canceledit()
			} else {
				$ui.getPages().show('pnl_editjurnaldetilgrid', ()=>{
					form.setViewMode()
					$ui.getPages().ITEMS['pnl_editjurnaldetilgrid'].handler.scrolllast()
				})
			}
		
		}		
	})

	document.addEventListener('OnButtonHome', (ev) => {
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			ev.detail.cancel = true;
		}
	})

	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated(ev.detail.width, ev.detail.height)
	})
	
	
	document.addEventListener('OnViewModeChanged', (ev) => {
		if (ev.detail.viewmode===true) {
			form.lock(true)
			btn_addnew.allow = false
			btn_addnew.linkbutton('disable')
			chk_autoadd.attr("disabled", true);	
			chk_autoadd.prop("checked", false);			
		} else {
			form.lock(false)
			btn_addnew.allow = true
			btn_addnew.linkbutton('enable')
			chk_autoadd.removeAttr("disabled");
			chk_autoadd.prop("checked", false);
		}
	})
}


export function OnSizeRecalculated(width, height) {
}


export function getForm() {
	return form
}

export function open(data, rowid, hdata) {
	// console.log(header_data)
	txt_title.html(hdata.jurnal_id)
	header_data = hdata

	var fn_dataopening = async (options) => {
		options.api = `${global.modulefullname}/jurnaldetil-open`
		options.criteria[form.primary.mapping] = data[form.primary.mapping]
	}

	var fn_dataopened = async (result, options) => {
		form
			.fill(result.record)
			.commit()
			.setViewMode()
			.rowid = rowid


		// tambah baris
		if (form.AllowAddRecord) {
			btn_addnew.show()
		} else {
			btn_addnew.hide()
		}	

		// hapus baris
		if (form.AllowRemoveRecord) {
			btn_delete.show()
		} else {
			btn_delete.hide()
		}

		var prevnode = $(`#${rowid}`).prev()
		if (prevnode.length>0) {
			btn_prev.linkbutton('enable')
		} else {
			btn_prev.linkbutton('disable')
		}

		var nextode = $(`#${rowid}`).next()
		if (nextode.length>0) {
			btn_next.linkbutton('enable')
		} else {
			btn_next.linkbutton('disable')
		}		
	}

	form.dataload(fn_dataopening, fn_dataopened)	
}

export function createnew(hdata) {
	header_data = hdata

	txt_title.html('Create New Row')
	form.createnew(async (data, options)=>{
		data.jurnal_id= hdata.jurnal_id
		data.jurnaldetil_value = 0

		form.rowid = null
		options.OnCanceled = () => {
			$ui.getPages().show('pnl_editjurnaldetilgrid')
		}
	})
}


async function form_datasaving(data, options) {
	options.api = `${global.modulefullname}/jurnaldetil-save`

}

async function form_datasaved(result, options) {
	form.rowid = $ui.getPages().ITEMS['pnl_editjurnaldetilgrid'].handler.updategrid(form.getData(), form.rowid)

	var autoadd = chk_autoadd.prop("checked")
	if (autoadd) {
		setTimeout(()=>{
			btn_addnew_click()
		}, 1000)
	}
}

async function form_deleting(data, options) {
	options.api = `${global.modulefullname}/jurnaldetil-delete`
}

async function form_deleted(result, options) {
	options.suppressdialog = true
	$ui.getPages().show('pnl_editjurnaldetilgrid', ()=>{
		$ui.getPages().ITEMS['pnl_editjurnaldetilgrid'].handler.removerow(form.rowid)
	})
	
}

function form_viewmodechanged(viewonly) {
	if (viewonly) {
		btn_prev.linkbutton('enable')
		btn_next.linkbutton('enable')
		if (btn_addnew.allow) {
			btn_addnew.linkbutton('enable')
		} else {
			btn_addnew.linkbutton('disable')
		}
	} else {
		btn_prev.linkbutton('disable')
		btn_next.linkbutton('disable')
		btn_addnew.linkbutton('disable')
	}
}


function form_idsetup(options) {
	var objid = obj.txt_jurnaldetil_id
	switch (options.action) {
		case 'fill' :
			objid.textbox('disable') 
			break;

		case 'createnew' :
			// console.log('new')
			if (form.autoid) {
				objid.textbox('disable') 
				objid.textbox('setText', '[AUTO]') 
			} else {
				objid.textbox('enable') 
			}
			break;
			
		case 'save' :
			objid.textbox('disable') 
			break;	
	}
}

function btn_addnew_click() {
	createnew(header_data)
}


function btn_prev_click() {
	var prevode = $(`#${form.rowid}`).prev()
	if (prevode.length==0) {
		return
	} 
	
	var trid = prevode.attr('id')
	var dataid = prevode.attr('dataid')
	var record = $ui.getPages().ITEMS['pnl_editjurnaldetilgrid'].handler.getGrid().DATA[dataid]

	open(record, trid, header_data)
}

function btn_next_click() {
	var nextode = $(`#${form.rowid}`).next()
	if (nextode.length==0) {
		return
	} 

	var trid = nextode.attr('id')
	var dataid = nextode.attr('dataid')
	var record = $ui.getPages().ITEMS['pnl_editjurnaldetilgrid'].handler.getGrid().DATA[dataid]

	open(record, trid, header_data)
}