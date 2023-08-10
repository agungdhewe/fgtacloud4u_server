import {fgta4grid} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4grid.mjs'
import {fgta4form} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4form.mjs'
import * as fgta4pages from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4pages.mjs'
import * as fgta4pageslider from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4pageslider.mjs'
import * as settings from './fguser.settings.mjs'
import * as apis from './fguser.apis.mjs'
import * as pList from './fguser-list.mjs'
import * as pEdit from './fguser-edit.mjs'
import * as pEditGroupsgrid from './fguser-groupsgrid.mjs'
import * as pEditGroupsform from './fguser-groupsform.mjs'
import * as pEditFavegrid from './fguser-favegrid.mjs'
import * as pEditFaveform from './fguser-faveform.mjs'



const pnl_list = $('#pnl_list')
const pnl_edit = $('#pnl_edit')
const pnl_editgroupsgrid = $('#pnl_editgroupsgrid')
const pnl_editgroupsform = $('#pnl_editgroupsform')
const pnl_editfavegrid = $('#pnl_editfavegrid')
const pnl_editfaveform = $('#pnl_editfaveform')



var pages = fgta4pages;
var slider = fgta4pageslider;


export const SIZE = {width:0, height:0}


export async function init(opt) {
	// $ui.grd_list = new fgta4grid()
	// $ui.grd_edit = new fgta4grid()

	global.fgta4grid = fgta4grid
	global.fgta4form = fgta4form



	$ui.apis = apis
	document.getElementsByTagName("body")[0].style.margin = '5px 5px 5px 5px'

	opt.variancedata = global.setup.variancedata;
	settings.setup(opt);

	pages
		.setSlider(slider)
		.initPages([
			{panel: pnl_list, handler: pList},
			{panel: pnl_edit, handler: pEdit},
			{panel: pnl_editgroupsgrid, handler: pEditGroupsgrid},
			{panel: pnl_editgroupsform, handler: pEditGroupsform},
			{panel: pnl_editfavegrid, handler: pEditFavegrid},
			{panel: pnl_editfaveform, handler: pEditFaveform}			
		], opt)

	$ui.setPages(pages)


	document.addEventListener('OnButtonHome', (ev) => {
		if (ev.detail.cancel) {
			return
		}

		ev.detail.cancel = true;
		ExitModule();
	})
	
	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated(ev.detail.width, ev.detail.height)
	})	



	await PreloadData()

}


export function OnSizeRecalculated(width, height) {
	SIZE.width = width
	SIZE.height = height
}

export async function ExitModule() {
	$ui.home();
}



async function PreloadData() {
	
}