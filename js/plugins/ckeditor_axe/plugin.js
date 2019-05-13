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
          var parser = new DOMParser();
          var el = parser.parseFromString(editor.document.getBody(), "text/xml");
          console.log($.now(), el);

          axe.run(el,
            {
              runOnly: {
                type: "rule",
                values: [ "image-alt"]
              }
            },
            function(err, results) {
              console.log(results); console.log(err);
            }
          );

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
