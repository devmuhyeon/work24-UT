$(function() {

	let isStarted = false;
	let startTime = null;
	let timeoutTimer = null;

	const limitTime = 40 * 1000;
	const targetMenu = '고용정책';

	$('#targetMenuName').text(targetMenu);

	$('#startTest').focus();

	$('#startTest').on('click', function() {

		isStarted = true;

		startTime = Date.now();

		sessionStorage.setItem(
			'bTypeStartTime',
			startTime
		);

		$('#utPage').removeAttr('aria-hidden');

		$('#utOverlay').fadeOut(200, function() {

			$(this).remove();

		});

		timeoutTimer = setTimeout(function() {

			location.href =
				'/work24-UT/ut-asis-b.html?timeout=true';

		}, limitTime);

	});

	const $frame = $('#testFrame');

	$frame.on('load', function() {

		const frame = $frame[0];

		if (
			!frame ||
			!frame.contentWindow ||
			!frame.contentWindow.document
		) {
			return;
		}

		const frameDoc = frame.contentWindow.document;

		$(frameDoc)
			.off('click.utStart')
			.on(
				'click.utStart',
				'a, button',
				function(e) {

					if (!isStarted) return;

					const text =
						$.trim($(this).text());

					/*
						고용정책 클릭 시 이동
					*/
					if (
						text.indexOf('고용정책') > -1
					) {

						e.preventDefault();

						clearTimeout(timeoutTimer);

						location.href =
							'/work24-UT/ut-asis-b.html';

					}

				}
			);

	});

});