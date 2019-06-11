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
    return drupal_get_path('module', 'ckeditor_axe') . '/js/plugins/axe/plugin.js';
  }

  /**
   * {@inheritdoc}
   */
  public function getLibraries(Editor $editor) {
    return [
      'core/jquery',
      'core/drupalSettings',
    ];
  }


  /**
   * {@inheritdoc}
   */
  public function getConfig(Editor $editor) {
    $editor_settings = $editor->getSettings();
    $settings = $editor_settings['plugins']['axe'];
    $config['axe'] = [];
    foreach ($this->options() as $option => $description) {
      if (isset($settings['options'][$option]) && $settings['options'][$option]) {
        $config['axe']['tags'][] = $option;
      }
    }
    // Add excluded rules to editor.
    foreach ($this->excludedRules() as $rule) {
      $config['axe']['excluded_rules'][$rule] = isset($settings['excluded_rules'][$rule]) ? $settings['excluded_rules'][$rule] : ['enabled' => FALSE];
    }
    return $config;
  }

  /**
   * {@inheritdoc}
   */
  public function getButtons() {
    return [
      'axe' => [
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
   * Additional settings AXE rules.
   *
   * @return array
   *   An array of excluded rules.
   */
  protected function excludedRules() {
    return [
      'aria-hidden-body',
      'bypass',
      'document-title',
      'frame-tested',
      'frame-title-unique',
      'frame-title',
      'html-has-lang',
      'html-lang-valid',
      'html-xml-lang-mismatch',
      'landmark-banner-is-top-level',
      'landmark-complementary-is-top-level',
      'landmark-contentinfo-is-top-level',
      'landmark-main-is-top-level',
      'landmark-no-duplicate-banner',
      'landmark-no-duplicate-contentinfo',
      'landmark-one-main',
      'meta-viewport-large',
      'meta-viewport',
      'page-has-heading-one',
      'region',
      'valid-lang',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state, Editor $editor) {
    $editor_settings = $editor->getSettings();
    if (isset($editor_settings['plugins']['axe'])) {
      $settings = $editor_settings['plugins']['axe'];
    }

    $form['label'] = [
      '#type' => 'label',
      '#title' => t('Accessibility Standard/Purpose'),
    ];

    foreach ($this->options() as $option => $description) {
      $form['options'][$option] = [
        '#type' => 'checkbox',
        '#title' => $description,
        '#default_value' => isset($settings['options'][$option]) ? $settings['options'][$option] : TRUE,
      ];
    }

    foreach ($this->excludedRules() as $rule) {
      $form['excluded_rules'][$rule] = [
        '#type' => 'hidden',
        '#value' => isset($settings['excluded_rules'][$rule]) ? $settings['excluded_rules'][$rule] : ['enabled' => FALSE],
      ];
    }

    return $form;
  }

}
