var popList = '[]';
//메시지 출력
if (``) {
    alert(``);
} else if (``) {
    alert(``);
}

if ("") {
    var strUrl = "";
    if(strUrl.indexOf("Post.do") <= -1){
        location.href = strUrl;
    }else{
        var form = new FormLib.Form();
        form.createForm("dummy0001", strUrl, "POST", null,null).addHidden("_csrf", $("meta[name='_csrf']").attr("content"));
        form.addBody();

        ComLib.submit("dummy0001");
    }
}

function fn_saveSurvay(){
    if($("#satisRgstedYn").val() == "Y"){
        alert("만족도조사는 1번만 가능합니다");
        return;
    }

    $("input[name='rating']:checked").val();

    var data = {
            "stdgTrgtMenuId" : _menuId
        , "stdgTrgtUrla": window.location.href
        , "stdgScor" : $("input[name='rating']:checked").val()
        , "stdgQsinRspnCn" : $("#stdgQsinRspnCn").val()
        , "stdgQsinDsfcCn" : $("#stdgQsinDsfcCn").val()
        , "evtAgreeYn" : $("#evtAgreeYn").val()
    };

    var request = ComLib.ajaxReqObj("/cm/common/insertSatifyRate.do", data);
    request.done(function (responseObj, statusText, xhr) {
        $("#satisRgstedYn").val("Y");
        if($("#evtAgreeYn").val() == "Y"){
            alert("이벤트 참여가 완료되었습니다.\n소중한 의견 감사합니다.");
        }else{
            alert('소중한 의견 감사합니다.');
        };
    });
}

