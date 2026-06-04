var UT = (function () {
	'use strict';

	function saveSurvey(data) {
		sessionStorage.setItem('utSurveyData', JSON.stringify(data));
	}

	function getSurvey() {
		return JSON.parse(sessionStorage.getItem('utSurveyData') || '{}');
	}

	function saveTask(key, data) {
		var taskData = getTaskResult();

		taskData[key] = data;

		sessionStorage.setItem('utTaskResult', JSON.stringify(taskData));
	}

	function getTaskResult() {
		return JSON.parse(sessionStorage.getItem('utTaskResult') || '{}');
	}

	function makeClickPath(clickLogs) {
		return $.map(clickLogs, function (item) {
			return item.text + '[' + item.second + 's]';
		}).join(' > ');
	}

	function clearStorage() {
		sessionStorage.removeItem('utSurveyData');
		sessionStorage.removeItem('utTaskResult');
		sessionStorage.removeItem('utCoSurvey');
		sessionStorage.removeItem('utFinalResult');
		sessionStorage.removeItem('ut_group');
		sessionStorage.removeItem('user_ut_id');
		sessionStorage.removeItem('b_start');
		sessionStorage.removeItem('ut_upload_sent');
	}

	return {
		saveSurvey: saveSurvey,
		getSurvey: getSurvey,
		saveTask: saveTask,
		getTaskResult: getTaskResult,
		makeClickPath: makeClickPath,
		clearStorage: clearStorage
	};
})();