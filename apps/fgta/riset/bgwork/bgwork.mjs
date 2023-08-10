const btn_execute = $('#btn_execute');


export async function init(opt) {
	btn_execute.linkbutton({
		onClick: () => { btn_execute_click() }
	})
}


async function btn_execute_click() {
	console.log('execute');

	var apiurl = 'fgta/riset/bgwork/bgwork-execute'
	var args = {
		param1: 'ini param 1'
	}

	var mask = $ui.mask('executing api...')
	try {
		let result = await $ui.apicall(apiurl, args)
		
		console.log(result);

		$ui.unmask(mask);
	} catch (err) {
		$ui.unmask(mask);
		$ui.ShowMessage(`[ERROR] Eksekusi API Error`)
		console.error(err.message)
	}	
}

