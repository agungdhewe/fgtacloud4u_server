// Untuk simulasi load data
async function sleep(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(()=>{
			resolve();
		}, ms)
	})
}



// function XPrintReport(opt) {

// 	let self = {
// 		options: opt,
// 		px_per_mm: 3.77,
// 		i_test: 0,
// 		last_element_bottom_pos: 0,
// 		pagecount: 0,
// 	};


// 	self.generate = async (param) => {
// 		if (typeof opt.onGenerate === 'function') {
// 			return await opt.onGenerate(self, param);
// 		}	
// 	}
// 	self.CreateMeasure = (id) => { return xprint_CreateMeasure(self, id) };
// 	self.InitializeReport = () => { return xprint_InitializeReport(self) };
// 	self.status = (message) => { return xprint_status(self, message) };
// 	self.ClaimSpace = (el, descr) => { return xprint_ClaimSpace(self, el, descr)  };
// 	self.finalize = () => { return xprint_finalize(self) };
// 	self.CreateMeasurementBox = (top, height, measure) => { return xprint_CreateMeasurementBox(self, top, height, measure) };
// 	self.get_px_per_mm = () => { return self.px_per_mm };

// 	xprint_construct(self);
// 	return self;

// }

function xprint_construct(self) {
}


function xprint_CreateMeasure(self, id) {
	var el_pagemeasure = document.createElement('div');
	el_pagemeasure.id = id;
	el_pagemeasure.classList.add('pagemeasure');
	document.body.appendChild(el_pagemeasure);
	
	var measurerect = el_pagemeasure.getBoundingClientRect();
	var measureheight_px = measurerect.bottom - measurerect.top;

	self.px_per_mm = measureheight_px / self.options.mmHeight;

}


function xprint_CreatePageFrame(self, id, top) {
	var el_container = document.getElementById('obj_framecontainer');
	var el_frame = document.createElement('div');
	el_frame.id = id;
	el_frame.classList.add('page-frame');
	el_container.appendChild(el_frame);
}


function xprint_InitializeReport(self) {


	self.last_element_bottom_pos = 0;
	self.pagecount = 1;
	self.pxWidth = Math.ceil(xprint_mm_to_px(self, self.options.mmWidth));
	self.pxHeight = Math.ceil(xprint_mm_to_px(self, self.options.mmHeight));
	self.pxMarginTop = Math.ceil(xprint_mm_to_px(self, self.options.mmMarginTop));
	self.pxMarginBottom = Math.ceil(xprint_mm_to_px(self, self.options.mmMarginBottom));
	self.pxMarginLeft = Math.ceil(xprint_mm_to_px(self, self.options.mmMarginLeft));
	self.pxMarginRight = Math.ceil(xprint_mm_to_px(self, self.options.mmMarginRight));
	self.pxPageHeaderHeight = Math.ceil(xprint_mm_to_px(self, self.options.mmPageHeaderHeight));
	


	self.currentpage_available_space = self.pxHeight;

	// adjust report header
	// self.options.pxReportHeaderHeight = self.options.pxReportHeaderHeight + 2;

	xprint_ClaimSpace_Px(self, self.pxMarginTop, 'margin-top'); // first page, margin top
	xprint_ClaimSpace_Px(self, self.options.pxReportHeaderHeight - self.pxMarginTop, 'report-header'); // report header
	xprint_ClaimSpace_Px(self, self.options.pxTableHeaderHeight - (self.pxMarginTop + self.pxPageHeaderHeight), 'table-header'); // table header


	xprint_CreatePageFrame(self, 'page-1');


	console.log(self);

}

function xprint_status(self, message) {
	if (message!==undefined) {
		self.options.elStatus.innerHTML = message;
		self.options.elStatus.style.display = 'block';
		scrollTo(0, document.body.scrollHeight); // scroll ke paling bawah
	} else {
		self.options.elStatus.innerHTML = '';
		self.options.elStatus.style.display = 'none';
		scrollTo(0, 0); // load selesai, scroll kembali ke paling atas
	}
}

