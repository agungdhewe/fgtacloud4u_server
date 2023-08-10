const obj_txt_nama = $('#obj_txt_nama')
const btn_show = $('#btn_show')


export async function init() {

	btn_show.linkbutton({
		onClick: () => { btn_show_click() }
	})
}


function btn_show_click() {
	var text = obj_txt_nama.textbox('getText')

	if (text.trim()=='') {
		$ui.ShowMessage('[WARNING] Anda belum menuliskan sesuatu')
	} else {
		$ui.ShowMessage(`[INFO] Anda menuliskan '${text}'`)
	}
	
}