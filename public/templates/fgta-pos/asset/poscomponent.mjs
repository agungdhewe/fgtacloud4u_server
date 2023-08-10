

export function setAsStateKeyEvent(obj) {
	// clear data dulu
	for (var key in obj){
		if (obj.hasOwnProperty(key)){
			delete obj[key];
		}
	}

	obj.paused = false;
	obj.tempHandler = null, 
	obj.pause = (paused) => {
		obj.paused = paused;
		if (!paused) {
			obj.tempHandler = null;
		}
	}
}




export async function alert(options) {
	options.dismissible = false;
	options.endingTop = '50%'

	var stateKeyEvent = {};
	if (options.stateKeyEvent!=null) {
		stateKeyEvent = options.stateKeyEvent;
	} else {
		setAsStateKeyEvent(stateKeyEvent);
		options.stateKeyEvent = stateKeyEvent;
	}

	options.buttons = {
		ok: {
			text: 'Ok',
			action: (modal) => {
				stateKeyEvent.pause(false);
				modal.close();
				return 'ok';
			}
		},
	}

	stateKeyEvent.pause(true);
	await create_modal(options);
}



export async function confirm(options) {
	options.dismissible = false;
	options.endingTop = '50%'

	var stateKeyEvent = {};
	if (options.stateKeyEvent!=null) {
		stateKeyEvent = options.stateKeyEvent;
	} else {
		setAsStateKeyEvent(stateKeyEvent);
		options.stateKeyEvent = stateKeyEvent;
	}


	if (options.buttons===undefined) {
		options.buttons = {
			yes: {
				text: 'Yes',
				action: (modal) => {
					stateKeyEvent.pause(false);
					modal.close();
					return 'yes';
				}
			},

			no: {
				text: 'No',
				action: (modal) => {
					stateKeyEvent.pause(false);
					modal.close();
					return 'no';
				}
			}
		}
	}

	stateKeyEvent.pause(true);
	return await create_modal(options);
}



async function create_modal(options) {
	return new Promise((resolve, reject)=>{

		var id = options.id ?? window.uniqid();
		var text = options.text ?? "";
		var buttons = options.buttons ?? {ok: {text:'<b>Ok</b>', action: (modal)=>{ modal.close(); }}}
		
		var elmc = document.getElementById('modal-container');
		var elmo = document.createElement('div'); // our modal frame
	
		elmo.id = id;
		elmo.classList.add('modal'); // class from materialize css
		elmo.classList.add('modal-center');
	
		var elco = document.createElement('div'); //modal content
		elco.classList.add('modal-content');
	
		if (options.title!=null) {
			var elti = document.createElement('h4');
			elti.innerHTML = options.title;
			elco.appendChild(elti);
		}
	
		if (options.shortcuts==null) {
			options.shortcuts = {};
		}

		var eltx = document.createElement('p'); // modal text
		eltx.innerHTML = text;
		elco.appendChild(eltx);
		elmo.appendChild(elco);
	
	
		var elfo = document.createElement('p');
		elfo.classList.add('modal-footer');
		elfo.classList.add('modal-button-container');
	
		var modalbuttons = [];
		for (var buttonname in buttons) {
			var buttontext = buttons[buttonname].text ?? buttonname;
		
			var elbt = document.createElement('a');
			elbt.buttonname = buttonname;
			elbt.classList.add('waves-effect');
			elbt.classList.add('waves-green');
			elbt.classList.add('btn-flat');
			elbt.action = buttons[buttonname].action;

			if (options.shortcuts.hasOwnProperty(buttonname)) {
				elbt.innerHTML = `<b>${buttontext}</b> [${options.shortcuts[buttonname]}]`;
			} else {
				elbt.innerHTML = buttontext;
			}

			
			modalbuttons.push(elbt);
			elfo.appendChild(elbt);
		}
		elmo.appendChild(elfo);
	
		// masukkan modal ke dalam modal container utama;
		elmc.appendChild(elmo);
	

		if (typeof options.onCloseEnd !== 'function') {
			options.onCloseEnd = () => {
				elmo.parentNode.removeChild(elmo);
			}
		}

		var modal = M.Modal.init(elmo, options);
	
		modal.result = null;
		for (let btn of modalbuttons) {
			btn.addEventListener('click', (obj, evt)=>{
				if (typeof btn.action === 'function') {
					modal.result = btn.action(modal);
					resolve(modal.result);
				}
			});
		}
	
		modal.respond = (action) => {
			for (var btn of modalbuttons) {
				if (action == btn.buttonname) {
					btn.dispatchEvent(new Event('click'));
					break;
				}
			}
		}

		options.stateKeyEvent.modal = modal;
		modal.open();
		if (typeof options.onOpened === 'function') {
			options.onOpened(modal);
		}
	});
	
}


