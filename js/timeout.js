var UT_TIMEOUT = (function() {
	'use strict';

	var timer = null;
	var isStarted = false;

	function init(option) {

		var opt = $.extend({
			limitTime: 40 * 1000,
			startButton: '#startTest',
			overlay: '#utOverlay',
			utPage: '#utPage',
			frame: '#testFrame',
			startTimeKey: 'utStartTime',
			timeoutKey: 'utTimeout',
			answerText: '',
			answerHref: '',
			timeoutHref: ''
		}, option || {});

		$(opt.startButton).focus();

		$(opt.startButton).on('click', function() {

			isStarted = true;

			sessionStorage.setItem(
				opt.startTimeKey,
				Date.now()
			);

			sessionStorage.removeItem(opt.timeoutKey);

			$(opt.utPage).removeAttr('aria-hidden');

			$(opt.overlay).fadeOut(200, function() {
				$(this).remove();
			});

			startTimer(opt);

		});

		bindFrameClick(opt);

	}

	function startTimer(opt) {

		clearTimeout(timer);

		timer = setTimeout(function() {
			goTimeout(opt);
		}, opt.limitTime);

	}

	function goTimeout(opt) {

		if (sessionStorage.getItem(opt.timeoutKey) === 'Y') {
			return;
		}

		sessionStorage.setItem(opt.timeoutKey, 'Y');

		location.href = opt.timeoutHref;

	}

	function bindFrameClick(opt) {

		var $frame = $(opt.frame);

		$frame.on('load', function() {

			setTimeout(function() {

				try {

					var frame = $frame[0];

					if (
						!frame ||
						!frame.contentWindow ||
						!frame.contentWindow.document
					) {
						return;
					}

					var frameDoc = frame.contentWindow.document;

					$(frameDoc)
						.off('click.utTimeout')
						.on('click.utTimeout', 'a, button', function(e) {

							if (!isStarted) {
								return;
							}

							var $this = $(this);
							var text = $.trim($this.text());
							var href = $this.attr('href') || '';

							if (
								(opt.answerText && text.indexOf(opt.answerText) > -1) ||
								(opt.answerHref && href.indexOf(opt.answerHref) > -1)
							) {

								e.preventDefault();

								clearTimeout(timer);

								location.href = opt.answerHref;

							}

						});

				} catch (e) {

					console.log(e);

				}

			}, 300);

		});

	}

	return {
		init: init
	};

})();