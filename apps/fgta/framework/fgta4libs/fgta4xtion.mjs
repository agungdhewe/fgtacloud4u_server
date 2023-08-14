export async function doAction(args, fn_callback) {
	if (args.act_msg_quest!='') {
		// ditanya konfirmasi dulu sebelum mulai action
		await $ui.ShowMessage("[QUESTION]"+args.act_msg_quest, {
			"OK": () => {
				console.log('Xtion: ok execute');
				action_apiexecute(args, fn_callback);
			},
			"Cancel": () => {
				console.log('Xtion: Cancel')
			}
		});
	} else {
		// langsung jalankan action tanpa di-konfirmasi
		// action_apicall(args, fn_callback);
		console.log('Xtion: ok execute without asking');
		action_apiexecute(args, fn_callback);
	}

}



async function action_start(args) {
	try {
		if (args.xtion_version===undefined) {
			/* deprecated */
			var result = await $ui.apicall(args.act_url, {
				id: args.id,
				param: args.param
			});
	
			if (result.message!=null) {
				throw new Error(result.message);
			}
			return result;
		} else  {
			/* versi berikutnya, param diganti options agar seragam dengan api2 yang lain */
			var result = await $ui.apicall(args.act_url, {
				id: args.id,
				options: args.options ?? {} 
			});
	
			if (result.message!=null) {
				throw new Error(result.message);
			}
			return result;

		}
	} catch (err) {
		throw err;
	}
}





async function action_apiexecute(args, fn_callback) {
	if (args.use_otp) {
		var otpdata =  await $ui.apicall('fgta/framework/fgta4libs/otprequest', {
			param: {
				message: args.otp_message
			}
		});

		console.log(otpdata);

		args.param.use_otp = args.use_otp;
		args.param.otp = otpdata.value;

		var otptest = otpdata.testingotp ? `<span style="margin-left: 20px">otp: ${otpdata.code}</span>` : ''
		
		let el_otp_id = 'otp_'+ otpdata.value;
		await $ui.ShowMessage(`
			<div style="display: block">
				<div style="font-weight: bold">${args.otp_title}</div>
				<div>masukkan kode yang dikirimkan ke email <b>${otpdata.email}</b></div>
				<div>
					<input id="${el_otp_id}" class="easyui-textbox" style="width: 300px">
				</div>
				<div style="font-style: italic"><span>session: ${otpdata.value}</span>${otptest}</div>
			</div>
		`, {
			'Ok': () => {
				// action_apicall(args, fn_callback);
				var otpcode = $(parent.document.getElementById(el_otp_id)).textbox('getValue');
				args.param.otpcode = otpcode;
				action_apicall(args, fn_callback);
			}
		}, ()=>{
			console.log('view');
			$(parent.document.getElementById(el_otp_id)).textbox();
			var txt = $(parent.document.getElementById(el_otp_id)).textbox('textbox');
			txt[0].maxLength = 4;
			txt[0].addEventListener('keyup', (ev)=>{
				if (ev.key=='Enter') {
					ev.stopPropagation();
				}
			});
			txt.css('text-align', 'center');
			txt.focus();
		});
	} else {
		action_apicall(args, fn_callback);
	}
}


async function action_apicall(args, fn_callback) {
	var result;
	try {
		result = await action_start(args); 
		if (result.success) {
			fn_callback(null, result)
		} else {
			if (result.message!=null) {
				throw new Error(result.message);
			} else {
				console.log(result);
				throw new Error('error pada saat eksekusi action api');
			}
		}
	} catch (err) {
		if (err.message!=null) {
			fn_callback(new Error(err.message), result)
		} else {
			console.error(err);
			fn_callback(new Error('error pada saat eksekusi action api'), result)
		}
		
	}
}


