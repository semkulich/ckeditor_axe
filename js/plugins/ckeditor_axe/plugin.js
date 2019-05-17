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
          let instanseName = CKEDITOR.currentInstance.name;
          var data = CKEDITOR.instances[instanseName].document.getBody().getHtml();
          // let data = CKEDITOR.instances[instanseName].getData();

          let parser = new DOMParser();
          let el = parser.parseFromString(data, "text/xml");

          axe.run(el,
            {
              runOnly: {
                type: "rule",
                values: [ "image-alt"]
              }
            },
            function(err, results) {
              let axeResult = {};
              axeResult.instanseName = instanseName;
              axeResult.results = results;

              $.ajax({
                url: "/ckeditor_axe/post.json",
                method: "POST",
                data: JSON.stringify(axeResult),
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
                },
                success: function(data, status, xhr) {
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
