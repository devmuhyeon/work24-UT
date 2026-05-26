$(function() {

	let isStarted = false;
	let startTime = null;
	let timeoutTimer = null;

	const limitTime = 60 * 1000;
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
			.on('click.utStart', 'a', function(e) {

				if (!isStarted) return;

				const href =
					$(this).attr('href') || '';

				if (
					href.indexOf('/work24-UT/ut-asis-b.html') > -1
				) {

					e.preventDefault();

					location.href =
						'/work24-UT/ut-asis-b.html';

				}

			});

	});

});