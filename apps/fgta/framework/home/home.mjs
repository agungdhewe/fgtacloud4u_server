const tbl_openap = document.getElementById('tbl_home-openap');
const pnl_fave = document.getElementById('pnl_fave');

// const btn_test = $('#btn_test');


const OPENEDMODULES = {}
const FAVES = {}

export async function init(opt) {
	//console.log(global);


	window.addToOpenedApps = (module) => {
		addToOpenedApps(module);
	}

	showfavorites();


	// btn_test.linkbutton({
	// 	onClick: () => { btn_test_click() }

	// });
}



function btn_test_click() {
	// $ui.mask('test saja');

	$ui.ShowMessage("[QUESTION]ini aja ok. soalnya ini kalau dibuat seberpti itu bakal gak bener. jadinya jangan dibuat seerti itu. soalnya kalau makasa ini akan jadi anek. coba aja.. iya kan, ngaco nih gambarnya. jangan diulang lagi lah. klalau kaya gini nantinya jadi gak bener."
	, {
		Ok: () => {

		},

		Cancel: () => {
			
		}
	}
	
	);
}



async function showfavorites() {
	var endpoint = 'fgta/framework/home/favelist'
	try {
		var result = await $ui.apicall(endpoint, {});
		
		pnl_fave.innerHTML = '';
		for (let module of result.records) {
			if (module.variancename=='') {
				delete module.variancename;
			}
			addToFavourite(module);
		}

	} catch (err) {
		console.error(err)
	}
}


async function addToFavourite(module) {
	FAVES[module._id] = module;
	FAVES[module._id].fave_id = "fave" + module._id;
	
	let btnfave = createFaveButton(module);
	if (document.getElementById(btnfave.id)==null) {
		pnl_fave.appendChild(btnfave);
	}

	// apicall add fave
	var endpoint = 'fgta/framework/home/faveadd'
	try {
		var result = await $ui.apicall(endpoint, {module: module});
		//console.log(result);
	} catch (err) {
		console.error(err)
	}
}

async function removeFromFavourite(module) {
	var fave_id = module.fave_id;
	if (FAVES.hasOwnProperty(module._id)) {
		delete FAVES[module._id];
	}

	var btnfave = document.getElementById(fave_id);
	if (btnfave!=null) {
		btnfave.remove();
	}

	// apicall remove fave
	var endpoint = 'fgta/framework/home/faveremove'
	try {
		var result = await $ui.apicall(endpoint, {module: module});
		console.log(result);
	} catch (err) {
		console.error(err)
	}
}


function addToOpenedApps(module) {
	console.log('ini dari home iframe');
	console.log(module);

	if (OPENEDMODULES.hasOwnProperty(module._id)) {
		return;
	}


	let tr = document.createElement('tr');

	// add to fave
	var td_appsfave = document.createElement('td');
	td_appsfave.classList.add('home-openap-fave-td');
	
	let lnk_appsfave_add = document.createElement('a');
	lnk_appsfave_add.classList.add('home-openap-fave-lnk');
	lnk_appsfave_add.innerHTML = '<img src="index.php/public/images/icon-fave-off.svg" style="width:12px; height:12px">';
	lnk_appsfave_add.addEventListener('click', ()=>{
		addToFavourite(module);
		lnk_appsfave_add.remove();
		td_appsfave.appendChild(lnk_appsfave_remove);
	});


	let lnk_appsfave_remove = document.createElement('a');
	lnk_appsfave_remove.classList.add('home-openap-fave-lnk');
	lnk_appsfave_remove.innerHTML = '<img src="index.php/public/images/icon-fave-on.svg" style="width:12px; height:12px">';
	lnk_appsfave_remove.addEventListener('click', ()=>{
		removeFromFavourite(module);
		lnk_appsfave_remove.remove();
		td_appsfave.appendChild(lnk_appsfave_add);
	});

	if (FAVES.hasOwnProperty(module._id)) {
		td_appsfave.appendChild(lnk_appsfave_remove);
	} else {
		td_appsfave.appendChild(lnk_appsfave_add);
	}

	tr.appendChild(td_appsfave);



	// appsname
	var td_appsname = document.createElement('td');
	let lnk_appsname = document.createElement('a');
	lnk_appsname.classList.add('home-openap-title-lnk');
	lnk_appsname.innerHTML = module.title;
	lnk_appsname.addEventListener('click', ()=>{
		if (typeof window.parent.OpenModule === 'function') {
			window.parent.OpenModule(module);
		}
	});
	td_appsname.appendChild(lnk_appsname);
	td_appsname.classList.add('home-openap-title-td');
	tr.appendChild(td_appsname);

	
	// close apps
	var td_close = document.createElement('td');
	let lnk_close = document.createElement('a');
	lnk_close.classList.add('home-openap-title-lnk');
	lnk_close.innerHTML = '<img src="index.php/public/images/icon-openedapp-close.svg" style="width:12px; height:12px">';
	lnk_close.addEventListener('click', ()=>{
		if (OPENEDMODULES.hasOwnProperty(module._id)) {
			delete OPENEDMODULES[module._id];
		}

		if (typeof window.parent.removeModule === 'function') {
			window.parent.removeModule(module);
		}
		tr.remove();
	});
	td_close.appendChild(lnk_close);
	td_close.classList.add('home-openap-close-td');
	tr.appendChild(td_close);

	OPENEDMODULES[module._id] = tr;
	tbl_openap.appendChild(tr);

}


function createFaveButton(module) {
	if (module.icon==null || module.icon=='') {
		module.icon = 'icon-application-white.png';
	}

	var image = 'index.php/public/images/icons/' + module.icon

	let favecontainer = document.createElement('div');
	favecontainer.id = module.fave_id;
	favecontainer.classList.add('favebutton-container');
	let btn = document.createElement('button');
	btn.classList.add('favebutton');
	btn.addEventListener('click', ()=>{
		if (typeof window.parent.OpenModule === 'function') {
			window.parent.OpenModule(module);
		}
	});

	var icon = document.createElement('div');
	icon.classList.add('favebutton-icon');
	icon.innerHTML = `<img src="${image}" style="width: 32px; height: 32px">`;
	if (module.backcolor!=null && module.backcolor!='') {
		icon.style.backgroundColor = module.backcolor;
	}

	var text = document.createElement('div');
	text.classList.add('favebutton-text');
	text.innerHTML =  module.title;

	btn.appendChild(icon);
	btn.appendChild(text);

	favecontainer.appendChild(btn);
	return favecontainer;
}