export async function initPages(opt, pages) {
	let pg = {
		activePage: null,
		items: {}
	}


	var firstelement = null;
	for (let pagename in pages) {
		pg.items[pagename] = {
			element: pages[pagename].element,
			handler: pages[pagename].handler,
		}
		
		if (firstelement==null) {
			firstelement = pages[pagename].element;
			pg.activePage = pg.items[pagename];
		} else {
			pg.items[pagename].element.classList.add('page-hidden');
		}

		pg.items[pagename].getName = () => { return pagename; }
		pg.items[pagename].Show = (fn_callback) => {
			pospage_show(pg, pagename, fn_callback);
		};
	}

	pg.getPage = (pagename) => {
		return pospage_getPage(pg, pagename);
	}

	pg.getActivePage = () => {
		return postpage_getActivePage(pg);
	}

	if (firstelement!=null) {
		firstelement.classList.remove('page-hidden');
	}

	// init pages
	for (let pagename in pg.items) {
		if (typeof pg.items[pagename].handler.init === 'function') {
			var use_await = pg.items[pagename].use_await===undefined ? false : pg.items[pagename].use_await;
			if (use_await) {
				await pg.items[pagename].handler.init(opt);
			} else {
				pg.items[pagename].handler.init(opt);
			}
		}
	}


	return pg;
}


function pospage_show(pg, pagename, fn_callback) {
	if (pagename==pg.activePage.getName()) {
		return;
	}

	// let previousPage = pg.activePage;
	pg.activePage = pg.items[pagename];
	for (let pname in pg.items) {
		if (pname!=pagename) {
			pg.items[pname].element.classList.add('page-hidden');
		}
	}

	pg.activePage.element.classList.remove('page-hidden');
	if (typeof fn_callback==='function') {
		fn_callback(pg.activePage);
	}
}

function pospage_getPage(pg, pagename) {
	return pg.items[pagename];
}

function postpage_getActivePage(pg) {
	return pg.activePage;
}


