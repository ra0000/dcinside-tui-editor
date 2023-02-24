// ==UserScript==
// @name         dcinside-tui-editor
// @namespace    https://dcinside.com
// @version      0.1
// @description  >_<
// @author       ra0000
// @match        https://gall.dcinside.com/*board/write*
// @icon         https://nstatic.dcinside.com/dc/w/images/logo_icon.ico
// @grant        GM_log
// @grant        unsafeWindow
// @grant        GM_addElement
// @require      https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js
// @require      https://uicdn.toast.com/editor/latest/i18n/ko-kr.min.js
// ==/UserScript==

const CONST = {
    EDITOR_STYLESHEET_URL: 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css',
    EDITOR_DARK_THEME_STYLESHEET_URL: 'https://uicdn.toast.com/editor/latest/theme/toastui-editor-dark.min.css',
    EDITOR_OPTIONS: {
        height: '500px',
        initialEditType: 'wysiwyg',
        previewStyle: 'tab',
        language: 'ko-KR',
        usageStatistics: false,
        theme: 'dark',
        hideModeSwitch: true,
        autofocus: false,
    },
    UPLOAD_PAGE_URL: '/upload/image?xssDomain=dcinside.com',
    CUSTOM_STYLESHEET: `
        .editor_wrap {
          background: transparent !important;
          border-top: 0 !important;
        }

        .toastui-editor-contents h1, .toastui-editor-contents h2 {
          border-bottom: unset !important;
        }

        .btn_box {
          margin-top: 1.6em !important;
        }

        .btn_box > button {
          width: 81px !important;
          height: 39px !important;
          border-radius: 9px !important;
        }

        .input_write_tit {
          width: 100% !important;
        }

        .input_write_tit > .put_inquiry {
          font-size: 14pt;
          border-radius: 8px;
          width: calc(100% - 11px) !important;
          height: 40px;
          padding: 0 !important;
          padding-left: 11px !important;
        }

        .input_write_tit > .txt_placeholder {
          font-size: 14pt;
        }

        .write_infobox, .temporary_save_box, .write_type_box, div[style="height:90px"] {
          display: none;
        }
        `,
    FUCK_ANSI: `
 _____ _   _  ____ _  __    ____   ____ ___ _   _ ____ ___ ____  _____
|  ___| | | |/ ___| |/ /   |  _ \\ / ___|_ _| \\ | / ___|_ _|  _ \\| ____|
| |_  | | | | |   | ' /    | | | | |    | ||  \\| \\___ \\| || | | |  _|
|  _| | |_| | |___| . \\    | |_| | |___ | || |\\  |___) | || |_| | |___
|_|    \\___/ \\____|_|\\_\\   |____/ \\____|___|_| \\_|____/___|____/|_____|`
};

const imageIDList = [];

const removeOriginalElements = () => {
    document.getElementById('tx_trex_container').remove();
}

const imageUpload = (image) => {
    let originalHTML = '';

    if (unsafeWindow.editor.getMarkdown() !== '') {
        originalHTML = unsafeWindow.editor.getHTML();
    }

    imageIDList.push(image.file_temp_no);

    unsafeWindow.editor.setHTML(originalHTML + `\n<img alt="file_temp_no=${image.file_temp_no}" src="${image.imageurl}"><p></p>`);
}

const spoofOriginalEditorFunction = () => {
    unsafeWindow.Trex.Validator = function () {
        this.exists = () => true
    }

    unsafeWindow.Editor.getAttachBox = () => ({datalist: imageIDList.flatMap(imageID => ({data: {file_temp_no: imageID}}))});

    unsafeWindow.Editor.getContent = () => {
        removeDeletedImageFromImageIDList();

        return unsafeWindow.editor.getHTML();
    }
}

const createLinkButton = () => {
    const el = document.createElement('button');

    el.className = 'image toastui-editor-toolbar-icons'
    el.type = 'button'
    el.style = 'margin: 0px 0px 0px 0px;'
    el.onclick = (e) => {
        window.open(CONST.UPLOAD_PAGE_URL, '', 'toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,resizable=yes,width=608px;,height=502px,left=250,top=65');
    };

    return el;
}

const loadStylesheet = () => {
    GM_addElement('link', {
        href: CONST.EDITOR_STYLESHEET_URL,
        rel: 'stylesheet',
    });

    GM_addElement('link', {
        href: CONST.EDITOR_DARK_THEME_STYLESHEET_URL,
        rel: 'stylesheet',
    });

    GM_addElement('style', {
        textContent: CONST.CUSTOM_STYLESHEET,
    });
}

const removeDeletedImageFromImageIDList = () => {
    const html = unsafeWindow.editor.getHTML();

    if (html.indexOf(' alt="file_temp_no=') == -1) {
        return;
    }

    imageIDList.forEach((imageID, idx) => {
        if (html.indexOf(imageID) == -1) {
            imageIDList.splice(idx, 1);
        }
    });
}

const loadEditor = () => {
    loadStylesheet();

    const editorElement = document.createElement('div');
    editorElement.id = 'toast_ui_editor';

    document.getElementsByClassName('editor_wrap')[0].appendChild(editorElement);

    const editor = new window.toastui.Editor({
        ...CONST.EDITOR_OPTIONS,
        el: editorElement,
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          [{el: createLinkButton(), tooltip: 'Image'}, 'link'],
        ],
        events: {
            // blur: onContentChange,
        }
    });

    unsafeWindow.editor = editor;
    unsafeWindow.imageUpload = imageUpload;

    spoofOriginalEditorFunction();
}

(() => {
    'use strict';

    GM_log(CONST.FUCK_ANSI);

    removeOriginalElements();

    loadEditor();

    document.getElementById('subject').focus();
})();