$(document).ready(function() {

    var showSearchFlag = "false";

    if(!ComLib.isEmpty(showSearchFlag)) {
        $(".header_search").hide();
    } else {
        $(".header_search").show();
    }

    $('.btn_quick_login').on('click', function() {
        $('.quick_login_guide').toggle();
    });

    //금지여부 체크
    fn_checkProhibit();
    fn_checkMenuAuth();

    $("#btn_survayRate").on("click", function() {
        fn_saveSurvay();
    });

    //추천검색어
    var recommandMode = 'EXPIRED';
    var myRecommandListmm;
    if(localStorage.recommandWordObj == null){
        var recommandMode = 'EXPIRED';
    }else{
        myRecommandListmm = JsonLib.parse(localStorage.getItem("recommandWordObj"));
        if(myRecommandListmm.expday != DateLib.getToday("YYYYMMDD")){
            recommandMode = 'EXPIRED';
        } else {
            recommandMode = 'KEEP';
        }
    }

    // 상단 배너 - play, pause 버튼 클릭 시
    $(document).on('click', '.noti_banner_slide .btn', function() {
        if($(this).hasClass('noti_pause')) {
            headerNotiSwiper01.autoplay.pause();
            $(this).hide();
            $('.btn.noti_play').show();
        } else {
            headerNotiSwiper01.autoplay.start();
            $(this).hide();
            $('.btn.noti_pause').show();
        }
    });
    // 상단 배너 닫기
    $('.top_noti_area .btn_close').on('click', function() {
        $('.top_noti_area').hide();
    });


    // 상단 배너
    var headerNotiSwiper01 = new Swiper(".noti_banner_slide", {
        direction: "vertical",
        autoplay: {
            delay: 3500,
        },
        loop: true,
    });

    if(recommandMode == 'EXPIRED'){
        var request = ComLib.ajaxReqObj("/cm/f/c/0100/retrieveRecommandWord.do", {"query":""});
        var recommandWordObj = {};
        recommandWordObj.expday = DateLib.getToday("YYYYMMDD");

        request.done(function(responseObj, statusText, xhr) {

            recommandWordObj.wordList = [];


            if(responseObj.recommandValue == null){
                return;
            }
            //2025-03 추천검색어 return값 구조 변경으로 인하여 처리
            //if(responseObj.recommandValue.Data.Return > 0){
            //	$("#sub_recommendArea").empty();
            //	for(var idx in responseObj.recommandValue.Data.Word){
            //		var w = responseObj.recommandValue.Data.Word;
            //		$("#sub_recommendArea").append('<li><a href="javascript:void(0);" onclick="fn_subPopWordClick(\''+w[idx]+'\')">'+w[idx]+'</a></li>');
            //		recommandWordObj.wordList.push(w[idx]);
            //	}
            //	localStorage.setItem("recommandWordObj", JsonLib.stringify(recommandWordObj) );
            //}
            if(responseObj.recommandValue.result.TotalCount > 0){
                $("#sub_recommendArea").empty();
                var wordArr = [];
                for(var i=0; i<responseObj.recommandValue.result.Item.length; i++){
                    wordArr.push(responseObj.recommandValue.result.Item[i].Word);
                }
                for(var idx in wordArr) {
                    var w = wordArr;
                    $("#sub_recommendArea").append('<li><a href="javascript:void(0);" onclick="fn_subPopWordClick(\''+w[idx]+'\')">'+w[idx]+'</a></li>');
                    recommandWordObj.wordList.push(w[idx]);
                }
                localStorage.setItem("recommandWordObj", JsonLib.stringify(recommandWordObj) );
            }
        });
    }else{ // KEEP
        myRecommandListmm = JsonLib.parse(localStorage.getItem("recommandWordObj"));

        for(var idx in myRecommandListmm.wordList){
            var w = myRecommandListmm.wordList[idx];
            $("#sub_recommendArea").append('<li><a href="javascript:void(0);" onclick="fn_subPopWordClick(\''+w+'\')">'+w+'</a></li>');
        }
    }


    //엔터키 이벤트
    $("#sub_topQuery").keydown(function(theEvent){
        var keyCode=window.event?event.keyCode:theEvent.which;
        if(keyCode== 13){
            $("#sub_findSearchData").click();
            return false;
        }
    });

    $("#sub_findSearchData").on('click', function() {
        $("#sub_topQueryData").val($("#sub_topQuery").val());
        var ret = $("#sub_topQueryData").val();
        if(ret != "" && ret != null){
            //검색어 인코딩 --S
            $("#sub_topQueryData").val(encodeURIComponent($("#sub_topQueryData").val()));
            //검색어 인코딩 --E
            ComLib.submit("subSearchDataForm");
        }else{
            $("#sub_topQuery").focus();
            alert("검색어를 입력하세요.");
        }
    });

    $('#header_bottom ul.header_util .header_search a:first').on('click', function(){


        $("#sub_keyword").empty();
        $("#sub_topQuery").val("");
        $(".layer_auto_search_wrap").css("display", "none");

        if($('.sub_search_wrap').hasClass('active')){
            $('.sub_search_wrap').removeClass('active');
            $(this).removeClass('on');
            $(".layer_search.layer_cate_search").css("display", "none");
            $("#sub_topQuerySelect").attr("title","검색 유형 열기");
        } else {
            $('.sub_search_wrap').addClass('active');
            $(this).addClass('on');
            $("#sub_topQuerySelect").focus();
        }

    });

    $('#sub_topQuerySelect').on('click', function(){

//		if($(".layer_search.layer_cate_search").css('display') == 'none'){
//			$(".layer_search.layer_cate_search").css("display", "block");
        if($("#sub_topQueryCateLayer").css('display') == 'none'){
            $("#sub_topQueryCateLayer").css("display", "block");

            $("#sub_topQuerySelect").attr("title","검색 유형 닫기");

            $('.layer_search.layer_cate_search ul li a').each(function(){
                $(this).removeClass('active');
// 				$(this).attr("aria-selected", "false");
                $(this).attr("title",$(this).attr("data-title"));

                if($("#sub_topQuerySearchArea").val() == $(this).data('value')) {

                    $(this).addClass("active");
// 					$(this).attr("aria-selected", "true");
                    $(this).attr("title",$(this).attr("data-title")+" 선택함");
                    $(this).focus();
                }
            });

        }else{
            $(".layer_search.layer_cate_search").css("display", "none");
            $("#sub_topQuerySelect").attr("title","검색 유형 열기");
        }

    });

    $('.layer_search.layer_cate_search ul li a').on('click', function(){
        $('.layer_search.layer_cate_search ul li a').each(function(){
            $(this).removeClass('active');
// 			$(this).attr("aria-selected", "false");
            $(this).attr("title",$(this).attr("data-title"));
        });
        $(this).addClass("active");
// 		$(this).attr("aria-selected", "true");
        $(this).attr("title",$(this).attr("data-title")+" 선택함");

        $("#sub_topQuerySelect span").text($(this).data('title'));
        $("#sub_topQuerySearchArea").val($(this).data('value'));
        $(".layer_search.layer_cate_search").css("display", "none");
        $("#sub_topQuerySelect").attr("title","검색 유형 열기");
        $("#sub_topQuerySelect").focus();
    });

    $("#sub_topQuery").autocomplete({
        source: function(req,res){
// 			req.term = StrLib.trimSpecialChar(req.term);
            $("#sub_topQuery").val(req.term);
            if( req.term == null || req.term == '') { return };
            var request = ComLib.ajaxReqObj("/cm/f/c/0110/autoComplete.do", {"query": encodeURIComponent(req.term)});
            request.done(function (responseObj, statusText, xhr) {
                $("#sub_keyword").empty();
                $("#sub_policyList").empty();
            //	2025-03
            //	var retList = responseObj.ret.result;
            //	var retList2 = [];
            //	if(responseObj.retList2.result != null){
            //		retList2 = responseObj.retList2.result[0].items;//정책
            //	}
            //	let mergeAry = new Array();
            //	$.each(retList,function(i,key){//배열 합치고
            //		if(retList[i].totalcount > 0){
            //			mergeAry = $.merge(mergeAry, retList[i].items);
            //		}
            //	});
                var retList;
                let mergeAry = new Array();
                if(null != responseObj.ret){ //2025-03 자동완성 결과 없을 경우 처리 추가
                    retList = responseObj.ret.result;

                    $.each(retList,function(i,key){//배열 합치고
                        //if(retList[i].totalcount > 0){
                        if(retList[i].totalCount > 0){
                            mergeAry = $.merge(mergeAry, retList[i].items);
                        }
                    });
                    $.each(mergeAry,function(i,key){//label 추가 한다.
                        mergeAry[i].label = mergeAry[i].hkeyword;
                    });
                }
                var retList2 = [];
                //if(responseObj.retList2.result != null){
                //	retList2 = responseObj.retList2.result[0].items;//정책
                //}
                if(null != responseObj.retList2){ //2025-03 자동완성 결과 없을 경우 처리 추가
                    if(responseObj.retList2.result != null){
                        retList2 = responseObj.retList2.result[0].items;//정책
                    }
                }
                if(mergeAry != null && mergeAry.length > 0){
                    $(".layer_auto_search_wrap").css("display", "");
                    if(retList2 != null && retList2.length > 0){
                        $.each(retList2,function(i,key){
                            var hkeyword = retList2[i].hkeyword.replace("@stag@","<span class='point_color02'>").replace("@etag@","</span>");
                            var sp = retList2[i].linkUrl.split('?wn?');
                            if(retList2[i].linkName=="menu"){
                                //contextPath, menuId, strUrl, menuPurpSecd, pwdCfrmYn, netFunnel
                                var ret = '<li class="txt_list"><a href="#none" onclick="fn_goPageUrl(\''+ sp[0] +'\', \''+sp[2]+'\', \''+sp[1]+'\', \''+sp[3]+'\');">'+hkeyword+'</a></li>';
                            }else{
                                var ret = '<li class="txt_list"><a href="#none" onclick="fn_goPolicyIntrotop(\''+ sp[1] +'\', \''+sp[0]+'\');">'+hkeyword+'</a></li>';
                            }
                            $("#sub_policyList").append(ret);
                        });
                    }
                }else if(retList2 != null && retList2.length > 0){
                    $.each(retList2,function(i,key){
                        //2025-03
                        var hkeyword = retList2[i].hkeyword.replace("@stag@","<span class='point_color02'>").replace("@etag@","</span>");
                        var sp = retList2[i].linkUrl.split('?wn?');
                        if(retList2[i].linkName=="menu"){
                            var ret = '<li class="txt_list"><a href="#none" onclick="fn_goPageUrl(\''+ sp[0] +'\', \''+sp[2]+'\', \''+sp[1]+'\', \''+sp[3]+'\');">'+hkeyword+'</a></li>';
                        }else{
                            var ret = '<li class="txt_list"><a href="#none" onclick="fn_goPolicyIntrotop(\''+ sp[1] +'\', \''+sp[0]+'\');">'+hkeyword+'</a></li>';
                        }
                        $("#sub_policyList").append(ret);
                    });

                    $(".layer_auto_search_wrap").css("display", "");
                }
                res(mergeAry);//autocomplete에 추가 한다.
            });
        },
        focus: function(event, item){
            return false;
        },
        delay: 600,
        minLength: 2,
        autofocus: true
    });

    //검색창 입력값 특수문자 제거 로직
// 	$("#sub_topQuery").keypress(function(e){ $(this).val(StrLib.trimSpecialChar($(this).val())) });
// 	$("#sub_topQuery").keyup(	function(e){ $(this).val(StrLib.trimSpecialChar($(this).val())) });

    $("#sub_topQuery").keyup(function(){
        var ret = $(this).val();
        if(ret == ""){
            $("#sub_keyword").empty();
            $("#sub_policyList").empty();
            $(".layer_search.layer_cate_search").css("display", "none");
            $(".layer_auto_search_wrap").css("display", "none");
        }
    });


    //css변경 및 제어등
    $("#sub_topQuery").autocomplete("instance")._renderItem = function(ul, item){
        //2025-03 자동완성 v7 하이라이팅 수정
        var hkeyword = item.hkeyword.replace("@stag@","<span class='point_color02'>").replace("@etag@","</span>");
        var ret = '<li><a href="javascript:void(0);" onclick="fn_subTopQuerySet(\''+item.value+'\')">'+hkeyword+'</a></li>';
        return $( ret ).appendTo( $("#sub_keyword") );
    };




});

