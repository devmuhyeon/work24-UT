$(function () {

	var isMobile =
		/Android|iPhone|iPad|iPod|Mobile|Windows Phone|webOS|BlackBerry/i.test(
			navigator.userAgent
		);

	if (!isMobile) {
		return;
	}

	$('body').html(
		'<p style="padding:40px;text-align:center;">PC 환경에서만 참여 가능합니다.</p>'
	);

});