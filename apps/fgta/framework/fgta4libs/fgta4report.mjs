const fgta_output = $('#fgta_output')
const fgta_output_content = $('#fgta_output_content')
const fgta_output_error = $('#fgta_output_error')



export function fgta4report(report, opt) {
	let self = this

	self.iframe = report[0];
	self.OnReportLoaded = opt.OnReportLoaded;
	self.OnReportError = opt.OnReportError;
	self.OnReportLoadingError = opt.OnReportLoadingError;


	init(self)
	return {
		getIframe : () => { return self.iframe },
		load : (module, args) => { rpt_load(self, module, args) },
		reportloaded: () => { rpt_reportloaded(self) },
		reporterror: (err) => { rpt_reporterror(self, err) },
		print: () => { rpt_print(self)  },
		export: (tablename, filename, sheetname, params) => { rpt_export(self, tablename, filename, sheetname, params) },
	}
};





function init(self) {
	self.iframe.onload = () => {
		self.iframe.contentWindow.document.body.style.backgroundColor = '#fff';

		// var tokenid = parent.window.Cookies.get('tokenid');
		// if (self.iframe.contentWindow.Cookies==null) {
		// 	self.iframe.contentWindow.Cookies = parent.window.Cookies;
		// }
		// self.iframe.contentWindow.Cookies.set('tokenid', tokenid);

		if (typeof self.iframe.contentWindow.Wait==='function') {
			self.iframe.contentWindow.Wait(true);
		}

		if (typeof self.OnReportLoaded === 'function') {
			var tokenid = parent.window.Cookies.get('tokenid');
			self.iframe.contentWindow.setTokenId(tokenid);
			self.OnReportLoaded(self.iframe);
		}
	}

}

function rpt_reportloaded(self) {
	self.iframe.contentWindow.Wait(false);
}



async function rpt_load(self, module, args) {
	try {

		var content = await openpage(self, module, args);
		var binaryData = [];
		binaryData.push(content);
		var data_url = URL.createObjectURL(new Blob(binaryData, {type: "text/html"}));
		window.report_error = (err) => {
			rpt_reporterror(self, err);
		}
		self.iframe.src = data_url;
		self.iframe.contentWindow.args = args;

	} catch (err) {
		if (typeof self.OnReportLoadingError === 'function') {
			self.OnReportLoadingError(err)
		}
	}
}

function rpt_reporterror(self, err) {
	if (typeof self.OnReportError === 'function') {
		self.OnReportError(err)
	}
}

function rpt_print(self) {
	self.iframe.contentWindow.print();
}

export async function getNonce(api) {
	console.log(`get nonce for '${api}'`);

	let getnonceurl = `index.php/get/fgta/framework/otp/getnonce/${api}/getnonce`
	let getnonce = async (getnonceurl) => {

		return new Promise(function(resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange= function () {
				if (xhr.readyState==4) {
					try {
						if (xhr.status==200) {
							resolve(xhr.response);
						} else {
							throw Error(hr.statusText);
						}
					} catch (err) {
						reject(err)
					}
				}
			}			

			xhr.open("GET", getnonceurl, true);
			xhr.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
			xhr.setRequestHeader('cache-control', 'max-age=0');
			xhr.setRequestHeader('expires', '0');
			xhr.setRequestHeader('pragma', 'no-cache');
			
			xhr.setRequestHeader('fgta-appid', 'appid');
			xhr.setRequestHeader('fgta-secret', 'secret');
			xhr.setRequestHeader('fgta-tokenid', Cookies.get('tokenid'));
			xhr.setRequestHeader('fgta-mode', 'api');
			
			xhr.send();

		})
	}


	try {
		var jsonresult = await getnonce(getnonceurl);
		var res = JSON.parse(jsonresult);
		if (res.code==0) {
			return res.responseData.nonce;
		} else {
			throw Error('Error on getNonce. ' + res.message);
		}
	} catch (err) {
		throw err;
	}

}


export async function openpage(self, api, args) {
	let postparams = {}
	for (let paramname in args) {
		if (paramname=='files') {
			throw Error(`cannot use 'files' as main parameter name`);
		}
		postparams[paramname] = args[paramname]
	}


	var postdata = {
		txid: null,
		requestParam: postparams
	}
	let apiurl = `index.php/printout/${api}`
	let ajax = async (apiurl, postdata, nonce) => {
		return new Promise(function(resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange= function () {
				if (xhr.readyState==4) {
					try {
						if (xhr.status==200) {
							resolve(xhr.response);
						} else {
							throw Error(hr.statusText);
						}
					} catch (err) {
						reject(err)
					}
				}
			}
			
			xhr.open("POST", apiurl, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
			xhr.setRequestHeader('cache-control', 'max-age=0');
			xhr.setRequestHeader('expires', '0');
			xhr.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
			xhr.setRequestHeader('pragma', 'no-cache');
			
			xhr.setRequestHeader('fgta-appid', 'appid');
			xhr.setRequestHeader('fgta-secret', 'secret');
			xhr.setRequestHeader('fgta-nonce', nonce);
			xhr.setRequestHeader('fgta-tokenid', Cookies.get('tokenid'));
			
			var jsondata = JSON.stringify(postdata);
			xhr.send(jsondata);

		});
	};

	try {
		fgta_output_content.html('')	
		fgta_output_error.html('')
		try {
			var nonce = await getNonce(api);
			var content = await ajax(apiurl, postdata, nonce);			
			return content;
		} catch (err) {
			fgta_output_content.html(contentoutput);
			fgta_output_error.html(err.message)
			throw err;
		}
	} catch (err) {
		$ui.ShowErrorWindow();
		throw err;
	}

}



function rpt_export(self, tablename, filename, sheetname, wbprops) {
	var iframe = self.iframe;
	var obj = iframe.contentWindow.document.getElementById(tablename);

	let table = obj.cloneNode(true);;
	var tds = table.querySelectorAll('td[data-t="n"]');
	for (var td of tds) {
		td.innerHTML = td.innerHTML.replace(/,/g,''); //replaces , globally
		td.innerHTML = td.innerHTML.replace(/>-</g,'><'); //replaces cells only containing - globally
	}

	// https://github.com/linways/table-to-excel
	TableToExcel.convert(table, {
		name: filename,
		sheet: {
		  name: sheetname==null ? 'Sheet1' : sheetname
		},

		// property add
		subject: wbprops.subject ?? '',
		title: wbprops.title ?? '',
		creator: wbprops.creator ?? 'FGTA Table To Excel',
		company: wbprops.company ?? 'Ferrine Aplikasi Nusantara',
		description: wbprops.description ?? '',
		keywords: wbprops.keywords ?? ''
	});
}