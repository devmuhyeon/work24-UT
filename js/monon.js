(function () {

	var isMobile =
		/Android|iPhone|iPad|iPod|Mobile|Windows Phone|webOS|BlackBerry/i.test(
			navigator.userAgent
		);

	if (!isMobile) {
		return;
	}

	document.documentElement.innerHTML =
		'<head>' +
			'<meta charset="utf-8">' +
			'<title>접속 제한</title>' +
		'</head>' +
		'<body>' +
			'<main style="padding:40px;text-align:center;">' +
				'<h1>PC 환경에서만 참여 가능합니다.</h1>' +
			'</main>' +
		'</body>';

})();