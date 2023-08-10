let self = {};
let i_test = 0;
let px_per_mm = 3.77;

export async function init(opt) {
	// setTimeout(()=>{
	// 	console.log('init print page...');
	// 	if (typeof (global.window_fn_print) === 'function') {
	// 		console.log('print page');
	// 		var param = {}
	// 		global.window_fn_print(param);
	// 	}
	// }, 500);

	// await report_generate();
	crate_report_pagemeasure('report-page-1');
}


async function report_prepare() {
	// exekusi API untuk prepare report, masukkan ke table cache, hasilnya adalah id cache, dengan urutan yg final
	// var reportinfo = await $ui.apicall(apiurl, args);

	// dummy data
	var reportinfo = {
		caheid: 'xxxxx',
		totalrows: getTotalRows(),
		recordpagingsize: 50
	}

	return reportinfo;
}


async function report_getdata(cacheid, offset, limit, totalrows) {
	// simulate load data

	await sleep(10);
	var data = [];
	for (var i=offset+1; i<=(offset+limit); i++) {
		if (i>totalrows) continue;
		data.push({
			no: i,
			descr: 'test row ' + i
		})
	}
	return data;
}


async function report_generate() {


	self.rowspos = [];

	console.log('prepare & generate report');
	
	var reportinfo = await report_prepare();
	var recordpagingcount = Math.ceil(reportinfo.totalrows/reportinfo.recordpagingsize);

	console.log('loading report data');
	for (var i=0; i<recordpagingcount; i++) {
		var offset = i*reportinfo.recordpagingsize;

		report_status(offset, reportinfo.totalrows);
		var reportrows = await report_getdata(reportinfo.caheid, offset, reportinfo.recordpagingsize, reportinfo.totalrows);
		for (var row of reportrows) {
			await report_format_row(row);
		}
	}

	console.log('finalize report');
	report_status(); // sembunyikan loading status

	// tampilkan report footer
	var el_report_footer = document.getElementById('obj_report_footer');
	el_report_footer.classList.remove('report-footer-hidden');

	

	var pageinfo = report_page_calculate({
		report_header: 'obj_report_header',
		reporttable_header: 'obj_reporttable_header',
		report_footer: 'obj_report_footer'
	});
	report_finalize(pageinfo);


}


async function report_format_row(row) {
	var el_tbody = document.getElementById('obj_reporttable_body');

	// console.log(row);

	var tr = document.createElement('tr');
	tr.innerHTML = `
		<td>${row.no}</td>
		<td>${row.descr}</td>
	`;
	el_tbody.appendChild(tr);
	self.rowspos.push({offsetTop:tr.cells[0].offsetTop, height:tr.offsetHeight});
	// console.log(tr.offsetTop, tr.offsetHeight);
}


function report_status(offset, totalrows) {
	var el_loadinginfo = document.getElementById('obj_reporttable_loadinginfo');
	if (offset!==undefined) {
		var el_msg = document.getElementById('obj_reporttable_loadingmessage');
		el_msg.innerHTML = `loading rows ${offset} of ${totalrows} ...`;
		el_loadinginfo.style.display = 'block';
		scrollTo(0, document.body.scrollHeight); // scroll ke paling bawah
	} else {
		el_loadinginfo.style.display = 'none';
		scrollTo(0, 0); // load selesai, scroll kembali ke paling atas
	}

	
}