function fn_checkMenuAuth(){
    if(document.referrer != '') return;
    if(location.pathname == "/cm/z/b/0210/openLginPage.do") return ;
    if(location.pathname == "/cm/main.do") return ;

    var menuId = "";
    var menuUrla = "";
    var menuPurpSecd = "";
    var pwdCfrmYn = "";

    var data = {
            "url" : location.pathname
    };
    var request = ComLib.ajaxReqObj("/cm/cmm/menu/checkMenuAuth.do", data, false);
    request.done(function (responseObj, statusText, xhr) {

        if(responseObj != null){
            menuId 		= responseObj.menuInfo.menuId;
            menuUrla 		= responseObj.menuInfo.menuUrla;
            menuPurpSecd 	= responseObj.menuInfo.menuPurpSecd;
            pwdCfrmYn 		= responseObj.menuInfo.pwdCfrmYn;
        }
    });

    fn_checkAuth("/cm", menuId, menuUrla, "EBM01", pwdCfrmYn,)

}


function fn_checkProhibit(){

    var request = ComLib.ajaxReqObj("/cm/cmm/menu/checkProhibitedUrl.do", data);
    var data = {
            "menuId" : _menuId
        , "stdgTrgtUrla": window.location.href
    };

    request.done(function (responseObj, statusText, xhr) {
        if(responseObj.auth == 'fail'){
            alert(responseObj.authMsg);
            location.href = responseObj.authRedirect;
        }
    });
}

