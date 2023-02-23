// ==UserScript==
// @name         dcinside-tui-editor-image-upload
// @namespace    https://dcinside.com
// @version      0.1
// @description  >_<
// @author       ra0000
// @match        https://gall.dcinside.com/upload/image*
// @icon         https://nstatic.dcinside.com/dc/w/images/logo_icon.ico
// @grant        unsafeWindow
// ==/UserScript==

(() => {
    'use strict';

    unsafeWindow.done = () => {
		if (typeof(execAttach) == 'undefined') return;

		if($("#upload_ing").val() == 'Y'){
			alert('이미지 업로드 중입니다');
			return;
		}

		$( "#sortable li" ).each(function(i) {
			file_tmp[i] = $( this ).attr('data-key');
		});

		$.each(file_tmp , function (i,v){
			file_result[i] = _mockdata[v];
		});

		if($("#signmark").prop('checked')){
			if(!make_signmark(file_result)) {
				return false;
			}
		}

		for (var i=0; i < file_result.length; i++) {
			var allAttachmentList = _opener.Editor.getAttachBox().datalist;
			var nCount = 0;
			for( var j=0, n=allAttachmentList.length; j<n; j++ ){
				var entry = allAttachmentList[j];
				if( entry.deletedMark == true ){
					//alert("첨부상자에서 삭제된 파일 : " + entry.data.imageurl);
				} else {
					//alert("첨부상자에 존재하는 파일 : " + entry.data.imageurl);
					nCount++;
				}
			}
			if(nCount >= upload_count_file) {
				alert("최대 업로드 갯수를 초과하였습니다. 허용 첨부파일"+upload_count_file+"개 입니다. 파일첨부 박스에서 다른 첨부파일을 제거하고 업로드 하세요");

			} else {
				unsafeWindow.opener.window.imageUpload(file_result[i]);
			}
		}

		var upload_status = 'Y';

		opener.document.getElementById("upload_status").value = upload_status;
		closeWindow();
	}
})();
