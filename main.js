window.onload = function () {

	let startTime = 0; //开始工作时间
	let workContent = ''; //工作内容
	let timer = 0; //定时器
	let doc = document;

	//获取提醒权限
	Notification.requestPermission();

	//秒转字符串时间格式
	let sec_str = function (seconds) {
		let m = Math.floor(seconds / 60);
		let s = seconds % 60;
		let h = Math.floor(m / 60);
		m = m % 60;
		return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
	};

	//notification提醒
	let notify = function () {
		let n = new Notification('提醒', {
			body: '休息时间到了',
			tag: 'vector',
			requireInteraction: false
		});
	};

	//date转字符串
	let timeFormat = function (time) {
		let date = new Date(time);
		let h = date.getHours();
		let m = date.getMinutes();
		return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
	};

	//设置工作记录
	let setWorkList = function (str) {
		if (str) {
			let result = localStorage.workList;
			if (result) {
				result = result + '|' + str;
			} else {
				result = str;
			}
			localStorage.workList = result;
		}
	};

	//显示工作记录列表
	let showWorkList = function () {
		let result = localStorage.workList;
		let list = result.split('|');
		let html = '';
		for (let i = 0, len = list.length; i < len; i++) {
			html += '<li>' + list[i] + '</li>';
		}
		doc.getElementsByClassName('records')[0].innerHTML = html;
	};

	//重置工作记录
	let resetWorkList = function () {
		localStorage.workList = '';
	};

	//开始工作
	doc.getElementById('work-btn').onclick = function () {

		let workTime = +(doc.getElementsByClassName('work-timer')[0].value);
		let restTime = +(doc.getElementsByClassName('rest-timer')[0].value);
		let total = (workTime + restTime) * 60;
		startTime = Date.now();
		workContent = doc.getElementsByClassName('work-content')[0].value;

		timer = setInterval(function () {
			total--;
			doc.getElementsByClassName('clock')[0].innerText = sec_str(total);
			if (total == restTime * 60) {
				notify();
			}
			if (total == 0) {
				clearInterval(timer);
				timer = null;
			}
		}, 1000);
	};

	//停止工作
	doc.getElementById('stop-btn').onclick = function () {

		let endTime = Date.now();

		doc.getElementsByClassName('clock')[0].innerText = '00:00:00';
		if (timer) {
			clearInterval(timer);
			timer = 0;
		}
		setWorkList(workContent + '-------------from ' + timeFormat(startTime) + ' to ' + timeFormat(endTime));
		showWorkList();
	};

	//清除工作记录
	doc.getElementById('clear-btn').onclick = function () {
		resetWorkList();
		showWorkList();
	};

	//页面初始化显示工作记录
	showWorkList();
};
