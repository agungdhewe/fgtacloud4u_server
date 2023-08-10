var this_page_id;

const pnl_head = $('#pnl-list-pnl_head')

const tbl_list = $('#pnl_list-tbl_list')


const txt_search = $('#pnl_list-txt_search')
const btn_load = $('#pnl_list-btn_load')
const btn_new = $('#pnl_list-btn_new')
const btn_test = $('#pnl_list-btn_test')

const obj_progress = $('#pnl_list-progress')

let grd_list = {}


let last_scrolltop = 0

let state = {}

export async function init(opt) {
	this_page_id = opt.id
	
	grd_list = new global.fgta4grid(tbl_list, {
		OnRowFormatting: (tr) => { grd_list_rowformatting(tr) },
		OnRowClick: (tr, ev) => { grd_list_rowclick(tr, ev) },
		OnCellClick: (td, ev) => { grd_list_cellclick(td, ev) },
		OnCellRender: (td) => { grd_list_cellrender(td) },
		OnRowRender: (tr) => { grd_list_rowrender(tr) }
	})


	btn_load.linkbutton({
		onClick: () => { btn_load_click() }
	})

	btn_new.linkbutton({
		onClick: () => { btn_new_click() }
	})

	btn_test.linkbutton({
		onClick: () => { btn_test_test() }
	})

	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated(ev.detail.width, ev.detail.height)
	})	



	obj_progress.hide()
	// btn_load_click()
	// // test
	// grd_list.fill(getdata())

	// let i = 0
	// let s = 'list'
	// setInterval(()=>{
	// 	if (s=='list') {
	// 		++i
	// 		console.log(i)
	// 		try {
	// 			var record = grd_list.DATA["1"]
	// 			$ui.getPages().ITEMS['pnl_edit'].handler.open(record)
	// 			$ui.getPages().show('pnl_edit')			
	// 			s = 'edit'
	// 		} catch (err) {
	// 			console.log(err)
	// 		}

		
	// 	} else {
	// 		$ui.getPages().show('pnl_list')
	// 		s = 'list'
	// 	}
		
	// }, 500)	
}


export function OnSizeRecalculated(width, height) {
}


export function updategrid(data, trid) {
	if (trid==null) {
		grd_list.fill([data])
		trid = grd_list.getLastId()
		
	} else {
		grd_list.update(trid, data)
	}

	return trid
}


export function removerow(trid) {
	grd_list.removerow(trid)
}

export function scrolllast() {
	$(window).scrollTop(last_scrolltop)

}

function btn_load_click() {

	grd_list.clear()

	var fn_listloading = async (options) => {
		var search = txt_search.textbox('getText')
		if (search!='') {
			options.criteria['search'] = search
		}
	}

	var fn_listloaded = async (result, options) => {
		// console.log(result)
	}

	grd_list.listload(fn_listloading, fn_listloaded)
}

function btn_new_click() {
	$ui.getPages().ITEMS['pnl_edit'].handler.createnew()
	$ui.getPages().show('pnl_edit')	
}


function grd_list_rowformatting(tr) {

}

function grd_list_rowclick(tr, ev) {
	// console.log(tr)
	var trid = tr.getAttribute('id')
	var dataid = tr.getAttribute('dataid')
	var record = grd_list.DATA[dataid]
	// console.log(record)

	last_scrolltop = $(window).scrollTop()
	$ui.getPages().ITEMS['pnl_edit'].handler.open(record, trid)
	$ui.getPages().show('pnl_edit')	
}

function grd_list_cellclick(td, ev) {
	// console.log(td)
	// ev.stopPropagation()
}

function grd_list_cellrender(td) {
	// var text = td.innerHTML
	// if (td.mapping == 'id') {
	// 	// $(td).css('background-color', 'red')
	// 	td.innerHTML = `<a href="javascript:void(0)">${text}</a>`
	// }
}

function grd_list_rowrender(tr) {
	var dataid = tr.getAttribute('dataid')
	var record = grd_list.DATA[dataid]

	$(tr).find('td').each((i, td) => {
		// var mapping = td.getAttribute('mapping')
		// if (mapping=='id') {
		// 	if (!record.disabled) {
		// 		td.classList.add('fgtable-rowred')
		// 	}
		// }
		if (record.disabled=="1" || record.disabled==true) {
			td.classList.add('fgtable-row-disabled')
		} else {
			td.classList.remove('fgtable-row-disabled')
		}
	})
}


