/**
 * @file
 * CKEditor 'ckeditor_axe' plugin admin behavior.
 */

(function ($, Drupal, drupalSettings) {

  "use strict";

  /**
   * Provides the summary for the "ckeditor_axe" plugin settings vertical tab.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches summary behaviour to the "ckeditor_axe" settings vertical tab.
   */
  Drupal.behaviors.ckeditorCkeditorAxeSettingsSummary = {
    attach: function () {
      $('[data-ckeditor-plugin-id="ckeditor_axe"]').drupalSetSummary(function (context) {
        var options = 'input[name="editor[settings][plugins][ckeditor_axe][options]';
        console.log(options);

        return '';
      });
    }
  };

})(jQuery, Drupal, drupalSettings);