//개인/기업 메뉴 선택 시
function fn_click_header_top_area(gbn){
    $("#topArea_header").val(gbn);
    $("#headerMenuVO").submit();
}

// 2레벨 메뉴 선택 시
function fn_click_top_menu(menuId){
    $("#currentMenuId_header").val(menuId);
    $("#headerMenuVO").attr("action","/cm/cmm/menu/clickMenu.do");
    ComLib.submit("headerMenuVO");
}


function fn_goMenuUrl(contextPath, urla, a,b,c,e){
    if(urla.indexOf('http') != -1){
        window.open(urla, '_blank');
    } else {
        //$("#HPCMCD0150VO").attr("action",contextPaht+urla);
        //ComLib.submit("HPCMCD0150VO");
        fn_goPageUrl(contextPath, b, urla, a, c,e);
    }
}


function fn_goPageUrl(contextPath, menuId, strUrl, menuPurpSecd, pwdCfrmYn, netFunnel){

    if(strUrl.indexOf('http') != -1){
        window.open(strUrl, '_blank');
        return;
    }

    var go = true;
    if(menuId != null && menuId.length > 10){
        var request = ComLib.ajaxReqObj(contextPath+"/cmm/menu/checkMenuInfo.do", {"menuId":menuId}, false);
        request.done(function (responseObj, statusText, xhr) {

            if(responseObj != null && responseObj.ssoRedirectUrl != null){
                window.open(responseObj.ssoRedirectUrl, '_blank');
                go = false;
                return;
            }
        });
    }
    if(!go){
        return;
    }
    $("#currentMenuId_header").val(menuId);
    $("#redirectUrl_header").val(strUrl);
    $("#menuPurpSecd_header").val(menuPurpSecd);
    $("#headerMenuVO").attr("action",contextPath+"/cmm/menu/clickMenu.do");

    if($("#pwdCfrmForm000")[0] != null){
        $("#pwdCfrmForm000")[0].reset();
    }

    // 정책신청 공통기능화면에서는 안쓰임.
    if($("#empDtlMenuView").val() != menuId){
        var rtnObj = {};
        var request = ComLib.ajaxReqObj("/cm/c/f/1300/checkEmpPolyDtlCodeAjax.do", {"menuUrl":strUrl, "menuId":menuId}, false);

        request.done(function (responseObj, statusText, xhr) {

            if(!ComLib.isEmpty(responseObj.auth)){
                if(responseObj.auth == "ok" ){
                        rtnObj.stat = true;
                        rtnObj.menuId 			 = responseObj.menuId;
                        rtnObj.menuPurpSecd 	 = responseObj.menuPurpSecd;
                        rtnObj.exnwMenuConcSecd  = responseObj.exnwMenuConcSecd;
                        rtnObj.pwdCfrmYn 		 = responseObj.pwdCfrmYn;
                        rtnObj.contextPath 		 = responseObj.contextPath;
                        rtnObj.smtmConcCtrlId 	 = responseObj.smtmConcCtrlId;
                        rtnObj.dtlForwardPolyUrl = responseObj.menuUrla;
                        //rtnObj.headerUrl = "/cmm/menu/clickMenu.do";
                }else{
                    rtnObj.stat = false;
                }
            }
        });

        //정책 상세 대상 여부인지 확인.
        if(rtnObj != null){
            if(rtnObj.stat) {// true
                var goDtl = false;
                if(rtnObj.exnwMenuConcSecd == 'ESD01'){

                    if(confirm("정책소개 화면을 보지 않고 신청서 화면으로 이동하시겠습니까?")){
                        //정책상세로 안감.
                        goDtl = false;
                    }else{
                        //정책상세로 감.
                        goDtl = true;
                    }
                }else if(rtnObj.exnwMenuConcSecd == 'ESD00'){

                    goDtl = true; //정책상세로 감.
                }
                if(goDtl){
                    $("#dtlMenuId"			).val(rtnObj.menuId);
                    $("#dtlMenuPurpSecd"	).val(rtnObj.menuPurpSecd);
                    $("#dtlExnwMenuConcSecd").val(rtnObj.exnwMenuConcSecd);
                    $("#dtlPwdCfrmYn"		).val(rtnObj.pwdCfrmYn);
                    $("#dtlSmtmConcCtrlId"	).val(rtnObj.smtmConcCtrlId);
                    $("#dtlContextPath"		).val(rtnObj.contextPath);
                    $("#dtlForwardPolyUrl"	).val(rtnObj.dtlForwardPolyUrl);
                    $("#headerMenuVO"		).attr("action","/cm/c/f/1300/empPolyDtlInfoPost.do");

                    if(netFunnel != null && netFunnel != ""){
                        ComLib.submit("headerMenuVO",{"isNetfunnel":true, "actionId":netFunnel});
                        return;
                    }else{
                        ComLib.submit("headerMenuVO");
                        return;
                    }
                }
            }
        }
    }

    var quitAlert = false;
    var request = ComLib.ajaxReqObj("/cm/z/b/0220/countChkPwdCfrmYn.do", {"menuUrl":strUrl, "menuId":menuId}, false);

    //로그인 화면에서 바운스 하는경우 URL에 파라미터가 있었던 경우 해당 파라미터를 만들어서 넣어준다.
    if(location.pathname == "/cm/z/b/0210/openLginPage.do" && strUrl.indexOf("?") > -1 && strUrl.split("?").length > 1 ){

        //추가 파라미터가 붙어서 올 시 로그인 화면에서만 해당 추가파라미터 파싱.
        var paramStr = strUrl.split("?")[1];
        var paramArr = paramStr.split("&");

        //하나씩 만들어서 폼에 주입.
        for(var i = 0 ; i < paramArr.length ; i++){
            if(paramArr[i].split("=").length == 2){

                $("#headerMenuVO").append("<input type='hidden' name='"+paramArr[i].split("=")[0]+"' value='"+paramArr[i].split("=")[1]+"'/>")
            }
        }
    };


    request.done(function (responseObj, statusText, xhr) {

        if(!ComLib.isEmpty(responseObj.auth)){

            if(responseObj.auth != "ok" ){
                if(responseObj.authMsg != null && responseObj.authMsg != ""){
                    alert(responseObj.authMsg);
                    quitAlert = true;
                }

                if(responseObj.authRedirect != null && responseObj.authRedirect != ""){
                    //비로그인상태에서 기업로그인이 필요한 경우, 로그인페이지에 기업회원 탭 활성화 안됨으로 인한 menuPurpSecd로 구분 추가(조훈희 과장 요청(예)비로그인>(사이트맵) 기업 인증서등록)_2025.6.5. KSL
                    var authRedirect = responseObj.authRedirect;
                    var paramUrlStr = authRedirect.split("?")[0];
                    var paramStr = authRedirect.split("?")[1];

                    if(menuPurpSecd == "EBM00" || menuPurpSecd == "EBM03"){
                        paramStr = paramStr + "&loginGbn=EBM00";
                        authRedirect = paramUrlStr + "?" + paramStr;

                    } else { //EBM01, EBM02, EBM04 일때 개인로그인 탭
                        paramStr = paramStr + "&loginGbn=EBM01";
                        authRedirect = paramUrlStr + "?" + paramStr;
                    }

                    location.href = authRedirect;
                    quitAlert = true;
                }
                return;
            }
        }

        if(responseObj.ret == "NA"){
            if(netFunnel != null && netFunnel != ""){
                ComLib.submit("headerMenuVO",{"isNetfunnel":true, "actionId":netFunnel});
            }else{
                ComLib.submit("headerMenuVO");
            }
        } else if(responseObj.ret == null){
            if(netFunnel != null && netFunnel != ""){
                ComLib.submit("headerMenuVO",{"isNetfunnel":true, "actionId":netFunnel});
            }else{
                ComLib.submit("headerMenuVO");
            }
        } else if(responseObj.ret.cnt == "0"){
            //로그인등록 화면

            spin.stop();
            //ui.dimShow() 이미 열려있음.
            $("#chkPwdCfrmYnAdd").show();
        } else if(responseObj.ret.cnt > 0){
            //로그인 확인화면
            spin.stop();
            //ui.dimShow(); 이미 열려있음.
            $("#chkPwdCfrmYn").show();
        }
    });


    if (quitAlert) {
        return;
    }
    ui.dimShow()
    spin.spin($("#spin")[0]);

};

