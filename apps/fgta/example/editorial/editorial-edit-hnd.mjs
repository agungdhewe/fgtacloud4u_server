let editor, form, obj, opt;

const pnl_editor = $('#pnl_edit-contenteditor');

export function init(ed) {
	editor = ed;
	form = editor.form;
	obj = editor.obj;
	opt = editor.opt;


	form.OnDataCanceled = () => {
		form_canceledit();
	}

	// ini hanya diperlukan di handler header
	document.addEventListener("OnViewModeChanged", (evt) => {
		form_viewmodechanged(evt.detail.viewmode);
	});

	var editor = pnl_editor.texteditor('getEditor');
	editor[0].addEventListener('input', function(ev) {
		form.markDataChanged(true);
	});

}



export function form_newdata(data, options) {
	pnl_editor.texteditor('setValue', '');
}
	
export function form_dataopened(result, options) {
	form_viewmodechanged(true);
	console.log(result);
	pnl_editor.texteditor('setValue', result.record.editorial_content);
}

export function form_viewmodechanged(viewmode) {
	console.log(`set viewmode = ${viewmode}`)
	if (viewmode) {
		pnl_editor.texteditor('readonly', true); 
		pnl_editor.texteditor('getEditor').removeClass('input-modeedit-force');
	} else {

		$.parser.parse('#pnl_edit-contenteditor');

		pnl_editor.texteditor('readonly', false); 
		pnl_editor.texteditor('getEditor').addClass('input-modeedit-force');
	}
}


export function form_datasaving(data, options) {
	data.editorial_content = pnl_editor.texteditor('getValue');
}


function form_canceledit() {
	pnl_editor.texteditor('setValue', form.getValue(obj.txt_editorial_content));
}
