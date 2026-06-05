$(function () {

	var isMobile =
		/Android|iPhone|iPad|iPod|Mobile|Windows Phone|webOS|BlackBerry/i.test(
			navigator.userAgent
		);

	if (!isMobile) {
		return;
	}

	$('body').html(
		'<main style="' +
			'display:flex;' +
			'align-items:center;' +
			'justify-content:center;' +
			'min-height:100vh;' +
			'padding:24px;' +
			'box-sizing:border-box;' +
		'">' +
			'<div style="' +
				'max-width:600px;' +
				'text-align:center;' +
				'line-height:1.8;' +
			'">' +
				'<h1 style="margin:0 0 24px;font-size:24px;font-weight:700;">PC 환경에서만 참여 가능합니다.</h1>' +

				'<p style="margin:0 0 16px;font-size:18px;">현재 진행되는 사용자 경험 조사는 PC 화면 기준으로 제작되어 있습니다.</p>' +

				'<p style="margin:0 0 12px;font-size:16px;">모바일 또는 태블릿으로 참여할 경우 화면 구성 및 메뉴 구조가 다르게 표시되어 조사 결과에 영향을 줄 수 있습니다.</p>' +

				'<p style="margin:0 0 12px;font-size:16px;">정확한 조사 진행을 위해 PC(데스크탑 또는 노트북) 환경에서 다시 접속해 주시기 바랍니다.</p>' +

				'<p style="margin:0;font-size:16px;">감사합니다.</p>' +
			'</div>' +
		'</main>'
	);

});