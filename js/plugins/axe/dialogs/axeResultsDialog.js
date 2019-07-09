/**
 * Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or
 * https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.dialog.add( 'axeResultsDialog', function(editor) {
  return {
    title: 'AXE results',
    resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
    width: 200,
    minHeight: 200,
    contents: [
    ],
    
    onShow: function () {
      let rect = editor.container.$.getBoundingClientRect();
      // console.log(this.disabled);
      // this.width
      this.move(rect.x + rect.width, 0);
      // window.scrollTo(0, 1000);
      // console.log(this);
      // console.log(editor.container.$.getBoundingClientRect());
    },
  };
});
