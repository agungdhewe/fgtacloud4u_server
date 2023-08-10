import {fgta4grid} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4grid.mjs'
import {fgta4form} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4form.mjs'
import * as fgta4pages from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4pages.mjs'
import * as fgta4pageslider from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4pageslider.mjs'
import * as apis from './formgenjurn.apis.mjs'
import * as pList from './formgenjurn-list.mjs'
import * as pEdit from './formgenjurn-edit.mjs'
import * as pEditJurnaldetilgrid from './formgenjurn-jurnaldetilgrid.js'
import * as pEditJurnaldetilform from './formgenjurn-jurnaldetilform.js'
import * as pEditJurnalpaymngrid from './formgenjurn-jurnalpaymngrid.js'
import * as pEditJurnalpaymnform from './formgenjurn-jurnalpaymnform.js'
import * as pEditInfo from './formgenjurn-info.js'
import * as pEditLog from './formgenjurn-log.js'



const pnl_list = $('#pnl_list')
const pnl_edit = $('#pnl_edit')
const pnl_editjurnaldetilgrid = $('#pnl_editjurnaldetilgrid')
const pnl_editjurnaldetilform = $('#pnl_editjurnaldetilform')
const pnl_editjurnalpaymngrid = $('#pnl_editjurnalpaymngrid')
const pnl_editjurnalpaymnform = $('#pnl_editjurnalpaymnform')
const pnl_editinfo = $('#pnl_editinfo')
const pnl_editlog = $('#pnl_editlog')



var pages = fgta4pages;
var slider = fgta4pageslider;


export const SIZE = {width:0, height:0}


export async function init() {
	// $ui.grd_list = new fgta4grid()
	// $ui.grd_edit = new fgta4grid()

	global.fgta4grid = fgta4grid
	global.fgta4form = fgta4form

	$ui.apis = apis
	document.getElementsByTagName("body")[0].style.margin = '5px 5px 5px 5px'

	pages
		.setSlider(slider)
		.initPages([
			{panel: pnl_list, handler: pList},
			{panel: pnl_edit, handler: pEdit},
			{panel: pnl_editjurnaldetilgrid, handler: pEditJurnaldetilgrid},
			{panel: pnl_editjurnaldetilform, handler: pEditJurnaldetilform},
			{panel: pnl_editjurnalpaymngrid, handler: pEditJurnalpaymngrid},
			{panel: pnl_editjurnalpaymnform, handler: pEditJurnalpaymnform},
			{panel: pnl_editinfo, handler: pEditInfo},
			{panel: pnl_editlog, handler: pEditLog}			
		])

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