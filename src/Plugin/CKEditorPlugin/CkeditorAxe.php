<?php

namespace Drupal\ckeditor_axe\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginBase;
use Drupal\ckeditor\CKEditorPluginConfigurableInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\ckeditor\CKEditorPluginButtonsInterface;
use Drupal\Core\Url;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "axe" plugin.
 *
 * @CKEditorPlugin(
 *   id = "axe",
 *   label = @Translation("AXE"),
 *   module = "ckeditor_axe"
 * )
 */
class CkeditorAxe extends CKEditorPluginBase implements CKEditorPluginConfigurableInterface, CKEditorPluginButtonsInterface {

  /**
   * {@inheritdoc}
   */
  public function getFile() {
    return drupal_get_path('module', 'ckeditor_axe') . '/js/plugins/axe/plugin.js';
  }

  /**
   * {@inheritdoc}
   */
  public function getLibraries(Editor $editor) {
    return [
      'core/jquery',
      'core/jquery.ui',
      'core/jquery.ui.dialog',
      'core/drupalSettings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getButtons() {
    return [
      'axe' => [
        'label' => t('Axe'),
        'image' =>  drupal_get_path('module', 'ckeditor_axe') . '/js/plugins/axe/icons/axe.png',
      ],
    ];
  }

  /**
   * Additional settings options.
   *
   * @return array
   *   An array of settings options and their descriptions.
   */
  public function options() {
    return [
      'wcag2a' => 'WCAG 2.0 Level A',
      'wcag2aa' => 'WCAG 2.0 Level AA',
      'wcag21aa' => 'WCAG 2.1 Level AA',
      'section508' => 'Section 508',
      'best-practice' => 'Best practices endorsed by Deque',
      'experimental' => 'Cutting-edge techniques',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getConfig(Editor $editor) {
    $editor_settings = $editor->getSettings();
    $settings = $editor_settings['plugins']['axe'];
    $config['axe'] = [];
    $config['axe']['path'] = '/core/modules/ckeditor_axe/assets/vendor/axe-core/axe.min.js';
    // Add Accessibility standards to editor.
    foreach ($this->options() as $option => $description) {
      $config['axe']['tags'][$option] = isset($settings['options'][$option])  ? $settings['options'][$option] : FALSE;
      if (isset($settings['options'][$option]) && $settings['options'][$option]) {
        $config['axe']['run']['runOnly'][] = $option;
      }
    }
    $config['axe']['dialogAccess'] = isset($settings['dialog_access']) ? $settings['dialog_access'] : TRUE;
    return $config;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state, Editor $editor) {
    $editor_settings = $editor->getSettings();
    if (isset($editor_settings['plugins']['axe'])) {
      $settings = $editor_settings['plugins']['axe'];
    }
    // Add options list with Accessibility Standard/Purpose.
    $form['dialog_access'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Allow change Accessibility Standard on dialog window.'),
      '#default_value' => isset($settings['dialog_access']) ? $settings['dialog_access'] : 1,
    ];

    $form['options'] = [
      '#type' => 'details',
      '#title' => $this->t('Accessibility Standard/Purpose'),
    ];

    foreach ($this->options() as $option => $description) {
      $default_value = $option === 'wcag2a' ? 1 : 0;
      $form['options'][$option] = [
        '#type' => 'checkbox',
        '#title' => $description,
        '#default_value' => isset($settings['options'][$option])  ? $settings['options'][$option] : $default_value,
      ];
    }
    return $form;
  }

}