function fn_chkPwdCfrmYn(){
    var request = ComLib.ajaxReqObj("/cm/cmm/menu/chkPwdCfrmYn.do", {"pwdCfrmYnPwd":$("#pwdCfrmYnPwd").val()}, false);
    request.done(function (responseObj, statusText, xhr) {
        if(responseObj.ret == "Y"){
            ComLib.submit("headerMenuVO");
        }else if(responseObj.ret == "NA"){
            alert("등록된 비밀번호가 없습니다. 등록 페이지로 이동합니다.");
            location.href = "/cm";
        }else{
            alert("비밀번호가 다릅니다.");
        }
    });
}

function fn_goPopPageUrl(contextPath, menuId, strUrl, menuPurpSecd){

    $("#currentMenuId_header").val(menuId);
    $("#redirectUrl_header").val(strUrl);
    $("#menuPurpSecd_header").val(menuPurpSecd);
    $("#headerMenuVO").attr("action",contextPath+"/cmm/menu/clickMenu.do");

    var name = "firmCare";
    var height = 800;
    var width = 1200;
    var scroll = true;

    PopLib.openPostPup($("#headerMenuVO"), name, height, width, scroll);

}

function fn_goPopPage() {
    window.open('/cm/pub/index.html')
}

function fn_goPopList() {
    window.open('/cm/pub/guide/guide.html')
}