function xprint_ClaimSpace(self, el, descr) {
	var height_px = el.offsetHeight;
	console.log(height_px);
	var claiminfo = xprint_ClaimSpace_Px(self, height_px, descr);

	if (descr=='footer') {
		if (claiminfo.newpage) {
			console.log('footer on newpage');
			// el.style.paddingTop = `${self.pxMarginTop+self.pxPageHeaderHeight}px`;
			el.classList.add('report-footer-alone');
		}
	}

	
	if (claiminfo.forcebreakbefore) {
		// el.classList.add('row-force-pagebreak');


		// var br = document.createElement('div');
		// br.classList.add('row-force-pagebreak');
		// br.innerHTML = `<img src="" height="1" width="1">`
		// el.parentNode.insertBefore(br, el);

		// el.classList.add('row-force-pagebreak');
		// console.log('break before', descr);
		// var crb = el.querySelector('.cell-row-breaker');
		// crb.classList.add('row-force-pagebreak');
		// console.log('break before', descr);
	} 

	return claiminfo;
}

function xprint_ClaimSpace_Px(self, height_px, descr) {
	var claiminfo = {}


	var tobeclaimed = height_px;
	var max_available = self.currentpage_available_space - self.pxMarginBottom;

	if (descr=='footer') {
		console.log(descr)
		if ((tobeclaimed-max_available)<=15) {
			max_available = tobeclaimed;
		}
	}

	var top_px = self.last_element_bottom_pos;
	if (tobeclaimed<=max_available) {
		// langsung pasang
		var el =  xprint_CreateMeasurementBox(self, top_px, tobeclaimed, descr);
		self.last_element_bottom_pos += tobeclaimed;
		// console.log(max_available, tobeclaimed, descr);
		self.currentpage_available_space -= tobeclaimed

		claiminfo = {
			newpage: false,
			forcebreakbefore: false

		}

	} else {
		
		// console.log('tambah halaman, reset posisi');
		var adjust = 0; //self.pagecount%8==0 ? 1: 0 ;
		var sisaclaim = adjust + max_available + self.pxMarginBottom;
		var els = xprint_CreateMeasurementBox(self, top_px, sisaclaim, descr + ' claim sisa'); // claim dulu sisa
		// console.log(max_available, sisaclaim, 'claim sisa');
		// console.log(els);
		self.last_element_bottom_pos += sisaclaim;
		
		
		// halaman baru
		self.pagecount++;
		self.currentpage_available_space = self.pxHeight;
		xprint_ClaimSpace_Px(self, self.pxMarginTop); // first page, margin top
		xprint_ClaimSpace_Px(self, self.pxPageHeaderHeight); //page header
		xprint_ClaimSpace_Px(self, self.options.pxTableHeaderHeight - (self.pxMarginTop + self.pxPageHeaderHeight)); // table header


		xprint_CreatePageFrame(self, `page-${self.pagecount}`);


		var top_px = self.last_element_bottom_pos;
		xprint_CreateMeasurementBox(self, top_px, tobeclaimed, descr);
		self.last_element_bottom_pos += tobeclaimed;
		// console.log(max_available, tobeclaimed, descr);
		self.currentpage_available_space -= tobeclaimed

		claiminfo = {
			newpage: true,
			forcebreakbefore: true
		}

	}


	return claiminfo;

}

function xprint_finalize(self) {
	console.log('PAGE COUNT', self.pagecount);
	var elpghead = document.getElementById('obj_pageheader');
	var elpgdescr = elpghead.querySelector('.page-descr');
	var elpgpaging = elpghead.querySelector('.page-paging');
	
	var els = document.querySelectorAll('.page-frame');
	var page = 1;
	for (var el of els) {
		el.classList.add('page-frame-printonly');
		if (page>1) {
			elpgpaging.innerHTML = `page ${page} of ${self.pagecount}`;
			// console.log(elpghead.innerHTML);
			var elhead = document.createElement('div');
			elhead.classList.add('report-page-header-content');
			elhead.innerHTML = elpghead.innerHTML;
			el.appendChild(elhead);
		}
		page++;
	}


	var el_paging_page_1 = document.getElementById('obj_paging_page_1');
	el_paging_page_1.innerHTML = `page 1 of ${self.pagecount}`;
	
}


function xprint_CreateMeasurementBox(self, top_px, height_px, descr) {
	// return;

	self.i_test++;


	var el = document.createElement('div')
	el.id = "testbox-" + self.i_test;
	if (descr!==undefined) {
		el.innerHTML = descr;
	}
	el.setAttribute('descr', descr);
	el.classList.add('testbox');
	if (self.i_test%2 == 0) {
		el.style.borderColor = 'red';
		el.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'
	} else {
		el.style.borderColor = 'blue';
		el.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'
	}

	el.style.top = `${top_px}px`;
	el.style.height = `${height_px-1}px`;

	document.body.appendChild(el);

	return el;
}


function xprint_mm_to_px(self, mm) {
	return mm * self.px_per_mm;
}