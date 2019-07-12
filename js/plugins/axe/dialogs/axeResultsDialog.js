/**
 * Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or
 * https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.dialog.add( 'axeResultsDialog', function(editor) {
  return {
    title: 'AXE results',
    resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
    minWidth: 300,
    minHeight: 200,
    contents: [],
    onShow: function (e) {
      let container = editor.container.$;
      container.scrollIntoView({block: "center"});
      let containerRect = container.getBoundingClientRect();
      this.resize(window.innerWidth - containerRect.right, containerRect.height);
      this.move(containerRect.width, 0);
    },
  };
});
