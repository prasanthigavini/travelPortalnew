<?php
namespace Drupal\travel_portal\Controller;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\Display\EntityViewDisplayInterface;

class TravelPortalController extends ControllerBase {
/**
   * {@inheritdoc}
   */
  public function checkOthersEmpid(Request $request) {	 
	  $othersEmpId = $request->request->get('emp_id');
	  $query = \Drupal::entityQuery('user');
	  $userid = $query->condition('field_employee_id', $othersEmpId, '=')
						->execute();	  
	  if (!empty($userid)) {
		  $otherUserid = end(array_keys($userid));
		  if(!empty($otherUserid)){
			  $othersEmpInfo = \Drupal\user\Entity\User::load($otherUserid);
			  $othersEmpBand = !empty($othersEmpInfo->field_employee_band) ? $othersEmpInfo->field_employee_band->value : '';
			  if(!empty($othersEmpBand)){
				  $response = array($othersEmpBand);
				  return new Response(json_encode($response));
			  }else{
				  $response = array("invalid_emp_id");
				  return new Response(json_encode($response));
			  }
		  }
	  }
	  else{
		  $response = array("invalid_emp_id");
		  return new Response(json_encode($response));
	  }
  }
}