var UT = (function() {

	var API_URL =
	'https://script.google.com/macros/s/AKfycbw3lO05yRJ1KvYgYfD2aS_tVYjkmQPMcmNDoOhZKiQEPpk9JD8DHTTDrbDYMe7gvUeYmg/exec';

	function getParams() {
		return new URLSearchParams(location.search);
	}

	function getGroup() {
		return getParams().get('group') || '1';
	}

	function getTask() {
		return getParams().get('task') || '1';
	}

	function generateId() {

		var date = new Date();

		var yyyy = date.getFullYear();

		var mm =
			String(date.getMonth() + 1)
			.padStart(2, '0');

		var dd =
			String(date.getDate())
			.padStart(2, '0');

		var random =
			Math.random()
			.toString(36)
			.substring(2, 8)
			.toUpperCase();

		return 'UT-' +
			yyyy +
			mm +
			dd +
			'-' +
			random;
	}

	function saveSurvey(data) {

		sessionStorage.setItem(
			'utSurveyData',
			JSON.stringify(data)
		);

	}

	function saveTask(data) {

		sessionStorage.setItem(
			'utTaskResult',
			JSON.stringify(data)
		);

	}

	function getSurvey() {

		return JSON.parse(
			sessionStorage.getItem('utSurveyData') || '{}'
		);

	}

	function getTaskResult() {

		return JSON.parse(
			sessionStorage.getItem('utTaskResult') || '{}'
		);

	}

	function clearStorage() {

		sessionStorage.removeItem('utSurveyData');

		sessionStorage.removeItem('utTaskResult');

	}

	function goTaskGuide() {

		location.href =
			'/work24-UT/task.html?group=' +
			encodeURIComponent(getGroup());

	}

	function goTest() {

		location.href =
			'/work24-UT/ut-test.html?group=' +
			encodeURIComponent(getGroup()) +
			'&task=' +
			encodeURIComponent(getTask());

	}

	function goUpload() {

		location.href =
			'/work24-UT/upload.html?group=' +
			encodeURIComponent(getGroup()) +
			'&task=' +
			encodeURIComponent(getTask());

	}

	function makeClickPath(clickLogs) {

	return clickLogs.map(function(item, index) {

		var prevElapsedMs =
			index === 0
				? 0
				: clickLogs[index - 1].elapsedMs;

		var singleSec =
			((item.elapsedMs - prevElapsedMs) / 1000).toFixed(1);

		return item.text + '(' + singleSec + '초)';

	}).join(' > ');

}

	function sendResult(successCallback, errorCallback) {

		var sendData = $.extend(
			{},
			getSurvey(),
			getTaskResult(),
			{
				group: getGroup()
			}
		);

		$.ajax({

			url: API_URL,

			type: 'POST',

			data: JSON.stringify(sendData),

			contentType: 'text/plain;charset=utf-8',

			success: function(response) {

				clearStorage();

				if (
					typeof successCallback === 'function'
				) {

					successCallback(response);

				}

			},

			error: function(xhr) {

				if (
					typeof errorCallback === 'function'
				) {

					errorCallback(xhr);

				}

			}

		});

	}

	return {

		generateId: generateId,

		saveSurvey: saveSurvey,

		saveTask: saveTask,

		goTaskGuide: goTaskGuide,

		goTest: goTest,

		goUpload: goUpload,

		makeClickPath: makeClickPath,

		sendResult: sendResult

	};

})();