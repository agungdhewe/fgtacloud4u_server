let editor, form, obj, opt;
import { md5 } from '../../../../../jslibs/md5.js';


const btn_changepassword = $('#pnl_edit-btn_changepassword')


export function init(ed) {
	editor = ed;
	form = editor.form;
	obj = editor.obj;
	opt = editor.opt;

	document.addEventListener('OnViewModeChanged', (evt) => {
		if (evt.detail.viewmode) {
			btn_changepassword.linkbutton('disable')
		} else {
			btn_changepassword.linkbutton('enable')
		}
	})

	btn_changepassword.linkbutton({
		onClick: () => { btn_changepassword_click() }
	})	
}

function btn_changepassword_click() {
	$.messager.prompt({
		title: 'Set Password',
		msg: 'Masukkan password baru:',
		fn: function(r){
			if (r){
				form.setValue(obj.txt_user_password, md5(r))
			}
		}
	});
}	