export function setup(opt) {
	opt.settings = {
		buttons: {
			edit: {el:$('#pnl_edit-btn_edit'), visible: false},
			save: {el:$('#pnl_edit-btn_save'), visible: false},
			delete: {el:$('#pnl_edit-btn_delete'), visible: false},
			new: {el:$('#pnl_list-btn_new'), visible: false},
		}
	}

	var buttons = opt.settings.buttons;


	// default semua button visible
	buttons.edit.visible = true;
	buttons.save.visible = true;
	buttons.delete.visible = true;
	buttons.new.visible = true;

	/*
	// setting visibility button xtion sesuai variancename
	if (opt.variancename=='entry') {

	} else if (opt.variancename=='entry') {	

	} else {

	}
	*/

	for (var btnname in buttons) {
		var btn = buttons[btnname];
		if (btn.visible===false) {
			btn.el.hide();
		}
	}
}