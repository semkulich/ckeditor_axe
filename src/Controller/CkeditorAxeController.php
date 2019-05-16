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

    $response['data'] = 'Some test data to return';
    if (0 === strpos( $request->headers->get('Content-Type'), 'application/json')) {
      $data = json_decode($request->getContent(), TRUE);
      if (isset($data['results']) && !empty($data['results']['passes'])) {
        $count = count($data['results']['passes']);
        foreach ($data['results']['passes'] as $key => $item) {
          $selector = $item['nodes'][0]['target'][0];
          $results .= '<div class="joyride-tip-guide tip-module-ckeditor-axe tip-type-text tip-introduction"  data-index="0"  data-index="0" style="visibility: visible; display: block; top: 241.399px; left: 801.5px;">
            <span class="joyride-nub" style="display: none;"></span>
         
            <div class="joyride-content-wrapper" role="dialog" aria-labelledby="tour-tip-introduction-label" aria-describedby="tour-tip-introduction-contents">
              <h2 class="tour-tip-label">' . $item['id'] . '</h2>
          
              <p class="tour-tip-body">' . $item['description'] . $item['help'] . $item['help_url'] . '</p>
          
              <div class="tour-progress">' . $key . ' off ' . $count . '</div>
          
              <a href="#" class="button button--primary joyride-next-tip">Next</a>
              <a href="#close" class="joyride-close-tip" aria-label="Close">×</a>
            </div>
          </div>';}
      }

    }

//    $content = '<ol data-joyride data-autostart="true" id="docs-joyride">' . $results . '</ol>';


//    $response = new AjaxResponse();
//    $response->addCommand(new AppendCommand('.layout-container', $output));
////    $response->addCommand(new InvokeCommand('.layout-container', 'addClass', ['visually-hidden']));
//    return $response;

//    $rendered = \Drupal::service('renderer')->render($content);


    $response['data'] = $results;
    $response['method'] = 'POST';
    return new JsonResponse($response);
  }

}
