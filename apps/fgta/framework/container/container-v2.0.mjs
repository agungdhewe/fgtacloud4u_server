import * as fgta4pageslider from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4pageslider.mjs'
import * as sidenav from '../../../../../index.php/public/jslibs/fgta/fgta-sidenav.mjs'


// const btn_apps_back = $('#btn_apps_back')
// const btn_menu_back = $('#btn_menu_back')
// const btn_home = $('#btn_home')
// const btn_reload = $('#btn_reload');
// const btn_logout = $('#btn_logout')
const EL_HOME_NAME  = '__fgtamodule-home__';

const obj_search = document.getElementById('obj_search');

const btn_menuopen = document.getElementById('btn_menu_open');
const btn_menuclose = document.getElementById('btn_menu_close');
const btn_menuback = document.getElementById('btn_menu_back');
const btn_menuhome = document.getElementById('btn_menuhome');
const btn_menureload = document.getElementById('btn_menureload');
const btn_appsback = document.getElementById('btn_apps_back');
const btn_appshome = document.getElementById('btn_appshome');
const btn_test = document.getElementById('btn_test');
const btn_pref = document.getElementById('btn_preference');
const btn_logout = document.getElementById('btn_logout');
const btn_search = document.getElementById('sidenav-btn_search');

const pnl_menu = document.getElementById('pnl_menu');
const pnl_menulist = document.getElementById('pnl_menu-list');
const pnl_contents = document.getElementById('pnl_contents');
const txt_appstitle = document.getElementById('txt_appstitle');
const txt_menutitle = document.getElementById('txt_menutitle');


const MENUS = [];
const MODULES = {};
const api = {
	listmodules: 'fgta/framework/container/listmodules'
}

export const CurrentState = {
	HOME: null,
	CurrentModuleId: null,
	MenuLevel: 1,
	ContainerTitle: "---",
	LastMenuTitle: "",
	LastMenuParentId: null,
	SlowLoading: false,
}





export async function init() {
	sidenav.set(pnl_menu, {
	})


	btn_menuopen.addEventListener('click', ()=>{ btn_menuopen_click() });
	btn_menuclose.addEventListener('click', ()=>{ btn_menuclose_click() });
	btn_menuback.addEventListener('click', ()=>{ btn_menuback_click() });
	btn_menuhome.addEventListener('click', ()=>{ btn_menuhome_click() });
	btn_menureload.addEventListener('click', ()=>{ btn_menureload_click() });
	btn_appsback.addEventListener('click', () => { btn_appsback_click() });
	btn_appshome.addEventListener('click', () => { btn_appshome_click() });
	btn_pref.addEventListener('click', ()=>{ btn_pref_click() });
	btn_logout.addEventListener('click', ()=>{ btn_logout_click() });
	btn_search.addEventListener('click', ()=>{ btn_search_click() });



	obj_search.addEventListener('keydown', (evt)=>{
		obj_search_keydown(evt);
	});


	prepareContainerAccess()
	prepareBackButton();
	OpenHomeModule();
	load_menus();

}

export function OnSizeRecalculated(width, height) {
	// console.log(width, height);
}


