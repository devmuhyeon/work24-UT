$(function () {

	var isMobile =
		/Android|iPhone|Mobile/i.test(
			navigator.userAgent
		);

	if (isMobile) {

		$('body').html(
			'<main style="padding:40px;text-align:center;">' +
				'<h1>PC 환경에서만 참여 가능합니다.</h1>' +
				'<p>모바일에서는 참여할 수 없습니다.</p>' +
			'</main>'
		);

		return;

	}

	for (var i = 0; i < 3; i++) {

		history.pushState(
			null,
			'',
			location.href
		);

	}

	$(window).on('popstate', function () {

		history.pushState(
			null,
			'',
			location.href
		);

		alert(
			'테스트 진행중에는 뒤로가기를 사용할 수 없습니다.'
		);

	});

});