function report_page_calculate(eldata) {
	
	var pageheight_mm = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--page-height'));
	var margintop_mm = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--margin-top'));
	var marginbottom_mm = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--margin-bottom'));
	var pageheaderheight_mm = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pageheader-height'));
	var top_gap_mm = margintop_mm + pageheaderheight_mm;
	var bottom_gab_mm = marginbottom_mm;

	var el_table_header = document.getElementById(eldata.reporttable_header);
	// var el_table_firstth = el_table_header.querySelector('thead');
	var table_header_top_mm = (el_table_header.getBoundingClientRect().top / px_per_mm) - margintop_mm;
	var table_header_height_mm = el_table_header.offsetHeight / px_per_mm;

	
	createTextBox(0, margintop_mm);
	createTextBox(margintop_mm+table_header_top_mm, 10);
	// createTextBox(10, 10, px_per_mm);
	// createTextBox(20, 10, px_per_mm);

	var p1_eft_height_mm = pageheight_mm - margintop_mm - marginbottom_mm;   // effective height halaman pertama
	var pn_eft_height_mm = pageheight_mm - top_gap_mm - table_header_height_mm - bottom_gab_mm // effective height halaman kedua, dst

	var pagecount = 1;
	var pages = [];
	
	// console.log(table_header_top_mm, table_header_height_mm)
	// console.log(self.rowspos[0].offsetTop );

	// pages.push({eft_height_mm:p1_eft_height_mm, sisa_space:p1_eft_height_mm}); // halaman 1
	// for (var rowspos of self.rowspos) {
	// 	var currpage = pages[pagecount];
	// 	if (currpage.sisa_space>=rowspos.height) {

	// 	}
	// }


	// var el_report_footer = document.getElementById(eldata.report_footer);
	// var report_footer_height_px = el_report_footer.offsetHeight;
	// var report_footer_height_mm = report_footer_height_px / px_per_mm;
	// var report_footer_top_px = el_report_footer.offsetTop;
	// var report_sub_height_mm = Math.ceil(report_footer_top_px / px_per_mm);


	// var el_report_table_measure = document.getElementById('report-table-measure');
	

	// // el_report_table_measure.classList.add('report-table-measure');
	// // el_report_table_measure.style.height = `${report_sub_height_mm}mm`;
	

	// console.log('p1_eft_height_mm', p1_eft_height_mm);
	// console.log('pn_eft_height_mm', pn_eft_height_mm);
	// console.log('report_sub_height_mm', report_sub_height_mm);
	// console.log('table_measure', Math.ceil(el_report_table_measure.offsetHeight / px_per_mm))

	// var pagecount = 0;
	// var sisa_halaman_mm = 0;
	// var sisa_content_mm = report_sub_height_mm;
	// var report_footer_offset_mm = 0;

	// if (p1_eft_height_mm>report_sub_height_mm) {
	// 	sisa_content_mm = 0;
	// 	sisa_halaman_mm = p1_eft_height_mm - report_sub_height_mm;
	// } else {
	// 	sisa_content_mm = report_sub_height_mm - p1_eft_height_mm;
	// 	sisa_halaman_mm = 0;
	// }
	// pagecount = 1;

	// if (sisa_content_mm > 0) {
	// 	pagecount = 1 + Math.ceil(sisa_content_mm / pn_eft_height_mm);
	// 	sisa_halaman_mm = pn_eft_height_mm - (sisa_content_mm % pn_eft_height_mm);
	// }
	// sisa_halaman_mm = sisa_halaman_mm - table_header_height_mm;
	
	// // console.log('p/sc/pc/sh', pagecount, sisa_content_mm, sisa_halaman_mm);
	// if (sisa_halaman_mm > 0 && sisa_halaman_mm < report_footer_height_mm ) {
	// 	console.log('tambah satu halaman lagi untuk footer');
	// 	// tambah satu halaman lagi untuk menampilkan footer
	// 	pagecount++; 
	// 	// report_footer akan muncul di satu halaman terakhir sendirian,
	// 	// sehingga perlu digeser sejauh top_gap_px kebawah untuk menampilkan page header
	// 	report_footer_offset_mm = top_gap_mm;
	// }
	// // console.log('p/sc/pc/sh', pagecount, sisa_content_mm, sisa_halaman_mm);
	// console.log(pagecount);

	var ret = {
		eldata: eldata
	}

	return ret;
}


function getTotalRows() {
	return 10;
}

function report_finalize(pageinfo) {
	// tampilkan footer
	var eldata = pageinfo.eldata;


}


function crate_report_pagemeasure(id) {
	// buat page measure
	var el_pagemeasure = document.createElement('div');
	el_pagemeasure.id = id;
	el_pagemeasure.classList.add('pagemeasure');
	document.body.appendChild(el_pagemeasure);

	var pageheight_mm = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--page-height'));
	var measurerect = el_pagemeasure.getBoundingClientRect();
	var measureheight_px = measurerect.bottom - measurerect.top;	

	px_per_mm = measureheight_px / pageheight_mm;
}

async function sleep(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(()=>{
			resolve();
		}, ms)
	})
}

function createTextBox(top_mm, height_mm) {
	i_test++;

	var el = document.createElement('div')
	el.id = "testbox-" + i_test;
	el.classList.add('testbox');
	el.style.top = `${top_mm * px_per_mm}px`;
	el.style.height = `${(height_mm * px_per_mm)-2}px`;
	if (i_test%2 == 0) {
		el.style.border = `1px solid red`;
		el.style.backgroundColor = 'red'
	} else {
		el.style.border = `1px solid blue`;
		el.style.backgroundColor = 'blue'
	}
	

	document.body.appendChild(el);
}