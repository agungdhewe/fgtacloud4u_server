var this_page_id;
var this_page_options;

import * as fgta4longtask from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4longtask.mjs'


const obj_var1 = $('#pnl_main-obj_txt_var1');
const obj_var2 = $('#pnl_main-obj_txt_var2');
const longtask = fgta4longtask.init('#pnl_main-task', {name: 'process-longtask'});


export async function init(opt) {
	this_page_id = opt.id;
	this_page_options = opt;

	// init longtask
	((task)=>{
		task.onStarting = (task) => { longtask_starting(task); }
		task.onCanceled = (param) => { longtask_canceled(param); }
		task.onCompleted = (param) => { longtask_completed(param); }
		task.onError = (param) => { longtask_error(param); }
		if (task.getUserActiveTask()!=null) {
			task.MonitorProgress();
		}
	})(longtask);
	
}



async function longtask_starting(task) {
	console.log('starting task');

	var var1 = obj_var1.textbox('getValue');
	var var2 = obj_var2.textbox('getValue');
	
	var param = {
		taskname: task.taskname,
		data: JSON.stringify({
			var1:var1, 
			var2:var2
		}),
	};

	var apiurl = `${global.modulefullname}/dotask`;
	var args = {param: param};

	try {
		let result = await $ui.apicall(apiurl, args);
		console.log(result);

		var pid = result.pid;
		longtask.setUserActiveTask(pid);
		longtask.MonitorProgress();
	} catch (err) {
		console.error(err);
		task.Reset();
		longtask_error({message: err.message});
	}
	

}


function longtask_canceled(param) {
	$ui.ShowMessage("[WARNING]Task Canceled");
}

function longtask_completed(param) {
	$ui.ShowMessage("[INFO]Task Completed");
}

function longtask_error(param) {
	$ui.ShowMessage("[ERROR]"+param.message);
}
