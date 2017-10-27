$(function () {
	var workCont = '';
	var workTime = 0;
	var restTime = 0;
	var start = 0;
	var end = 0;
	var current = 0;
	var timer = null;
	var $clock = $('.clock');

	//获取提醒权限
	Notification.requestPermission();

	//开始工作
	$('.work-btn').on('click', function () {
		start = Date.now();
		workCont = $('.work-content').val();
		workTime = +$('.work-timer').val(); 
		restTime = +$('.rest-timer').val();
		current = (workTime + restTime) * 60;
		timer = setInterval(function () {
			--current;
			$clock.text(sec_str(current));
			if (current == restTime * 60) {
				var n = new Notification('提醒', {
					body: '休息时间到了',
					tag: 'vector',
					requireInteraction: false
				});
			}
			if (current == 0) {
				clearInterval(timer);
				timer = null;
			}
		}, 1000);
	});

	//停止工作
	$('.stop-btn').on('click', function () {
		end = Date.now();
		$clock.text('00:00:00');
		if (timer) {
			clearInterval(timer);
		}
		setWorkList(workCont + '-------------from ' + timeFormat(start) + ' to ' + timeFormat(end));
		showWorkList();
	});

	//清除工作记录
	$('.clear-btn').on('click', function () {
		resetWorkList();
		showWorkList();
	});
	var sec_str = function (s) {
		var m = Math.floor(s / 60);
		var s = s % 60;
		var h = Math.floor(m / 60);
		m = m % 60;
		return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
	};
	var setWorkList = function (str) {
		var result = localStorage.workList;
		if (result) {
			result = result + '|' + str;
		} else {
			result = str;
		}
		localStorage.workList = result;
	};
	var showWorkList = function () {
		var result = localStorage.workList;
		var list = result.split('|');
		var html = '';
		for (var i = 0, len = list.length; i < len; i++) {
			html += '<li>' + list[i] + '</li>';
		}
		$('ul.records').html(html);
	};
	var resetWorkList = function () {
		localStorage.workList = '';
	};
	var timeFormat = function (time) {
		var date = new Date(time);
		var h = date.getHours();
		var m = date.getMinutes();
		return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
	};
	showWorkList();
});