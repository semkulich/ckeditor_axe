<?php

/**
 * @file
 * Contains \Drupal\test_api\Controller\TestAPIController.
 */

namespace Drupal\ckeditor_axe\Controller;

use Drupal\Core\Controller\ControllerBase;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Controller routines for test_api routes.
 */
class CkeditorAxeController extends ControllerBase {

  /**
   * Callback for `ckeditor_axe/post.json` API method.
   */
  public function axe_request(Request $request) {

    $results = '';

    if (0 === strpos( $request->headers->get('Content-Type'), 'application/json')) {
      $data = json_decode($request->getContent(), TRUE);
      if (isset($data['results']) && !empty($data['results']['passes'])) {
        foreach ($data['results']['passes'] as $key => $item) {
          $selector = $item['nodes'][0]['target'][0];
          $results .= '<li data-target="' . $selector . '"><h3>' . $item['id'] . '</h3><p>' . $item['description'] . '</p></li>';
        }
      }
    }

    $content = '<ul id="joyRideTipContent" class="visually-hidden">' . $results . '</ul>';
    $response['data'] = $content;
    $response['method'] = 'POST';
    return new JsonResponse($response);
  }
}
