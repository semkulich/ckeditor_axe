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
          let axeConfig = editor.config.ckeditor_axe;
          let axeTags = axeConfig.tags;
          let axeExcludedRules = axeConfig.excluded_rules;
          let instanseName = CKEDITOR.currentInstance.name;
  
          // let data = CKEDITOR.instances[instanseName].document.getBody().getHtml();
          let data = CKEDITOR.instances[instanseName].getData();

          let parser = new DOMParser();
          let el = parser.parseFromString(data, "text/xml");
          console.log(el, data);

          axe.run(data,
            {
              runOnly: {
                type: "tag",
                values: axeTags,
              },
              "rules": axeExcludedRules,
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