export function DataGrid(el, opt) {
	let options = {}
	Object.assign(options, opt)

	var dgv = {
		element: el,
		tbody: el.getElementsByTagName('tbody')[0],
		DATA: {}
	};

	dgv.lastIndex = 0;
	dgv.currentRow = null;
	dgv.previousRow = null;

	var updateSelectedRow = () => {
		if (dgv.previousRow!=null) {
			dgv.previousRow.classList.remove('row-selected');
		}

		if (dgv.currentRow!=null) {
			dgv.currentRow.classList.add('row-selected');
		}
	}


	for (let tr of dgv.tbody.children) {
		if (tr.onclick==null) {
			tr.onclick = () => {
				dgv.previousRow = dgv.currentRow;
				dgv.currentRow = tr;
				updateSelectedRow();
			}
		}
	}

	dgv.clear = async () => {
		var dgvOptions = dgv.getOptions();

		while (dgv.tbody.hasChildNodes()) {
			dgv.tbody.removeChild(dgv.tbody.lastChild);
		}

		dgv.lastIndex = 0;
		dgv.currentRow = null;
		dgv.previousRow = null;
		dgv.DATA = {};

		if (typeof dgvOptions.onItemModified === 'function') {
			await dgvOptions.onItemModified({}, 'clear');
		}

		if (typeof dgvOptions.onCleared === 'function') {
			dgvOptions.onCleared();
		}

		if (typeof dgvOptions.onCalculate === 'function') {
			dgvOptions.onCalculate();
		}
		
	}

	dgv.ArrowUp = () => {
		// console.log('up');
		// console.log(dgv.tbody);
		if (dgv.currentRow==null) {
			dgv.currentRow = dgv.tbody.firstElementChild;
		} else {
			if (dgv.currentRow.previousElementSibling!=null) {
				dgv.previousRow = dgv.currentRow;
				dgv.currentRow = dgv.currentRow.previousElementSibling;
			}
		}

		updateSelectedRow();
		if (dgv.currentRow!=null) {
			// dgv.currentRow.scrollIntoView(true);
			dgv.currentRow.scrollIntoView({block: 'nearest',  behavior: 'smooth'}); 
		}
	}

	dgv.ArrowDown = () => {
		// console.log('down');
		if (dgv.currentRow==null) {
			dgv.currentRow = dgv.tbody.firstElementChild;
		} else {
			if (dgv.currentRow.nextElementSibling!=null) {
				dgv.previousRow = dgv.currentRow;
				dgv.currentRow = dgv.currentRow.nextElementSibling;
			}
		}

		updateSelectedRow();
		if (dgv.currentRow!=null) {
			// dgv.currentRow.scrollIntoView(false); 
			dgv.currentRow.scrollIntoView({block: 'nearest',  behavior: 'smooth'}); 
		}
	}

	dgv.remove = async (tr) => {
		var dgvOptions = dgv.getOptions();
		var next_tr;

		if (tr.nextElementSibling!=null) {
			next_tr = tr.nextElementSibling;
		} else if (tr.previousElementSibling!=null) {
			next_tr = tr.previousElementSibling;
		} else {
			next_tr = null;
		}

		let rowdata = dgv.DATA[tr.id];
		if (document.getElementById(tr.id)!=null) {
			tr.parentNode.removeChild(tr);
			
			// pindah row
			dgv.previousRow = null;
			dgv.currentRow = next_tr;
		}

		if (dgv.DATA.hasOwnProperty(tr.id)) {
			delete dgv.DATA[tr.id];
		}

		if (typeof dgvOptions.onItemModified === 'function') {
			await dgvOptions.onItemModified({
				row_id: tr.id,
				rowdata: rowdata
			}, 'remove');
		}

		if (typeof dgvOptions.onRowRemoved === 'function') {
			dgvOptions.onRowRemoved(tr);
		}

		updateSelectedRow();
		if (dgv.currentRow!=null) {
			dgv.currentRow.scrollIntoView({block: 'nearest',  behavior: 'smooth'}); 
		}

		if (typeof dgvOptions.onCalculate === 'function') {
			dgvOptions.onCalculate();
		}

	}


	dgv.add = async (row, options) => {
		var dgvOptions = dgv.getOptions();
		var date = new Date();
		var unixTimeStamp = Math.floor(date.getTime()/1000);
		// var iter = Object.keys(dgv.DATA).length + 1;
		var iter = ++dgv.lastIndex;
		let tr = document.createElement('tr');

		if (options.row_id!=null) {
			tr.id = options.row_id;
		} else {
			tr.id = `row-${unixTimeStamp}-${iter}`;
			options.row_id = tr.id;
		}


		let state = {cancel: false};
		if (typeof dgvOptions.onRowUpdating === 'function') {
			await dgvOptions.onRowUpdating(tr, options.rowdata, state);
		}

		if (state.cancel) {
			return;
		}

		var i = 0;
		for (let column of row) {
			i++;
			let td = document.createElement('td');
			td.id = `${tr.id}-${i}`;
			td.setAttribute('value', column.value);

			if (column.class!=null) {
				var classes = column.class.split(' ');
				for (var classname of classes) {
					td.classList.add(classname);
				}
			}

			var text = column.value;
			if (typeof column.onrender === 'function') {
				text = column.onrender(column.value);
			}
			td.innerHTML = text;

			// handle ondblclick pada kolom
			if (typeof column.ondblclick === 'function') {
				td.addEventListener('dblclick', (evt)=> {
					dgv.previousRow = dgv.currentRow;
					dgv.currentRow = tr;
					updateSelectedRow();
					column.ondblclick(evt, td);
				})
			}

			tr.appendChild(td);
		}

		
		dgv.tbody.appendChild(tr);

		options.rowdata.id = tr.id;
		dgv.DATA[tr.id] = options.rowdata;

		
		tr.addEventListener('click', ()=>{
			dgv.previousRow = dgv.currentRow;
			dgv.currentRow = tr;
			updateSelectedRow();
			if (typeof options.onclick === 'function') {
				options.onclick(options.rowdata);
			}
		});

		dgv.previousRow = dgv.currentRow;
		dgv.currentRow = tr;
		if (options.scrollIntoView===true) {
			updateSelectedRow();	
			setTimeout(()=>{
				dgv.currentRow.scrollIntoView();
			}, 100);	
		}

		if (options.suppress_onmodified!==true) {
			if (typeof dgvOptions.onItemModified === 'function') {
				await dgvOptions.onItemModified(options, 'add');
			}
		}

		if (typeof dgvOptions.onCalculate === 'function') {
			dgvOptions.onCalculate();
		}
	}

	dgv.updateView = async (tr, fn_update) => {
		for (let td of tr.children) {
			td.setValue = (value, text) => {
				td.setAttribute('value', value);
				td.innerHTML = text;
			}
			fn_update(td);			
		}
	}

	dgv.update = async (tr, fn_update) => {
		var dgvOptions = dgv.getOptions();

		let rowdata = dgv.DATA[tr.id];
		let state = {cancel: false};
		if (typeof dgvOptions.onRowUpdating === 'function') {
			await dgvOptions.onRowUpdating(tr, rowdata, state);
		}

		if (state.cancel) {
			return;
		}

		for (let td of tr.children) {
			td.setValue = (value, text) => {
				td.setAttribute('value', value);
				td.innerHTML = text;
			}
			fn_update(td);			
		}

		if (typeof dgvOptions.onItemModified === 'function') {
			await dgvOptions.onItemModified({
				row_id: tr.id,
				rowdata: rowdata
			}, 'update');
		}

		if (typeof dgvOptions.onCalculate === 'function') {
			dgvOptions.onCalculate();
		}

	}

	dgv.getOptions = () => {
		return options;
	}

	dgv.getCurrentRow = () => {
		return dgv.currentRow;
	}

	dgv.getCurrentRowData = () => {
		if (dgv.currentRow==null) {
			return null;
		}
		return dgv.DATA[dgv.currentRow.id];
	}

	dgv.setCurrentRow = (tr) => {
		dgv.previousRow = dgv.currentRow;
		dgv.currentRow = tr;
		updateSelectedRow();	
		setTimeout(()=>{
			dgv.currentRow.scrollIntoView({block: 'nearest',  behavior: 'smooth'});
		}, 100);
	}

	dgv.recalculaterow = (row) => {
		var dgvOptions = dgv.getOptions();
		if (typeof dgvOptions.onCalculate === 'function') {
			dgvOptions.onRowReCalculate(row);
		}
	}

	return dgv;
}



export function mask(message) {
	var body = document.getElementsByTagName('body')[0];
	if(window.self !== window.top) {
		body = window.parent.document.getElementsByTagName('body')[0];
	}
	var div = document.createElement('div');
	div.classList.add('fgta_mask')
	if (message!=null) {
		var dialog = document.createElement('div');
		dialog.innerHTML = message;
		dialog.classList.add('fgta_mask_message');
		div.appendChild(dialog);
	}
	body.appendChild(div);
	return div;
}


export function unmask(masklayer) {
	masklayer.remove();
}