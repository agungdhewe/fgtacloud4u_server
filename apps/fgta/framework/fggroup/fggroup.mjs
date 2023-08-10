import {fgta4grid} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4grid.mjs'
import {fgta4form} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4form.mjs'
import * as fgta4pages from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4pages.mjs'
import * as fgta4pageslider from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4pageslider.mjs'
import * as settings from './fggroup.settings.mjs'
import * as apis from './fggroup.apis.mjs'
import * as pList from './fggroup-list.mjs'
import * as pEdit from './fggroup-edit.mjs'
import * as pEditGroupdashgrid from './fggroup-groupdashgrid.mjs'
import * as pEditGroupdashform from './fggroup-groupdashform.mjs'
import * as pEditGrouprolegrid from './fggroup-grouprolegrid.mjs'
import * as pEditGrouproleform from './fggroup-grouproleform.mjs'



const pnl_list = $('#pnl_list')
const pnl_edit = $('#pnl_edit')
const pnl_editgroupdashgrid = $('#pnl_editgroupdashgrid')
const pnl_editgroupdashform = $('#pnl_editgroupdashform')
const pnl_editgrouprolegrid = $('#pnl_editgrouprolegrid')
const pnl_editgrouproleform = $('#pnl_editgrouproleform')



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
			{panel: pnl_editgroupdashgrid, handler: pEditGroupdashgrid},
			{panel: pnl_editgroupdashform, handler: pEditGroupdashform},
			{panel: pnl_editgrouprolegrid, handler: pEditGrouprolegrid},
			{panel: pnl_editgrouproleform, handler: pEditGrouproleform}			
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