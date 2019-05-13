<?php

namespace Drupal\ckeditor_axe\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginInterface;
use Drupal\ckeditor\CKEditorPluginButtonsInterface;
use Drupal\Component\Plugin\PluginBase;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "ckeditor axe" plugin.
 *
 * @CKEditorPlugin(
 *   id = "ckeditor_axe",
 *   label = @Translation("ckeditor axe"),
 *   module = "ckeditor_axe"
 * )
 */
class CkeditorAxe extends PluginBase implements CKEditorPluginInterface, CKEditorPluginButtonsInterface {

  /**
   * {@inheritdoc}
   */
  public function getFile() {
    return drupal_get_path('module', 'ckeditor_axe') . '/js/plugins/ckeditor_axe/plugin.js';
  }

  /**
   * {@inheritdoc}
   */
  public function getDependencies(Editor $editor) {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function getLibraries(Editor $editor) {
    return [
      'ckeditor_axe/axe',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function isInternal() {
    return FALSE;
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
   * {@inheritdoc}
   */
  public function isEnabled(Editor $editor) {
  }

  /**
   * {@inheritdoc}
   */
  public function getConfig(Editor $editor) {
    return [];
  }

}
