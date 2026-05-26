$(function() {

	let isStarted = false;
	let isFinished = false;
	let startTime = null;
	let timeoutTimer = null;
	let clickCount = 0;
	let taskResult = null;

	const clickLogs = [];
	const targetMenu = '고용정책';
	const limitTime = 60 * 1000;

	const $frame = $('#testFrame');

	$('#targetMenuName').text(targetMenu);

	$('#startTest').focus();

	/*
		테스트 시작
	*/
	$('#startTest').on('click', function() {

		isStarted = true;

		startTime = Date.now();

		$('#utPage').removeAttr('aria-hidden');

		$('#utOverlay').fadeOut(200, function() {

			$(this).remove();

			$frame.focus();

		});

		timeoutTimer = setTimeout(function() {

			finishFail();

		}, limitTime);

	});

	/*
		클릭 저장
	*/
	function saveClick($clicked) {

		clickCount++;

		clickLogs.push({

			text: $.trim($clicked.text()),

			elapsedMs: Date.now() - startTime

		});

	}

	/*
		결과 생성
	*/
	function makeResult(resultType, $clicked) {

		const endTime = Date.now();

		return {

			target: targetMenu,

			result: resultType,

			clickedText:
				$clicked
					? $.trim($clicked.text())
					: '',

			clickCount: clickCount,

			duration:
				Math.round(
					(endTime - startTime) / 1000
				),

			clickPath:
				UT.makeClickPath(clickLogs),

			failReason: '',

			startTime:
				new Date(startTime).toISOString(),

			endTime:
				new Date(endTime).toISOString(),

			userAgent:
				navigator.userAgent

		};

	}

	/*
		성공 처리
	*/
	function finishSuccess($clicked) {

		if (isFinished) return;

		isFinished = true;

		clearTimeout(timeoutTimer);

		taskResult =
			makeResult('success', $clicked);

		$('#successPopup')
			.removeAttr('hidden')
			.hide()
			.fadeIn(200, function() {

				$(this)
					.find('.btn_next')
					.focus();

			});

	}

	/*
		실패 처리
	*/
	function finishFail() {

		if (isFinished) return;

		isFinished = true;

		taskResult =
			makeResult('fail', null);

		$('#failPopup')
			.removeAttr('hidden')
			.hide()
			.fadeIn(200, function() {

				$(this)
					.find('input[name="failReason"]')
					.first()
					.focus();

			});

	}

	/*
		다음 버튼
	*/
	$(document).on('click', '.btn_next', function() {

		if (!taskResult) return;

		/*
			실패 사유 검증
		*/
		if (taskResult.result === 'fail') {

			const failReason =
				$('input[name="failReason"]:checked')
					.val();

			if (!failReason) {

				$('#failError')
					.removeAttr('hidden');

				$('input[name="failReason"]')
					.first()
					.focus();

				return;

			}

			$('#failError')
				.attr('hidden', true);

			taskResult.failReason =
				failReason;

		}

		/*
			결과 저장
		*/
		UT.saveTask(taskResult);

		/*
			현재 페이지 기준 이동
		*/
		const currentPage =
			location.pathname
				.split('/')
				.pop();

		/*
			B AS-IS
		*/
		if (currentPage === 'ut-asis-b.html') {

			location.href =
				'/work24-UT/ut-tobe-b.html';

			return;

		}

		/*
			B TO-BE
		*/
		if (currentPage === 'ut-tobe-b.html') {

			location.href =
				'/work24-UT/lnb.html';

			return;

		}

	});

	/*
		failError 숨김
	*/
	$(document).on(
		'change',
		'input[name="failReason"]',
		function() {

			$('#failError')
				.attr('hidden', true);

		}
	);

	/*
		iframe 클릭 감지
	*/
	function bindFrameClick() {

		const frame = $frame[0];

		if (
			!frame ||
			!frame.contentWindow ||
			!frame.contentWindow.document
		) {

			return;

		}

		const frameDoc =
			frame.contentWindow.document;

		$(frameDoc)
			.off('click.utTest')
			.on(
				'click.utTest',
				'a, button',
				function(e) {

					if (
						!isStarted ||
						isFinished
					) {

						return;

					}

					const $clicked =
						$(this);

					saveClick($clicked);

					/*
						정답 클릭
					*/
					if (
						$clicked.attr('data-answer')
						=== 'true'
					) {

						e.preventDefault();

						finishSuccess($clicked);

					}

				}
			);

	}

	/*
		iframe load
	*/
	$frame.on('load', function() {

		bindFrameClick();

	});

});