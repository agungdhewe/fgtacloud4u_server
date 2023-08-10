export async function init(opt) {
	// setTimeout(()=>{
	// 	console.log('init print page...');
	// 	if (typeof (global.window_fn_print) === 'function') {
	// 		console.log('print page');
	// 		var param = {}
	// 		global.window_fn_print(param);
	// 	}
	// }, 500);

	var rpt = new XPrintReport({
		elements: {
			Status: document.getElementById('obj_reporttable_loadingmessage'),
			ReportHeader: document.getElementById('obj_report_header'),
			Table: document.getElementById('obj_reporttable'),
			TableHeader: document.getElementById('obj_reporttable_header'),
			ReportFooter: document.getElementById('obj_report_footer'),
		},
		onGenerate: async (rpt) => {
			return await report_generate(rpt)
		}
	});
	rpt.CreateMeasure('report-page-measurement');
	rpt.InitializeReport();	


	await rpt.generate();
	if (typeof (window.report_loaded) === 'function') {
		window.report_loaded();
	}
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
	await sleep(100);
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


function getTotalRows() {
	return 10;  // simulasi 10 baris data
}

function report_format_row(rpt, row, cellclass) {
	var tbody = rpt.options.elements.Table.CurrentTBody;
	var tr = document.createElement('tr');
	tr.innerHTML = `
		<td class="${cellclass} col-no"><div class="cell-row-breaker">${row.no}</div></td>
		<td class="${cellclass} col-descr">${row.descr}</td>
	`;
	tbody.appendChild(tr);
	return tr;
}


async function report_generate(rpt) {

	// console.log('prepare & generate report');
	var reportinfo = await report_prepare();
	var recordpagingcount = Math.ceil(reportinfo.totalrows/reportinfo.recordpagingsize);

	// console.log('loading report data');

	rpt.options.elements.Table.CurrentTBody = document.getElementById('obj_reporttable_body');
	for (var i=0; i<recordpagingcount; i++) {
		var offset = i*reportinfo.recordpagingsize;

		var rowtoload_start = offset + 1;
		var rowtoload_end = offset+reportinfo.recordpagingsize;
		rowtoload_end = rowtoload_end > reportinfo.totalrows ? reportinfo.totalrows : rowtoload_end;
		
		rpt.status(`loading rows ${rowtoload_start}-${rowtoload_end} of ${reportinfo.totalrows}`);
		var reportrows = await report_getdata(reportinfo.caheid, offset, reportinfo.recordpagingsize, reportinfo.totalrows);
		var r = 0;
		for (var row of reportrows) {
			r++;
			var alternatestyle = r%2==0 ? 'cell-row-even' : 'cell-row-odd'; 
			let tr = report_format_row(rpt, row, `cell-default ${alternatestyle}`);
			report_row_claimspace(rpt, tr, `row-${r}`);
		}
	}

	// TOTAL
	let tr = report_format_row(rpt, {no:'', descr:'TOTAL'}, 'cell-footer');
	report_row_claimspace(rpt, tr, `total`);


	// Report Footer
	var footer = document.getElementById('obj_report_footer');
	footer.classList.remove('report-footer-initial');
	rpt.ClaimSpace(footer, 'footer');

	console.log('finalize report');
	rpt.status() // completed
	rpt.finalize();


	// tampilkan QR dokumen
	new QRious({
		element: document.getElementById('elqrcode'),
		size: '54',
		value: global.setup.id,
	});

}


function report_row_claimspace(rpt, tr, descr) {
	var table = rpt.options.elements.Table;
	var tbody = rpt.options.elements.Table.CurrentTBody;
	var claiminfo = rpt.ClaimSpace(tr, descr);
	if (claiminfo.forcebreakbefore) {
		rpt.options.elements.Table.CurrentTBody = document.createElement('tbody');
		tbody = rpt.options.elements.Table.CurrentTBody;
		tbody.classList.add('row-force-pagebreak');
		tbody.appendChild(tr);
		table.appendChild(tbody);
	}
	return tbody;
}



/*
contoh untuk munculin QR Code
$ui.RenderBarcode('elqrcode', (data) => {
	var qr = new QRious({
		element: data.el,
		size: data.size,
		value: data.value
	});

	console.log('init page...');
	adjustPage();
	if (typeof (global.window_fn_print) === 'function') {
		global.window_fn_print();
	}

});
*/
