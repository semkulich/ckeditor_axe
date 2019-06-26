"use strict";

let _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (CKEDITOR) {
  CKEDITOR.plugins.add("axe", {
    // @todo: Investigate axe-core languages system.
    lang: "en",
    /**
     * Pre initialization hook.
     *
     * In this function we have definitions of default values for plugin
     * settings.
     */
    onLoad: function onLoad() {
      // At this point we are going to provide default options for this plugin.
      let axe = {};

      /**
       * Default context is "document".
       *
       * If value of context is undefined - "document" will be used instead.
       * If you need detailed configuration @see:
       * https://www.deque.com/axe/axe-for-web/documentation/api-documentation/#user-content-api-name-axerun
       */
      axe.context = undefined;

      /**
       * Settings section which will be passed into aXe run command as options.
       */
      axe.run = {};

      /**
       * Tags to use to get default set of rules.
       *
       * By default we are going to use validation by tags.
       * And default tag is "wcag2a".
       */
      axe.run.runOnly = ['wcag2a'];

      /**
       * Rules to exclude from check.
       *
       * For details @see:
       * https://www.deque.com/axe/axe-for-web/documentation/api-documentation/#user-content-options-parameter-examples
       * List of rules below are excluded because they are not applicable to
       * CKEditor functionality. By logic of this plugin it should be
       * impossible to override this lis list of rules and their values.
       */
      axe.run.rules = {
        "aria-hidden-body": { enabled: false },
        bypass: { enabled: false },
        "document-title": { enabled: false },
        "frame-tested": { enabled: false },
        "frame-title-unique": { enabled: false },
        "frame-title": { enabled: false },
        "html-has-lang": { enabled: false },
        "html-lang-valid": { enabled: false },
        "html-xml-lang-mismatch": { enabled: false },
        "landmark-banner-is-top-level": { enabled: false },
        "landmark-complementary-is-top-level": { enabled: false },
        "landmark-contentinfo-is-top-level": { enabled: false },
        "landmark-main-is-top-level": { enabled: false },
        "landmark-no-duplicate-banner": { enabled: false },
        "landmark-no-duplicate-contentinfo": { enabled: false },
        "landmark-one-main": { enabled: false },
        "meta-viewport-large": { enabled: false },
        "meta-viewport": { enabled: false },
        "page-has-heading-one": { enabled: false },
        region: { enabled: false },
        "valid-lang": { enabled: false }
      };

      /**
       * Callback to catch results of the axe check.
       *
       * This callback is defined as separate plugin property to provide
       * possibility to override it.
       *
       * @param {object|undefined} error - aXe error.
       * @param {object} results - aXe results.
       * @param {string} editorName - Name of CKEditor instance.
       *
       * @return {boolean} status.
       */
      axe.callback = function (error, results, editorName) {
        if (error) throw error;
        // Validate editor instance.
        if (typeof CKEDITOR.instances[editorName] === "undefined") {
          // @todo: Multilanguage.
          // @todo: Check if there is a way to provide multilanguage with dynamic argument in string.
          console.error("Can't find editor instance.");
          return false;
        }
        let editor = CKEDITOR.instances[editorName];
        // Collect information.
        // In case if we have at least one violation.
        if (typeof(results.violations) === "object") {
          // console.log(results.violations);
          // @todo: Continue development.
          editor.execCommand('axeResultsDialog');

          CKEDITOR.on('dialogDefinition', function(ev) {
  
            // Take the dialog name and its definition from the event data.
            let dialogName = ev.data.name;
            let dialogDefinition = ev.data.definition;
            if ( dialogName === 'axeResultsDialog' && ev.editor.name === editorName ) {
              
              results.violations.forEach(function (violation, vid) {
                // In case if we have child elements.
                if (typeof(violation.nodes) === "object") {
                  let count = Object.keys(violation.nodes).length;
                  // Add pagination helper.
                  let pagination = function() {
                    let state = 0;
                    return {
                      currNid: function() {
                        let nid = state;
                        return nid + 1;
                      },
                      nextNid: function() {
                        state++;
                        if (state === count)
                          return this.firstNid();
                        return state;
                      },
                      prevNid: function() {
                        if (state === 0)
                          return this.lastNid();
                        state--;
                        return state;
                      },
                      firstNid: function() {
                        state = 0;
                        return state;
                      },
                      lastNid: function() {
                        state = count - 1;
                        return state;
                      }
                    };
                  }();
  
                  // Go through child elements.
                  let nodes = [];
                  violation.nodes.forEach(function (node, navId) {
                    if (node.target[0] !== "undefined") {
                      nodes[navId] = {
                        selector: editor.document.$.querySelector(node.target[0]),
                        failureSummary: node.failureSummary,
                        source: node.html
                      }
                    }
                  });
  
                  // Add content.
                  dialogDefinition.width = 200;
                  let dialog = dialogDefinition.dialog;
                  let document = dialog.getElement().getDocument();
                  let elements = [];
                  elements.push(
                    {
                      type: 'html',
                      html: '<div class="issue-title"><h2>Issue description</h2>' + violation.description + '</div>',
                    }
                  );
                  if (count > 1) {
                    let nodeCountId = 'nodeCount' + vid;
                    let nodeSolveId = 'nodeSolve' + vid;
                    let nodeSourceId = 'nodeSource' + vid;
                    elements.push(
                      {
                        type: 'vbox',
                        // widths: [ '50%', '15%', '20%', '15%' ],
                        align: 'right',
                        width: '200px',
                        children: [
                          {
                            type: 'button',
                            id: 'prev',
                            label: '<',
                            title: 'Previous',
                            align: 'center',
                            onClick: function() {
                              document.getById(nodeCountId).setText(pagination.currNid());
                              let node = nodes[pagination.prevNid()];
                              node.selector.scrollIntoView();
                              dialog.addFocusable(node.selector);
                              document.getById(nodeSolveId).setText(node.failureSummary);
                              document.getById(nodeSourceId).setText(node.source);
                            },
                          },
                          {
                            type: 'html',
                            id: nodeCountId + vid,
                            html: '<div id=' + nodeCountId + '>1</div>' + ' of ' + count,
                          },
                          {
                            type: 'button',
                            id: 'next',
                            label: '>',
                            title: 'Next',
                            align: 'right',
                            onClick: function() {
                              document.getById(nodeCountId).setText(pagination.currNid());
                              let node = nodes[pagination.nextNid()];
                              node.selector.focus();
                              node.selector.scrollIntoView();
                              document.getById(nodeSolveId).setText(node.failureSummary);
                              document.getById(nodeSourceId).setText(node.source);
                            },
                          },
                          {
                            type: 'html',
                            id: vid,
                            html: '<h2>To solve this violation</h2><div id=' + nodeSolveId + '>' + nodes[pagination.currNid()].failureSummary + '</div>' +
                              '<h2>Element source: </h2><div id=' + nodeSourceId + '>'  + nodes[pagination.currNid()].source + '</div>'
                          },
                        ]
                      },
                    );
                  }
                  dialogDefinition.addContents({
                    id: violation.id,
                    label: violation.help,
                    elements: elements,
                    onLoad: function () {
                      nodes[pagination.firstNid()].selector.scrollIntoView();
                      nodes[pagination.firstNid()].selector.focus();
                      dialog.addFocusable(nodes[pagination.firstNid()]);
                    }
                  });
                }
              });
            }
          });
        }

        return true;
      };

      /**
       * Path to aXe library on your website.
       *
       * Path is not defined yet.
       * But you have two ways to define it:
       * - First one is when you will add it to:
       * CKEDITOR.config.axe.path = 'url://path/to/axe.min.js'
       * - Second way is when you will include axe.js in <head> tag.
       * And it will be detected automatically.
       */
      axe.path = undefined;

      /**
       * Method is created in order to override default axe settings with
       * custom one.
       *
       * @todo: It should be tested.
       *
       * @param {object} settings - Custom settings object.
       *
       * @return {boolean} Status.
       */
      axe.override = function (settings) {
        // Process settings object.
        if (typeof settings !== "undefined") {
          // Access to dialog window.
          this.dialogAccess = typeof settings.dialogAccess !== "undefined" ? settings.dialogAccess : false;
          // Context.
          if (typeof settings.context !== "undefined") {
            this.context = settings.context;
          }
          // Arguments to run function (including rules which are not allowed.).
          if (typeof settings.run !== "undefined") {
            settings.run.runOnly = typeof settings.run.runOnly !== "undefined" ? settings.run.runOnly : this.run.runOnly;
            // There are some rules which can't be overridden.
            let mandatoryRules = this.run.rules;
            Object.keys(mandatoryRules).forEach(function (key) {
              settings.run[key] = mandatoryRules[key];
            });
            this.run = settings.run;
          }
          // Callback to override default behavior.
          if (typeof settings.callback === "function") {
            this.callback = settings.callback;
          }
          // Path to aXe library.
          if (typeof settings.path === "string") {
            this.path = settings.path;
          }
        }
        // Extra validation to aXe path library.
        if (typeof this.path !== "string") {
          // Get script by file name.
          let scripts = document.querySelectorAll(
          // @todo: Check compatibility of the attribute selectors.
          "script[src$='/axe.js'],script[src$='/axe.min.js']");
          // Set to static variable.
          if (scripts.length) {
            // @todo: Detect usage of min.js and dev version.
            this.path = scripts[0].src;
          } else {
            console.error(
            // @todo: Multilanguage.
            "Can't fin axe.js or axe.min.js file. Please check if they were included.");
            return false;
          }
        }
        // Define callback number.
        if (typeof this.callbackNumber === "undefined") {
          this.callbackNumber = CKEDITOR.tools.addFunction(this.callback);
        }
        return true;
      };

      // Save our object into plugin.
      this.axe = axe;
    },

    /**
     * Plugin initialization logic goes inside this method.
     *
     * @param {object} editor - CKEditor editor object.
     */
    init: function init(editor) {
      // Get plugin definition.
      let plugin = this;
      // @todo: Multilanguage.
      let lang = editor.lang.axe;
      
      // Override default plugin settings.
      plugin.axe.override(editor.config.axe);
      
      // Add dialog and button command.
      let execButtonCommand = "axe";
      if (plugin.axe.dialogAccess) {
        execButtonCommand = "axeTagsDialog";
        CKEDITOR.dialog.add("axeTagsDialog", this.path + "dialogs/axeTagsDialog.js");
        editor.addCommand( "axeTagsDialog", new CKEDITOR.dialogCommand("axeTagsDialog"));
      }
      editor.addCommand( "axeResultsDialog", new CKEDITOR.dialogCommand("axeResultsDialog"));
      CKEDITOR.dialog.add("axeResultsDialog", this.path + "dialogs/axeResultsDialog.js");
      
      // Add extra scripts when editor is ready.
      editor.on("instanceReady", function () {
        let scripts = [plugin.axe.path, plugin.path + "frame.js"];
        let frame = this;
        scripts.forEach(function (src) {
          frame.document.getHead().append(frame.document.createElement("script", {
            attributes: { src: src, type: "text/javascript", defer: true }
          }));
        });
      });
      // Create the toolbar button that executes the above command.
      editor.ui.addButton("axe", {
        label: lang.name,
        command: execButtonCommand,
        icon: plugin.path + "icons/axe.png",
        // According to other plugins - property "toolbar" should be added by default.
        // @see plugins/about/plugin.js
        toolbar: "others"
      });
      
      // Define the editor command.
      editor.addCommand("axe", {
        canUndo: false,
        // Define the function that will be fired when the command is executed.
        exec: function exec(editor) {
          // Prepare message.
          let message = {
            command: "run",
            editor: editor.name,
            arguments: {
              context: plugin.axe.context,
              options: plugin.axe.run,
              callback: plugin.axe.callbackNumber
            }
          };
          // Send message to iframe to run aXe.
          editor.document.getWindow().$.postMessage(message);
        }
      });
    }
  });
})(CKEDITOR);
