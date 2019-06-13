/**
 * Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or
 * https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.dialog.add( 'axeTagsDialog', function(editor) {
  let runOnlyTags = [];
  // Axe tags.
  return {
    title: 'Accessibility Standard/Purpose',
    minWidth: 400,
    minHeight: 200,
    contents: [
      {
        id: 'tab',
        label: 'AXE tags',
        title: 'AXE tags',
        elements: [
          {
            type: 'checkbox',
            id: 'wcag2a',
            label: 'WCAG 2.0 Level A',
          },
          {
            type: 'checkbox',
            id: 'wcag2aa',
            label: 'WCAG 2.0 Level AA',
          },
          {
            type: 'checkbox',
            id: 'wcag21aa',
            label: 'WCAG 2.1 Level AA',
          },
          {
            type: 'checkbox',
            id: 'section508',
            label: 'Section 508',
          },
          {
            type: 'checkbox',
            id: 'best-practice',
            label: 'Best practices endorsed by Deque',
          },
          {
            type: 'checkbox',
            id: 'experimental',
            label: 'Cutting-edge techniques',
          }
        ]
      }
    ],
    onShow: function () {
      this.foreach(function (el) {
        if(editor.config.axe.tags[el.id])
        el.setValue('checked', 'checked');
      });
    },
    onOk: function () {
      this.foreach(function (el) {
        editor.config.axe.tags[el.id] = el.getValue() ? 1 : 0;
      });
      editor.execCommand('axe');
      // Object.keys(tags).forEach(function (tag) {
      //   if(tags[tag])
      //     runOnlyTags.push(tag);
      // });
      // console.log(this.element);
    },
  };
} );