function fn_checkAuth(contextPath, menuId, strUrl, menuPurpSecd, pwdCfrmYn, netFunnel){

    var go = true;
    if(menuId != null && menuId.length > 10){
        var request = ComLib.ajaxReqObj(contextPath+"/cmm/menu/checkMenuInfo.do", {"menuId":menuId}, false);
        request.done(function (responseObj, statusText, xhr) {

            if(responseObj != null && responseObj.ssoRedirectUrl != null){
                window.open(responseObj.ssoRedirectUrl, '_blank');
                go = false;
                return;
            }
        });
    }
    if(!go){
        return;
    }
    $("#currentMenuId_header").val(menuId);
    $("#redirectUrl_header").val(strUrl);
    $("#menuPurpSecd_header").val(menuPurpSecd);
    $("#headerMenuVO").attr("action",contextPath+"/cmm/menu/clickMenu.do");

    if($("#pwdCfrmForm000")[0] != null){
        $("#pwdCfrmForm000")[0].reset();
    }

    var request = ComLib.ajaxReqObj("/cm/z/b/0220/countChkPwdCfrmYn.do", {"menuUrl":strUrl, "menuId":menuId}, false);

    request.done(function (responseObj, statusText, xhr) {
        if(!ComLib.isEmpty(responseObj.auth)){

            if(responseObj.auth != "ok" ){
                if(responseObj.authMsg != null && responseObj.authMsg != ""){
                    alert(responseObj.authMsg);
                }

                if(responseObj.authRedirect != null && responseObj.authRedirect != ""){
                    location.href=responseObj.authRedirect;
                }
                return;
            }
        }

        if(responseObj.ret == "NA"){
            if(netFunnel != null && netFunnel != ""){
                ComLib.submit("headerMenuVO",{"isNetfunnel":true, "actionId":netFunnel});
            }else{
                ComLib.submit("headerMenuVO");
            }
        } else if(responseObj.ret == null){
            console.log("무사통과")
        } else if(responseObj.ret.cnt == "0"){
            //로그인등록 화면
            ui.dimShow();
            $("#chkPwdCfrmYnAdd").show();
        } else if(responseObj.ret.cnt > 0){
            //로그인 확인화면
            ui.dimShow();
            $("#chkPwdCfrmYn").show();
        }
    });
};

