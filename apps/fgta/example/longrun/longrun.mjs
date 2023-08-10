const btn_execute_text = 'Execute'
const btn_execute_wait = 'Wait'


const btn_execute = $('#btn_execute')
const pbr_progress = $('#pbr_progress')
const txt_progressdisplay = $('#txt_progressdisplay')


export async function init(opt) {


	pbr_progress.hide()
	txt_progressdisplay.hide()


	btn_execute.linkbutton({
		text: btn_execute_text,
		onClick: () => { btn_execute_click() }
	})


}


async function btn_execute_click() {
	var textarea = document.getElementById('txt_progressdisplay')
	var api_url_start = `${global.modulefullname}/longrun?c=start`
	var api_url_status = `${global.modulefullname}/longrun?c=status`

	btn_execute.linkbutton('disable')
	btn_execute.linkbutton({text: btn_execute_wait});	

	textarea.value = `executing ${api_url_start} ...`
	pbr_progress.progressbar('setValue', 0)	

	txt_progressdisplay.show()
	
	$ui.fgta_longrun({
		process_cookie:  'fgta_example_longrun_process_id',
		api_url_start: api_url_start,
		api_url_status: api_url_status,
		onStarting: (params) => {
			pbr_progress.show()
		},
		onError: (err) => {
			pbr_progress.hide()	
			btn_execute.linkbutton('enable')
			btn_execute.linkbutton({text: btn_execute_text});
			txt_progressdisplay.hide()
			// $ui.ShowMessage(err.errormessage)
		},
		onProgress:(status) => {
			pbr_progress.progressbar('setValue', status.progress)
		},
		onFinished:(status) => {
			pbr_progress.hide()	
			btn_execute.linkbutton('enable')
			btn_execute.linkbutton({text: btn_execute_text});
			txt_progressdisplay.hide()
		},
		onTick: (status) => {
			textarea.value += JSON.stringify(status) + '\n'
			textarea.scrollTop = textarea.scrollHeight;
			var finished = status.respond === undefined ? false : status.respond.finished
			if (finished) {
				pbr_progress.progressbar('setValue', 100)
			}
		}
	})	
}