export function OpenModule(module, fn_loaded) {
	// console.log(`opening module ...`);
	// console.log(module);

	var module_id;
	if (module._id!==undefined) {
		module_id = module._id;
	} else {
		module_id = module.modulefullname;
		if (module.variancename!==undefined) {
			module_id = module_id + '-' + module.variancename;
		}
	}

	var prev_module_id = CurrentState.CurrentModuleId;
	CurrentState.CurrentModuleId = module_id;
	if (prev_module_id) {
		if (MODULES.hasOwnProperty(prev_module_id)) {
			var prev_iframe = MODULES[prev_module_id].iframe;
			prev_iframe.classList.add('hidden-iframe');
		}
	}


	var prev_module_id = CurrentState.CurrentModuleId;
	CurrentState.CurrentModuleId = module_id;
	if (prev_module_id) {
		if (MODULES.hasOwnProperty(prev_module_id)) {
			var prev_iframe = MODULES[prev_module_id].iframe;
			prev_iframe.classList.add('hidden-iframe');
		}
	}

	var moduledata;
	if (!MODULES.hasOwnProperty(module_id)) {
		// buat iframe
		var origin = window.location.origin;
		var pathname = window.location.pathname;
		var path = pathname.split('index.php')[0];
		var base_url = origin + path;
		var module_url = base_url + 'index.php/module/' + module.modulefullname + '?variancename=' + (module.variancename===undefined ? '' : module.variancename);

		var iframe = document.createElement('iframe');
		iframe.classList.add('content-iframe');
		pnl_contents.appendChild(iframe);
		iframe.id = module_id;
		iframe.src = module_url;
		iframe.addEventListener('load', ()=>{
			var title = iframe.contentWindow.document.getElementsByTagName('title')[0];
			txt_appstitle.innerHTML = title.innerHTML;
			iframe.focus();
		});

		moduledata = {id: module_id, iframe: iframe};
		MODULES[module_id] = moduledata;
	} else {
		moduledata = MODULES[module_id];
		var iframe = moduledata.iframe;
		iframe.classList.remove('hidden-iframe');
		
		var title = iframe.contentWindow.document.getElementsByTagName('title')[0];
		txt_appstitle.innerHTML = title.innerHTML;
		iframe.focus();
	}

	btn_appsback.classList.remove('hidden');
	if (typeof fn_loaded === 'function') {
		fn_loaded(moduledata)
	}


}


export async function prepareContainerAccess() {
	window.getModules = () => {
		return MODULES;
	}

	// window.reopenModule = (module) => {
	// 	OpenModule({
	// 		_id: module._id
	// 	});
	// } 

	window.OpenModule = (module) => {
		OpenModule(
			{
				_id: module._id,
				modulefullname: module.modulefullname, 
				variancename: module.variancename, 
				url_param: module.url_param
			}, (moduledata)=>{
				if (MODULES.hasOwnProperty(module._id)) {
					MODULES[module._id].opened=true;
				}

				var buttoncontainer = document.getElementById('btn' + module._id);
				if (buttoncontainer!=null) {
					var btn = buttoncontainer.getButton();
					btn.indicatorlamp.classList.remove('hidden');
				}

				txt_menutitle.innerHTML = module.title;
				addToOpenedApps(module);
			}
		)	
	}


	window.removeModule = (module) => {
		if (MODULES.hasOwnProperty(module._id)) {
			delete MODULES[module._id];
		}
		var iframe = document.getElementById(module._id);
		if (iframe!=null) {
			iframe.remove();
		}
		var btncontainer = document.getElementById('btn' + module._id);
		if (btncontainer!=null) {
			var btn = btncontainer.getButton();
			if (btn!=null) {
				btn.indicatorlamp.classList.add('hidden');
			};
		}
	}
}

export async function prepareBackButton() {
	btn_menuback.setState = () => {
		if (btn_menuback.MDATA===undefined) {
			btn_menuback.classList.add('hidden');
		} else if (btn_menuback.MDATA.length<=0) {
			btn_menuback.classList.add('hidden');
		} else {
			btn_menuback.classList.remove('hidden');
		}
	}

	btn_menuback.push = (data) => {  
		if (btn_menuback.MDATA===undefined) {
			btn_menuback.MDATA = [];
		}
		btn_menuback.MDATA.push(data);
		btn_menuback.setState();
	}

	btn_menuback.pop = () => {  
		var data;
		if (btn_menuback.MDATA===undefined) {
			data = [];
		} else {
			data = btn_menuback.MDATA.pop();
		}
		btn_menuback.setState();
		return data;
	}

	btn_menuback.getCurrent = ()=>{
		if (btn_menuback.MDATA.length>0) {
			return btn_menuback.MDATA[btn_menuback.MDATA.length-1];
		} else {
			return null;
		}
	}
}


