var this_page_id;
var this_page_options;


import {fgta4report} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4report.mjs'

const btn_refresh = $('#<!--__PANELNAME__-->-btn_refresh');
const btn_print = $('#<!--__PANELNAME__-->-btn_print');
const obj_report = $('#<!--__PANELNAME__-->-obj_report')

let rpt = {}
let current_doc = {};


export async function init(opt) {
	this_page_id = opt.id
	this_page_options = opt;

	rpt = new fgta4report(obj_report, {
		OnReportLoaded: (iframe) => { obj_report_loaded(iframe) },
		OnReportLoadingError: (err) => {  obj_report_loadingerror(err) },
	})

	btn_refresh.linkbutton({ onClick: () => { btn_refresh_click(); } });
	btn_print.linkbutton({ onClick: () => { btn_print_click(); } });


	document.addEventListener('OnButtonBack', (ev) => {
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			ev.detail.cancel = true;
			$ui.getPages().show('pnl_edit')
		}
	})

	document.addEventListener('OnButtonHome', (ev) => {
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			ev.detail.cancel = true;
		}
	})

	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated(ev.detail.width, ev.detail.height)
	})	
}

export function OnSizeRecalculated(width, height) {
}

function obj_report_loaded(iframe) {
	if (typeof iframe.contentWindow.onReportLoaded === 'function') {
		iframe.contentWindow.onReportLoaded(()=>{
			console.log('report loaded');
			document.body.style.cursor = 'default'
			rpt.reportloaded();
			btn_print.linkbutton('enable');
		})
	}
}

function obj_report_loadingerror(err) {
	console.error(err);
	document.body.style.cursor = 'default'
	btn_print.linkbutton('disable');

}

export function PreviewForm(doc, forcereload) {
	if (forcereload===undefined) {
		if (doc.id==current_doc.id) {
			return;
		}
	}

	current_doc = doc;

	var id = doc.id;
	var variancename = doc.variancename;
	var reportmodule = doc.reportmodule;

	var params = {
		id: id,
		variancename: variancename
	}

	document.body.style.cursor = 'wait'
	btn_print.linkbutton('disable');

	console.log('loading report');
	rpt.load(reportmodule, params);
}

function btn_refresh_click() {
	PreviewForm(current_doc, true);
}

function btn_print_click() {
	rpt.print();
}