function getdata() {
	return [
		{nama:'agung', id:'123', alamat:'jakarta', hd:'1', disabled: 0, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{id:'124', nama:'joni', alamat:'medan', hd:'2', disabled: 0, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{alamat:'semarang', nama:'non', id:'126', hd:'4', disabled: 0, tanggal:'21/03/2019', gender:'P', gendername:'Perempuan'},
		{nama:'andi', id:'127', alamat:'mojokerto', hd:'1', disabled: 0, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{nama:'arief', id:'128', alamat:'katen', hd:'1', disabled: 0, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{nama:'maulana', id:'129', alamat:'jogjakarta', hd:'1', disabled: 1, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{nama:'rinto', id:'130', alamat:'mongondow', hd:'1', disabled: 0, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{nama:'siska', id:'131', alamat:'cakung', hd:'1', disabled: 0, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{nama:'kamila', id:'132', alamat:'sleman', hd:'1', disabled: 0, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{nama:'tania', id:'133', alamat:'bandung', hd:'1', disabled: 0, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{nama:'aska', id:'134', alamat:'cimahi', hd:'1', disabled: 1, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{nama:'antyanov', id:'135', alamat:'cinere', hd:'1', disabled: 0, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{nama:'sumvasigh', id:'136', alamat:'mapunggi', hd:'1', disabled: 0, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{nama:'burvgorskian', id:'137', alamat:'reno', hd:'1', disabled: 0, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		{nama:'sanos', id:'138', alamat:'renggo', hd:'1', disabled: 0, tanggal:'01/11/2019', gender:'L', gendername:'Laki-laki'},
		

	]
}


/*
async function btn_test_test_lama() {
	var cookie_uploader_var = 'formdev_uploader_process_id'

	var args = {
		options: {
			process_id: Cookies.get(cookie_uploader_var)
		}
	}
	var apiurl = `${global.modulefullname}/test?c=start`
	
	try {
		var result = await $ui.apicall(apiurl, args)
		if (result.process_id===undefined) {
			throw {errormessage:'api tidak menghasilkan Process Id !'}
		}

		Cookies.set(cookie_uploader_var, result.process_id);
		state.server_pid = result.server_pid

		btn_test.linkbutton('disable')
		btn_test.linkbutton({text:'wait'});
		obj_progress.show()
		
		var report = setInterval(async ()=>{
			// cek laporanna di sini
			console.log('cek status')
			var statuscekurl = `${global.modulefullname}/test?c=status`
			var result = await $ui.apicall(statuscekurl, args)

			console.log(result)

			var err
			if (result==null) {
				err = 'worker error'
			} if (result.error) {
				err = result.errormessage
			}

			if (err) {
				$ui.ShowMessage('Process Error!')
				btn_test.linkbutton('enable')
				btn_test.linkbutton({text:'test'});
				obj_progress.hide()				
				clearInterval(report)
				Cookies.remove(cookie_uploader_var)
			} else {

				if (result.finished===true) {
					btn_test.linkbutton('enable')
					btn_test.linkbutton({text:'test'});
					obj_progress.hide()	
					Cookies.remove(cookie_uploader_var)		
				} else {
					cccc
				}

			}

		}, 2000)


		
	} catch (err) {
		$ui.ShowMessage(err.errormessage)
		console.error(err)
	}
}
*/


// async function fgta_longrun(options) {

// 	if (options.process_cookie===null || options.process_cookie===undefined) {
// 		$ui.ShowMessage(`process_cookie belum didefinisikan`)
// 		return;
// 	}

// 	if (options.api_url_start===null || options.api_url_start===undefined) {
// 		$ui.ShowMessage(`api_url_start belum didefinisikan`)
// 		return;		
// 	}

// 	if (options.api_url_status===null || options.api_url_status===undefined) {
// 		$ui.ShowMessage(`api_url_status belum didefinisikan`)
// 		return;		
// 	}

// 	var process_cookie = options.process_cookie
// 	var api_url_start = options.api_url_start
// 	var api_url_status = options.api_url_status

// 	var onStarting = typeof options.onStarting === 'function' ? options.onStarting : () => {}
// 	var onError = typeof options.onError === 'function' ? options.onError : () => {}
// 	var onProgress = typeof  options.onProgress === 'function' ? options.onProgress : () => {}
// 	var onFinished = typeof options.onFinished === 'function' ? options.onFinished : () => {}
// 	var onTick = typeof options.onTick === 'function' ? options.onTick : () => {}

	
// 	var cookie_uploader_var = process_cookie

// 	var args = {
// 		options: {
// 			process_id: Cookies.get(cookie_uploader_var)
// 		}
// 	}

	
// 	var apiurl = api_url_start
	
// 	try {
// 		var result = await $ui.apicall(apiurl, args)
// 		if (result.respond===undefined) {
// 			throw {errormessage:'Tidak ada respond dari microsevice'}
// 		}

// 		args.options.process_id = result.process_id
// 		if (result.respond.started === true) {
// 			Cookies.set(cookie_uploader_var, result.process_id);

// 			onStarting(result)
			
// 			var report = setInterval(async ()=>{
// 				var statuscekurl = api_url_status
// 				try {

// 					var result = await $ui.apicall(statuscekurl, args)
// 					onTick(result)

// 					if (result.respond===undefined) {
// 						Cookies.remove(cookie_uploader_var)
// 						clearInterval(report)
// 						throw {errormessage:'Tidak ada respond dari microsevice'}
// 					}
	
// 					var status = result.respond
// 					var progress = status.progress
// 					var finished = status.finished || status.started===false
// 					var error = status.error
// 					var errormessage = status.errormessage
	
// 					if (error) {
// 						Cookies.remove(cookie_uploader_var)
// 						clearInterval(report)
// 						throw {errormessage: errormessage}
// 					}
	
// 					if (finished===true) {
// 						obj_progress.progressbar('setValue', 100)
// 						Cookies.remove(cookie_uploader_var)
// 						clearInterval(report)					
// 						setTimeout(()=> {
// 							onFinished(status)
// 						}, 1000)
// 					} else {
// 						onProgress(status)
// 					}


// 				} catch (err) {
// 					clearInterval(report)	
// 					Cookies.remove(cookie_uploader_var)	
// 					onError(err)
// 					if (err.suppresserror!==true) {
// 						$ui.ShowMessage(err.errormessage)
// 					}
// 				}

// 			}, 1000)
// 		}

// 	} catch (err) {
// 		Cookies.remove(cookie_uploader_var)
// 		onError(err)
// 		if (err.suppresserror!==true) {
// 			$ui.ShowMessage(err.errormessage)
// 		}
// 	}
// }




async function __btn_test_test() {


	var textarea = document.getElementById('textarea_progress')

	textarea.value = ''
	obj_progress.progressbar('setValue', 0)

	$ui.fgta_longrun({
		process_cookie:  'formdev_uploader_process_id',
		api_url_start: `${global.modulefullname}/test?c=start`,
		api_url_status: `${global.modulefullname}/test?c=status`,
		onStarting: (params) => {
			btn_test.linkbutton('disable')
			btn_test.linkbutton({text:'wait'});
			obj_progress.show()
		},
		onError: (err) => {
			obj_progress.hide()	
			btn_test.linkbutton('enable')
			btn_test.linkbutton({text:'test'});
			// $ui.ShowMessage(err.errormessage)
		},
		onProgress:(status) => {
			obj_progress.progressbar('setValue', status.progress)
		},
		onFinished:(status) => {
			obj_progress.hide()	
			btn_test.linkbutton('enable')
			btn_test.linkbutton({text:'test'});
		},
		onTick: (status) => {
			textarea.value += JSON.stringify(status) + '\n'
			textarea.scrollTop = textarea.scrollHeight;
			var finished = status.respond === undefined ? false : status.respond.finished
			if (finished) {
				obj_progress.progressbar('setValue', 100)
			}
		}
	})

}



async function btn_test_test() {
	
}