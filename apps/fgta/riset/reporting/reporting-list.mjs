var this_page_id;
var this_page_options;

import {fgta4report} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4report.mjs'

const dt_report_date = $('#pnl_list-dt_report_date');
const btn_export = $('#pnl_list-btn_export');
const btn_print = $('#pnl_list-btn_print');
const btn_load = $('#pnl_list-btn_load');
const obj_report = $('#obj_report')


let last_scrolltop = 0
let rpt = {}

export async function init(opt) {
	this_page_id = opt.id;
	this_page_options = opt;

	rpt = new fgta4report(obj_report, {
		OnReportLoaded: (iframe) => { obj_report_loaded(iframe) },
		OnReportLoadingError: (err) => {  obj_report_loadingerror(err) },
	})
	
	btn_load.linkbutton({ onClick: () => { btn_load_click(); } });
	btn_print.linkbutton({ onClick: () => { btn_print_click(); } });
	btn_export.linkbutton({ onClick: () => { btn_export_click(); } });

	btn_export.linkbutton('disable');
	btn_print.linkbutton('disable');
	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated(ev.detail.width, ev.detail.height)
	})	

}


export function OnSizeRecalculated(width, height) {
	var rpt_container = document.getElementById('rpt_container');
	var report_height = height - rpt_container.offsetTop;
	console.log('h', report_height);
	rpt_container.style.height = `${report_height}px`;
}


function obj_report_loaded(iframe) {
	if (typeof iframe.contentWindow.onReportLoaded === 'function') {
		iframe.contentWindow.onReportLoaded(()=>{
			console.log('report loaded');
			document.body.style.cursor = 'default'
			rpt.reportloaded();
			btn_load.linkbutton('enable');
			btn_export.linkbutton('enable');
			btn_print.linkbutton('enable');
		})
	}
}

function obj_report_loadingerror(err) {
	console.error(err);
	document.body.style.cursor = 'default'
	btn_load.linkbutton('enable');
	btn_export.linkbutton('disable');
	btn_print.linkbutton('disable');

}


function btn_load_click() {
	var dt = dt_report_date.datebox('getValue');
	var reportmodule = window.global.modulefullname + '/reporting.xprint?renderto=printtemplate.phtml&format=print-format-01-a4-potrait';
	// var reportmodule = window.global.modulefullname + '/reporting.xprint?renderto=printtemplate.phtml&template=print-format-01-a4-landscape';
	
	
	var params = {
		dt: '2023-01-07'
	}

	document.body.style.cursor = 'wait'
	btn_load.linkbutton('disable');
	btn_export.linkbutton('disable');
	btn_print.linkbutton('disable');

	console.log('test');
	console.log('loading report');
	rpt.load(reportmodule, params);
}

function btn_print_click() {
	rpt.print();
}

function btn_export_click() {
	rpt.export('obj_reporttable', 'ReportTable.xlsx', 'TrialBalance');
}