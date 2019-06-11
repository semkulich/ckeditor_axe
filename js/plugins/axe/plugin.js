"use strict";

(function (CKEDITOR) {
  CKEDITOR.plugins.add("axe", {
    // @todo: Investigate axe-core languages system.
    lang: "en",
    // The plugin initialization logic goes inside this method.
    init: function init(editor) {
      var plugin = this;
      // @todo: Multilanguage.
      var lang = editor.lang.axe;

      // Mechanism to override default settings.
      // @todo: It should be tested.
      if (typeof editor.config.axe !== "undefined") {
        // Context.
        if (typeof editor.config.axe.context !== "undefined") {
          plugin.axe.context = editor.config.axe.context;
        }
        // Arguments to run function (including rules which are not allowed.).
        if (typeof editor.config.axe.run !== "undefined") {
          // There are some rules which can't be overriden.
          var rules = plugin.axe.run.rules;
          plugin.axe.run = editor.config.axe.run || {};
          plugin.axe.run.rules = rules;
        }
        // Callback to override default behavior.
        if (typeof editor.config.axe.callback === "function") {
          plugin.axe.callback = editor.config.axe.callback;
        }
        // Path to aXe library.
        if (typeof editor.config.axe.path === "string") {
          plugin.axe.path = editor.config.axe.path;
        }
      }
      // Extra validation to aXe path library.
      if (typeof plugin.axe.path !== "string") {
        plugin.axe.path = plugin.axe._getPath();
      }
      // Create the toolbar button that executes the above command.
      editor.ui.addButton("axe", {
        label: lang.name,
        command: "axe",
        icon: "icons/axe.png",
        // According to other plugins - property "toolbar" should be added by default.
        // @see plugins/about/plugin.js
        toolbar: "others"
      });

      // Add extra scripts when editor is ready.
      editor.on("instanceReady", function () {
        var scripts = [plugin.axe.path, plugin.path + "frame.js"];
        var frame = this;
        scripts.forEach(function (src) {
          frame.document.getHead().append(frame.document.createElement("script", {
            attributes: { src: src, type: "text/javascript", defer: true }
          }));
        });
      });

      // Define the editor command.
      editor.addCommand("axe", {
        canUndo: false,
        // Define the function that will be fired when the command is executed.
        exec: function exec(editor) {
          // Define callback number.
          if (typeof plugin.axe._func === "undefined") {
            plugin.axe._func = CKEDITOR.tools.addFunction(plugin.axe.callback);
          }
          // Prepare message.
          var message = {
            command: "run",
            editor: editor.name,
            arguments: {
              context: plugin.axe.context,
              options: plugin.axe.run,
              callback: plugin.axe._func
            }
          };
          // Send message to iframe to run aXe.
          editor.document.getWindow().$.postMessage(message);
        }
      });
    },

    /**
     * Section with aXe related settings and functionality.
     *
     * Here you will see default settings for this plugin. But you will be allowed to override them via CKEDITOR.config.
     */
    axe: {
      /**
       * Default context is "document".
       *
       * If value of context is undefined - "document" will be used instead.
       * If you need detailed configuration @see: https://www.deque.com/axe/axe-for-web/documentation/api-documentation/#user-content-api-name-axerun
       */
      context: undefined,
      /**
       * Settings section which will be passed into aXe run command as arguments.
       */
      run: {
        /**
         * Tags to use to get default set of rules.
         */
        runOnly: {
          type: "tag",
          values: ["wcag2a"]
        },
        /**
         * Rules to exclude from check.
         *
         * For details @see: https://www.deque.com/axe/axe-for-web/documentation/api-documentation/#user-content-options-parameter-examples
         * List of rules below are excluded because they are not applicable to CKEditor functionality.
         */
        rules: {
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
        }
      },

      /**
       * Callback to catch results of the axe check.
       *
       * This callback is defined as separate plugin property to provide possibility to override it.
       *
       * @param {object|undefined} error - aXe error.
       * @param {object} results - aXe results.
       * @param {string} editorName - Name of CKEditor instance.
       *
       * @return {boolean} status.
       */
      callback: function callback(error, results, editorName) {
        if (error) throw error;
        console.log(results);

        // Validate editor instance.
        if (typeof CKEDITOR.instances[editorName] === "undefined") {
          // @todo: Multilanguage.
          // @todo: Check if there is a way to provide multilanguage with dynamic argument in string.
          console.error("Can't find editor instance.");
          return false;
        }
        var editor = CKEDITOR.instances[editorName];

        if (typeof results.violations !== "undefined" && results.violations.length > 0) {
          var title = "<p>" + results.violations[0].help + "</p>";
          var content = "<p>" + results.violations[0].description + "</p>";
          var panel = new CKEDITOR.ui.balloonPanel(editor, {
            title: title,
            content: content
          });

          // Balloon panel demo.
          var target = new CKEDITOR.dom.element(editor.document.$.getElementById("test_image"));
          panel.attach(target);
        }
        return true;
      },

      /**
       * Path to aXe library on your website.
       *
       * Path is not defined yet.
       * But you have two ways to define it:
       * - First one is when you will add it to:
       * CKEDITOR.config.axe.path = 'url://path/to/axe.min.js'
       * - Second way is when you will include axe.js in head tag
       * And it will be detected automatically.
       */
      path: undefined,

      /**
       * Function to get path to aXe library automatically if that is possible.
       *
       * @return {string|null} Path to axe library.
       */
      _getPath: function _getPath() {
        // Return existing path if we have it.
        if (typeof this._axePath !== "undefined") {
          return this._axePath;
        } else {
          this._axePath = null;
        }
        // Get script by file name.
        var scripts = document.querySelectorAll(
        // @todo: Check compatibility of the attribute selectors.
        "script[src$='/axe.js'],script[src$='/axe.min.js']");
        // Set to static variable.
        if (scripts.length) {
          // @todo: Detect usage of min.js and dev version.
          this._axePath = scripts[0].src;
        } else {
          console.error(
          // @todo: Multilanguage.
          "Can't fin axe.js or axe.min.js file. Please check if they were included.");
        }
        return this._axePath;
      }
    }
  });
})(CKEDITOR);
