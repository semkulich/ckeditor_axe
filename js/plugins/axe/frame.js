"use strict";

(function () {
  /**
   * We will add a small even listener to get signal from parent window to execute aXe check.
   */
  window.addEventListener("message", function (event) {
    // @todo: We should do something to log this errors in parent window.
    // Validate message for security.
    if (window.origin !== event.origin) {
      console.error("Insecure command detected.");
      return false;
    }
    // Validate incoming command.
    var msg = event.data;
    if (typeof msg.command === "undefined") {
      console.error("Command type is not defined.");
      return false;
    }
    // Validate editor instance.
    var CKEDITOR = window.parent.CKEDITOR;
    if (typeof msg.editor === "undefined" || typeof CKEDITOR.instances[msg.editor] === "undefined") {
      console.error("Editor instance is invalid.");
      return false;
    }

    // Execute command (at current moment we have only one type of commands "run").
    if (msg.command === "run") {
      var args = msg.arguments;
      var context = document.body;
      // We will allow developer to provide custom context if they want.
      context = typeof args.context !== "undefined" ? args.context : context;
      // Redirect execution to parent frame.
      axe.run(context, args.options, function (error, results) {
        CKEDITOR.tools.callFunction(args.callback, error, results, msg.editor);
      });
    } else {
      console.error("Invalid command.");
    }
  });
})();