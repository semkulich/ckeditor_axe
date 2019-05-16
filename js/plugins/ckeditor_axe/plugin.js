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
  
          axe.registerPlugin({
            id: 'doStuff',
            run: function(id, action, options, callback) {
              var frames;
              var q = axe.utils.queue();
              var that = this;
              frames = axe.utils.toArray(document.querySelectorAll('iframe, frame'));
      
              frames.forEach(function(frame) {
                q.defer(function(done) {
                  axe.utils.sendCommandToFrame(
                    frame,
                    {
                      options: options,
                      command: 'run-doStuff',
                      parameter: id,
                      action: action
                    },
                    function() {
                      done();
                    }
                  );
                });
              });
      
              if (!options.context.length) {
                q.defer(function(done) {
                  that._registry[id][action].call(
                    that._registry[id],
                    document,
                    options,
                    done
                  );
                });
              }
              q.then(callback);
            },
            commands: [
              {
                id: 'run-doStuff',
                callback: function(data, callback) {
                  return axe.plugins.doStuff.run(
                    data.parameter,
                    data.action,
                    data.options,
                    callback
                  );
                }
              }
            ]
          });
  
          var highlight = {
            id: 'highlight',
            highlighter: new Highlighter(),
            run: function(contextNode, options, done) {
              var that = this;
              Array.prototype.slice
                .call(contextNode.querySelectorAll(options.selector))
                .forEach(function(node) {
                  that.highlighter.highlight(node, options);
                });
              done();
            },
            cleanup: function(done) {
              this.highlighter.clear();
              done();
            }
          };
  
          axe.plugins.doStuff.add(highlight);
  
          var instanseName = CKEDITOR.currentInstance.name;
          var data = CKEDITOR.instances[instanseName].document.getBody().getHtml();
          // var data = CKEDITOR.instances[instanseName].getData();
  
          var parser = new DOMParser();
          var el = parser.parseFromString(data, "text/xml");
  
          axe.run(el,
            {
              runOnly: {
                type: "rule",
                values: [ "image-alt"]
              }
            },
            function(err, results) {
              var axeResult = {};
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
                  $(document.body).append($.parseHTML(data.data));
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
