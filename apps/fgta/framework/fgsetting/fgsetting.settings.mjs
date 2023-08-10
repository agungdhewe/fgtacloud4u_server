export function setup(opt) {
	opt.settings = {
		btn_edit_visible: true,
		btn_save_visible: true,
		btn_new_visble: true,
		btn_delete_visible: true
	}

	switch (opt.variancename) {
		case 'view' :
			opt.settings.btn_edit_visible = false;
			opt.settings.btn_save_visible = false;
			opt.settings.btn_new_visible = false;
			opt.settings.btn_delete_visible = false;
	}
	
}