$(function() {

	let isStarted = false;
	let isFinished = false;
	let startTime = null;
	let timeoutTimer = null;
	let clickCount = 0;
	let taskResult = null;

	const clickLogs = [];
	const targetMenu = '취업동향 모아보기';
	const limitTime = 10 * 1000;
	const $frame = $('#testFrame');

	$('#targetMenuName').text(targetMenu);
	$('#startTest').focus();

	$('#startTest').on('click', function() {

		isStarted = true;
		startTime = Date.now();

		$('#utPage').removeAttr('aria-hidden');

		$('#utOverlay').fadeOut(200, function() {
			$(this).remove();
		});

		timeoutTimer = setTimeout(function() {
			finishFail();
		}, limitTime);

	});

	function saveClick($clicked) {

		clickCount++;

		clickLogs.push({
			text: $.trim($clicked.text()),
			elapsedMs: Date.now() - startTime
		});

	}

	function makeResult(resultType, $clicked) {

		const endTime = Date.now();

		return {
			target: targetMenu,
			result: resultType,
			clickedText: $clicked ? $.trim($clicked.text()) : '',
			clickCount: clickCount,
			duration: Math.round((endTime - startTime) / 1000),
			clickPath: UT.makeClickPath(clickLogs),
			failReason: '',
			startTime: new Date(startTime).toISOString(),
			endTime: new Date(endTime).toISOString(),
			userAgent: navigator.userAgent
		};

	}

	function finishSuccess($clicked) {

		if (isFinished) return;

		isFinished = true;
		clearTimeout(timeoutTimer);

		taskResult = makeResult('success', $clicked);

		$('#successPopup')
			.removeAttr('hidden')
			.hide()
			.fadeIn(200, function() {
				$(this).find('.btn_next').focus();
			});

	}

	function finishFail() {

		if (isFinished) return;

		isFinished = true;

		taskResult = makeResult('fail', null);

		$('#failPopup')
			.removeAttr('hidden')
			.hide()
			.fadeIn(200, function() {
				$(this).find('input[name="failReason"]').first().focus();
			});

	}

	$(document).on('click', '.btn_next', function() {

		if (!taskResult) return;

		if (taskResult.result === 'fail') {

			const failReason = $('input[name="failReason"]:checked').val();

			if (!failReason) {
				$('#failError').removeAttr('hidden');
				$('input[name="failReason"]').first().focus();
				return;
			}

			$('#failError').attr('hidden', true);
			taskResult.failReason = failReason;

		}

		UT.saveTask(taskResult);
		// UT.goUpload();

	});

	$(document).on('change', 'input[name="failReason"]', function() {
		$('#failError').attr('hidden', true);
	});

	function bindFrameClick() {

		const frame = $frame[0];

		if (
			!frame ||
			!frame.contentWindow ||
			!frame.contentWindow.document
		) {
			return;
		}

		const frameDoc = frame.contentWindow.document;

		$(frameDoc).off('click.utTest').on('click.utTest', 'a, button', function(e) {

			if (!isStarted || isFinished) return;

			const $clicked = $(this);

			saveClick($clicked);

			if ($clicked.attr('data-answer') === 'true') {
				e.preventDefault();
				finishSuccess($clicked);
			}

		});

	}

	$frame.on('load', function() {
		bindFrameClick();
	});

});