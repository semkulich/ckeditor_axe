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
    
    // onShow: function () {
    //   // console.log(this.disabled);
    //   console.log(this);
    // },
    
    // onShow: function (data) {
    //   let dialog = this;
    //
    //   // this.element = selection.getStartElement();
    //   console.log(editor.config.axe);
    //   console.log(dialog);
    //   console.log(data);
    //   // let plugin = editor.config.axe;
    //   // Prepare message.
    //   // let message = {
    //   //   command: "run",
    //   //   editor: editor.name,
    //   //   arguments: {
    //   //     context: plugin.axe.context,
    //   //     options: plugin.axe.run,
    //   //     callback: plugin.axe.callbackNumber
    //   //   }
    //   // };
    //   // // Send message to iframe to run aXe.
    //   // editor.document.getWindow().$.postMessage(message);
    //   // this.setupContent(this.element);
    // }
    // onLoad: function () {
    //   let element = nodes[0].selector;
    //   console.log(element);
    //   console.log(nodes);
    //
    //   let range;
    //   if(element) {
    //     element.scrollIntoView();
    //     range = editor.createRange();
    //     range.moveToPosition(element, CKEDITOR.POSITION_AFTER_START);
    //     editor.getSelection().selectRanges([range]);
    //   }
    // },
    // onOk: function () {
      // console.log(editor);
    // },
  };
} );
