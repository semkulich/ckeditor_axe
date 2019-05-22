<?php

namespace Drupal\ckeditor_axe\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginBase;
use Drupal\ckeditor\CKEditorPluginConfigurableInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\ckeditor\CKEditorPluginButtonsInterface;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "ckeditor axe" plugin.
 *
 * @CKEditorPlugin(
 *   id = "ckeditor_axe",
 *   label = @Translation("Ckeditor AXE"),
 *   module = "ckeditor_axe"
 * )
 */
class CkeditorAxe extends CKEditorPluginBase implements CKEditorPluginConfigurableInterface, CKEditorPluginButtonsInterface {

  /**
   * {@inheritdoc}
   */
  public function getFile() {
    return drupal_get_path('module', 'ckeditor_axe') . '/js/plugins/ckeditor_axe/plugin.js';
  }

  /**
   * {@inheritdoc}
   */
  public function getLibraries(Editor $editor) {
    return [
      'ckeditor_axe/axe',
      'core/jquery.joyride',
      'core/drupalSettings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getConfig(Editor $editor) {
    $settings = $editor->getSettings()['plugins']['ckeditor_axe'];
    $config['ckeditor_axe'] = [];
    foreach ($this->options() as $option => $description) {
      $config['ckeditor_axe'][$option] = isset($settings['options'][$option]) ? $settings['options'][$option] : TRUE;
    }

    return $config;
  }

  /**
   * {@inheritdoc}
   */
  public function getButtons() {
    return [
      'ckeditor_axe' => [
        'label' => t('Axe'),
        'image' =>  drupal_get_path('module', 'ckeditor_axe') . '/js/plugins/ckeditor_axe/icons/ckeditor_axe.png',
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
  public function settingsForm(array $form, FormStateInterface $form_state, Editor $editor) {
    $editor_settings = $editor->getSettings();
    if (isset($editor_settings['plugins']['ckeditor_axe'])) {
      $settings = $editor_settings['plugins']['ckeditor_axe'];
    }

    $form['label'] = [
      '#type' => 'label',
      '#title' => t('Accessibility Standard/Purpose'),
    ];

    foreach ($this->options() as $setting => $description) {
      $form['options'][$setting] = [
        '#type' => 'checkbox',
        '#title' => $description,
        '#default_value' => isset($settings['options'][$setting]) ? $settings['options'][$setting] : TRUE,
      ];
    }

    return $form;
  }

}
