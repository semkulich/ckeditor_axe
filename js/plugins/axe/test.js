"use strict";

// Add extra plugins.
CKEDITOR.plugins.addExternal("axe", "/axe/", "plugin.js");
CKEDITOR.plugins.addExternal("a11ychecker", "/test/a11ychecker/", "plugin.js");
CKEDITOR.config.extraPlugins = "axe,balloonpanel,a11ychecker";
// Configure our plugin.
CKEDITOR.config.axe = {};
CKEDITOR.config.axe.path = "/node_modules/axe-core/axe.js";
// Set bigger height for testing.
CKEDITOR.config.height = 700;
// Set CKEditor.
CKEDITOR.replace("cke_edit-body-0-value");