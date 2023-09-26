



export function init(elname, options) {
	// 
	const self = {}

	self.taskname = options.name;
	self.cookiename = 'task-pid-' + self.taskname;
	self.current_pid = null;

	self.el = $(elname);
	self.btn_start = self.el.find('.task-start');
	self.btn_cancel = self.el.find('.task-cancel');
	self.pnl_progress = self.el.find('.task-progress');
	self.obj_progressbar = self.el.find('.task-progress-status');
	self.obj_taskdescr = self.el.find('.task-progress-text');

	self.obj_progressbar.progressbar({value:0});
	self.obj_taskdescr.html('');

	self.btn_start.linkbutton({
		onClick: ()=>{  btn_start_click(self); }
	});
	
	self.btn_cancel.linkbutton({
		onClick: ()=>{  btn_cancel_click(self); }
	});

	self.Cancel = () => {
		task_canceled(self);
	}

	self.getUserActiveTask = () => {
		var pid = task_cookie_get(self);
		if (pid!=null) {
			viewProgress(self, true);
		}
		return pid;
	}

	self.setUserActiveTask = (pid, data) => {
		task_cookie_set(self, pid, data);
	}

	self.setLog = (log) => {
		task_setlog(self, log);
	}

	self.MonitorProgress = (interval) => {
		var pid = task_cookie_get(self);
		interval = interval ?? 1000;
		task_monitorprogress(self, pid, interval);
	}


	self.Reset = () => {
		viewProgress(self, false);
	}

	self.Clear = () => {
		clearInterval(self.cekProgress);
		viewProgress(self, false);
		task_cookie_remove(self);
		self.cekProgress=null;
	}


	self.Start = null
	self.RequestCancel = null;


	viewProgress(self, false);

	return self;
}


function task_cookie_get(self) {
	var pid = Cookies.get(self.cookiename);
	return pid;
}

function task_cookie_getdata(self) {
	var data = Cookies.get(self.cookiename+'-data');
	if (data==null) {
		return {}
	} else {
		return JSON.parse(data);
	}
}

function task_cookie_set(self, pid, data) {
	Cookies.set(self.cookiename, pid, {path: window.urlparams.cookiepath});
	if (data!=null) {
		Cookies.set(self.cookiename+'-data', JSON.stringify(data), {path: window.urlparams.cookiepath});
	}
}

function task_cookie_remove(self) {
	Cookies.remove(self.cookiename, {path: window.urlparams.cookiepath});
	Cookies.remove(self.cookiename+'-data', {path: window.urlparams.cookiepath});
}


function viewProgress(self, visible) {
	if (visible) {
		self.pnl_progress.show();
		self.btn_start.hide();
		self.btn_cancel.show();
	} else {
		self.pnl_progress.hide();
		self.btn_start.show();
		self.btn_cancel.hide();
	}
}

function btn_start_click(self) {
	console.log('btn_start_click');
	if (typeof self.onStarting !== 'function') {
		return;
	}
	
	self.btn_start.blur();
	viewProgress(self, true);

	// var param = {
	// 	taskname: self.taskname
	// };

	self.obj_progressbar.progressbar({value:0});
	self.obj_taskdescr.html('Starting');

	self.onStarting(self);



}

function btn_cancel_click(self) {
	console.log('btn_cancel_click');
	$ui.ShowMessage("[QUESTION]Task masih berjalan, apakah anda mau membatalkan ?" , {
		yes: () => {
			// request Cancel
			var pid =  self.current_pid; 
			task_requestcancel(self, pid);
		},
		no: () => {}
	})
	
}

async function task_requestcancel(self, pid) {
	var param = {
		pid: pid 
	};

	var apiurl = `fgta/framework/fglongtask/cancelprogress`;
	var args = {param: param};

	var result = await $ui.apicall(apiurl, args);
	console.log(result);
}

function task_monitorprogress(self, pid, interval) {
	self.current_pid = pid;
	
	var param = {
		pid: pid
	};

	var apiurl = `fgta/framework/fglongtask/cekprogress`;
	var args = {param: param};
	
	self.cekProgress = setInterval(async ()=>{
		var result = await $ui.apicall(apiurl, args);
		var lastprogressid = result.lastprogressid;


		console.log(result);
		if (self.lastprogressid===lastprogressid) {
			return;
		}

		self.lastprogressid=lastprogressid;
		self.obj_progressbar.progressbar('setValue', result.progress);
		self.obj_taskdescr.html(result.taskdescr);


		var stopInterval = false;
		if (result.running==1) {
			// task masih berjalan
			stopInterval = false;
		} else if (result.error==1) {
			stopInterval = true;
			if (typeof self.onError === 'function') {
				var taskcookiedata = task_cookie_getdata(self);
				self.onError({
					message: result.taskdescr,
					data: taskcookiedata	
				})
			}
		} else if (result.canceled==1) {
			stopInterval = true;
			if (typeof self.onCanceled === 'function') {
				self.onCanceled({
					progress: result.progress,
					taskdescr: result.taskdescr
				});
			}
		} else {
			await pause(500);
			stopInterval = true;
			if (typeof self.onCompleted === 'function') {
				self.onCompleted({
					progress: result.progress,
					message: result.taskescr	
				})
			}
		}

		if (stopInterval) {
			clearInterval(self.cekProgress);
			viewProgress(self, false);
			task_cookie_remove(self);
			self.cekProgress=null;
		}

	}, interval);
}


async function pause(ms) {
	return new Promise((resume)=>{
		setTimeout(()=>{
			resume();
		}, ms);
	})
}