export async function load_menus() {
	let ajax_args = {
		username: window.userdata.username
	}

	let ajax_listmodules = async (args, fn_callback) => {
		let apiurl = api.listmodules
		try {
			let result = await $ui.apicall(apiurl, args)
			fn_callback(null, result)
		} catch (err) {
			fn_callback(err)
		}
	}

	// $ui.mask('loading menu ...')
	ajax_listmodules(ajax_args,  async(err, result) => {
		if (err) {
			console.error(err)
			// if (err.errormessage!=null) pnl_menu.html(err.errormessage)
		} else {

			module_index(result);

			try {
				let module = {
					id: 0,
					level: 1,
					title: "Menu",
					type: 'topparent',
					MODULES: result				
				}
				CurrentState.HOME = module;
				// txt_menutitle.innerHTML = module.title;
				// btn_menuback.push(module);
				// await DisplayMenus(pnl_menulist, module.MODULES);
				btn_menuhome_click();
			} catch (err) {
				console.log(err);
			} finally {
				var loadindicator = document.getElementById('pnl_containerloading');
				if (loadindicator!=null) {
					loadindicator.remove();
				}
				
			}
		}
	});	
}


export async function DisplayMenus(pnl, modules) {
	pnl.innerHTML = '';
	for (let module of modules) {
		var btn;
		if (module.type=='modulegroup') {
			// direktori
			btn = CreateDirectoryButton(pnl, module);
			pnl.appendChild(btn);
		} else {
			// program
			var btn_id = 'btn' + module._id;
			if (document.getElementById(btn_id)==null) {
				btn = CreateProgramButton(pnl, module);
				btn.id = btn_id;
				pnl.appendChild(btn);
			}
		}
	}
}


async function module_index(MODS) {
	// console.log(MODS);
	for (let module of MODS) {
		if (Array.isArray(module.MODULES)) {
			module_index(module.MODULES)
		} else {
			MENUS.push(module);
		}
	}
}


async function obj_search_keydown(evt) {
	if (evt.code=='Enter') {
		if (evt.ctrlKey && evt.altKey) {
			var searchtext = obj_search.value;
			var _id = "__fgtamodule-" + Base64.encode(searchtext) + "__";

			console.log(_id);
			sidenav.close();
			window.OpenModule({
				_id: _id,
				modulefullname: searchtext,
				title: searchtext
			});
		} else {
			btn_search_click();
		}
	}
}



async function btn_menuopen_click() {
	sidenav.open();
}

async function btn_menuclose_click() {
	sidenav.close();
} 

async function btn_menureload_click() {
	load_menus();
}

async function btn_pref_click() {
	sidenav.close();
	OpenModule({
		modulefullname: 'fgta/framework/preference'
	})
}

async function btn_logout_click() {
	$ui.ShowMessage('Apakah anda mau logout ?', {
		Ya: () => {
			sidenav.close();
			console.log('remove cookies');
			Cookies.remove('tokenid', {path: window.urlparams.cookiepath});
			Cookies.remove('userid', {path: window.urlparams.cookiepath});
			Cookies.remove('userfullname', {path: window.urlparams.cookiepath});
			location.reload();
		},
		Tidak: () => {}
	})
}

async function btn_appsback_click() {
	var module_id = CurrentState.CurrentModuleId;
	if (MODULES.hasOwnProperty(module_id)) {
		var moduledata = MODULES[module_id];
		var iframe = moduledata.iframe;
		if (typeof iframe.contentWindow.back === 'function') {
			iframe.contentWindow.back((cancel) => {
				if (!cancel) {
					OpenHomeModule()
				}
			})		
		} else {
			OpenHomeModule()
		}
	}
}

async function btn_menuback_click() {
	obj_search.value = "";
	if (btn_menuback.MDATA.length==0) {
		btn_menuhome_click();
	} else {
		btn_menuback.pop();
		if (btn_menuback.MDATA.length==0) {
			btn_menuhome_click();
			return;
		}
		var data = btn_menuback.MDATA[btn_menuback.MDATA.length-1];
		txt_menutitle.innerHTML = data.title;
		DisplayMenus(pnl_menulist, data.MODULES);
	}
	
}

