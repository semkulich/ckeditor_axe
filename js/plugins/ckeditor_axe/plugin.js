(function ($, Drupal, CKEDITOR) {
  'use strict';

  CKEDITOR.plugins.add('ckeditor_axe', {
    icons: 'ckeditor_axe',
    // The plugin initialization logic goes inside this method.
    init: function (editor) {
      // Define the editor command.
      editor.addCommand('ckeditor_axe', {
      // Define the function that will be fired when the command is executed.
        exec: function (editor) {
          // Get ckeditor AXE config.
          let axeTags = Object.keys(editor.config.ckeditor_axe);
          let axeExcludedRules = Object.keys(editor.config.ckeditor_axe);
          let instanseName = CKEDITOR.currentInstance.name;
          // let data = CKEDITOR.instances[instanseName].document.getBody().getHtml();
          let data = CKEDITOR.instances[instanseName].getData();

          let parser = new DOMParser();
          let el = parser.parseFromString(data, "text/xml");

          axe.run(el,
            {
              runOnly: {
                type: "tag",
                values: axeTags,
              },
              "rules": {
                "color-contrast": { enabled: true },
                "valid-lang": { enabled: false }
              }
            },
            function(err, results) {
              // Center a CKEditor on the screen.
              // TODO Get ckeditor container id.
              $([document.documentElement, document.body]).animate({
                scrollTop: $("#cke_edit-body-0-value").offset().top
              }, 2000);
              
              // Get axe result.
              let axeResult = {};
              axeResult.instanseName = instanseName;
              axeResult.results = results;
              console.log(results);
              $.ajax({
                url: "/ckeditor_axe/post.json",
                method: "POST",
                data: JSON.stringify(axeResult),
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
                },
                success: function(data, status, xhr) {
                  let element = editor.document.findOne('img');
                  let range;
  
                  if(element) {
                    element.scrollIntoView();
                    range = editor.createRange();
                    range.moveToPosition(element, CKEDITOR.POSITION_AFTER_START);
                    editor.getSelection().selectRanges([range]);
                  }
                  // Add joyride.
                  $('body').append(data.data);
                  $('#joyRideTipContent').joyride({
                    postStepCallback : function (index, tip) {
                      $('#joyRideTipContent').remove();
                    }
                  });
                }
              });
            });

        }
      });
      

      // Create the toolbar button that executes the above command.
      editor.ui.addButton('ckeditor_axe', {
        label: 'ckeditor_axe',
        command: 'ckeditor_axe',
        toolbar: 'insert',
      });
    }
  });
})(jQuery, Drupal, CKEDITOR);