function fn_subPopWordClick(w){
    $("#sub_topQuery").val(w);
    $("#sub_findSearchData").click();
}

function fn_subTopQuerySet(v){
    $("#sub_topQuery").val(v);
    var request = ComLib.ajaxReqObj("/cm/f/c/0100/retrieveRecommandWord.do", {"query":v});
    request.done(function(responseObj, statusText, xhr) {
        if(null != responseObj.recommandValue){
            if(responseObj.recommandValue.result.TotalCount > 0){
                $("#sub_recommendArea").empty();
                    var wordArr = [];
                    for(var i=0; i<responseObj.recommandValue.result.Item.length; i++){
                        wordArr.push(responseObj.recommandValue.result.Item[i].Word);
                    }
                for(var idx in wordArr) {
                    var w = wordArr;
                    $("#sub_recommendArea").append('<li><a href="javascript:void(0);" onclick="fn_subPopWordClick(\''+w[idx]+'\')">'+w[idx]+'</a></li>');
                    //recommandWordObj.wordList.push(w[idx]);
                }
            }
        }
//     	if(responseObj.recommandValue.Data.Return > 0){
//     		$("#sub_recommendArea").empty();
// 			for(var idx in responseObj.recommandValue.Data.Word){
// 				var w = responseObj.recommandValue.Data.Word;
// 				$("#sub_recommendArea").append('<li><a href="javascript:void(0);" onclick="fn_subPopWordClick(\''+w[idx]+'\')">'+w[idx]+'</a></li>');
// 			}
//     	}
    });
    $(".layer_search.layer_cate_search").css("display", "none");
    $(".layer_auto_search_wrap").css("display", "none");
}

//정책바로가기 이동
function fn_goPolicyIntrotop(systClId, systId){
    $("#topsystClId").val(systClId);
    $("#topsystId").val(systId);

    if(ComLib.isEmpty(systId))	//정책분류인 경우
        $("#subSearchDataForm").attr("action", '/cm/c/f/1100/selecPolicyInfoPost.do');
    else	//제도인 경우
        $("#subSearchDataForm").attr("action", '/cm/c/f/1100/selecSystInfoPost.do');
    ComLib.submit("subSearchDataForm");
}

//공지사항 상세보기
function fn_headerBbsDetailInfo(ntceStno){
    $("#header_ntceStno").val(ntceStno);
    ui.dimShow()
    spin.spin($("#spin")[0]);
    ComLib.submit("bbsGoForm");
}

//로그아웃