async function btn_menuhome_click() {
	if (btn_menuback.MDATA===undefined) {
		btn_menuback.MDATA= [];
	}


	while (btn_menuback.MDATA.length>0) {
		btn_menuback.pop();
	}

	btn_menuback.setState(); 
	var module = CurrentState.HOME;
	txt_menutitle.innerHTML = module.title;
	await DisplayMenus(pnl_menulist, module.MODULES);
}

async function btn_appshome_click() {
	OpenHomeModule();
}

async function btn_search_click() {
	var result = [];
	var searchtext = obj_search.value;

	if (searchtext.trim()=="") {
		return;
	}

	for (var menu of MENUS) {
		var re = new RegExp(searchtext, "i");
		if (menu.title.search(re)>=0) {
			result.push(menu);
		}
	}

	var module = {
		title: searchtext,
		MODULES: result
	}

	if (btn_menuback.MDATA.length==0) {
		btn_menuback.push(CurrentState.HOME);
	} else 	if (btn_menuback.MDATA[btn_menuback.MDATA.length-1].title!=module.title) {
		btn_menuback.push(module);
	}

	txt_menutitle.innerHTML = module.title;
	DisplayMenus(pnl_menulist, module.MODULES);
}



async function OpenHomeModule() {
	var home_module, home_variance, home_urlparam;

	btn_appsback.classList.add('hidden');
	sidenav.close();
	OpenModule({
		_id: EL_HOME_NAME,
		modulefullname: 'fgta/framework/home'
	}, ()=>{
		btn_appsback.classList.add('hidden');
	});
	
}


function CreateDirectoryButton(pnl, module) {
	return CreateButton(module, (btn)=>{
		btn.style.borderRadius = '14px'
		btn.addEventListener('click', ()=>{
			txt_menutitle.innerHTML = module.title;
			btn_menuback.push(module);
			DisplayMenus(pnl, module.MODULES);
		})
	});
}

function CreateProgramButton(pnl, module) {
	return CreateButton(module, (btn)=>{
		btn.addEventListener('click', ()=>{
			sidenav.close();
			OpenModule(
				{
					_id: module._id,
					modulefullname: module.modulefullname, 
					variancename: module.variancename, 
					url_param: module.url_param
				}, (moduledata)=>{
					if (MODULES.hasOwnProperty(module._id)) {
						MODULES[module._id].opened=true;
					}
					btn.indicatorlamp.classList.remove('hidden');
					txt_menutitle.innerHTML = module.title;
					addToOpenedApps(module);
				}
			)	
		})
	});
}

function CreateButton(module, fn_oncreated) {
	var image = 'index.php/public/images/icons/' + module.icon

	let buttoncontainer = document.createElement('div');
	buttoncontainer.classList.add('menubutton-container')

	let btn = document.createElement('button');
	btn.classList.add('menubutton')
	btn.style.backgroundColor = module.backcolor;
	btn.style.color = module.forecolor;
	btn.innerHTML = CreateButtonContent(image, module.title);

	var btnindicator = document.createElement('div');
	btnindicator.classList.add('menubutton-indicator');

	var indicatorlamp = document.createElement('div');
	indicatorlamp.classList.add('menubutton-indicator-lamp');

	var hidden = true;
	if (MODULES.hasOwnProperty(module._id)) {
		if (MODULES[module._id].opened===true) {
			hidden = false;
		}
	}
	if (hidden) {
		indicatorlamp.classList.add('hidden');
	}
	

	btnindicator.appendChild(indicatorlamp)
	btn.indicatorlamp = indicatorlamp;

	buttoncontainer.getButton = () => {
		return btn;
	}

	buttoncontainer.appendChild(btn);
	buttoncontainer.appendChild(btnindicator);

	fn_oncreated(btn);
	return buttoncontainer;
}


function CreateButtonContent(image, title) {
	return `
		<div class="favebutton-icon">
			<img src="${image}" style="width: 32px; height: 32px">
		</div>
		<div class="favebutton-text">${title}</div>
	`;
}

function addToOpenedApps(module) {
	var iframe = document.getElementById(EL_HOME_NAME);
	if (iframe!=null) {
		if (typeof iframe.contentWindow.addToOpenedApps === 'function') {
			iframe.contentWindow.addToOpenedApps(module);
		}
	}
}
