<?php

namespace Drupal\travel_hris\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;

/**
 * Provides UserImportController page.
 */
class UserImportController extends ControllerBase {

  /**
   * function to assigned child to volunteer
   */
  public function importUser() {

    // Project Manager Exist
    $pmEmpId = 14713;
    $pmUID = '';
    $pmData = $this->user_exist($pmEmpId);
    if(!count($pmData) == 0) {
      $pmUID = key($pmData);
    } else {
      $this->create_user($pmEmpId, 'project_manager');
    }

    // DLT Exist
    $dltEmpId = 51;
    user_exist($pmEmpId);

    
    // Creating User
    $email = $item[1];
    $result = $this->queryFactory->get('user')
        ->condition('mail', strtolower(trim($email)), 'LIKE')->execute();
    if (empty($result) || count($result) == 0) {
    $emp_id = $item[2];
    $emp_band = $item[3];
    $emp_fname = $item[4];
    $emp_mname = $item[5];
    $emp_lname = $item[6];
    $emp_gender = $item[7];
    $emp_contact = $item[8];
    $emp_pm = $item[9];
    $emp_dlt = $item[10];
    $emp_roles_txt = $item[11];

    $pwd = $emp_fname . '.' . $emp_lname . '-' . $emp_id;
      $user = \Drupal\user\Entity\User::create();
      //Mandatory settings
      $user->setPassword($pwd);
      $user->enforceIsNew();
      $user->setEmail($email);
      $user->setUsername($email);
    $user->set("init", $email);
    $user->set("field_employee_id", $emp_id);
    $user->set("field_employee_band", $emp_band);
    $user->set("field_employee_name", $emp_fname);
    $user->set("field_second_name", $emp_mname);
    $user->set("field_surname", $emp_lname);
    $user->set("field_gender", $emp_gender);
    $user->set("field_employee_name", $emp_contact);
    //$user->set("field_pm", $emp_pm);
    //$user->set("field_dlt", $emp_dlt);
    $user->addRole('Employee');
    $emp_roles = explode(',', $emp_roles_txt);
    foreach ($emp_roles as $emp_role) {
      $user->addRole($emp_role);
    }
    $user->activate();

    //Save user
    $userData = $user->save(); // $user->id()
  }

}

  public function user_exist($empId) {
    $result = \Drupal::entityQuery("user")
    ->condition('field_employee_id', $empId)
    ->execute();

    return $result;
  }

  public function create_user($empID, $role) {
    $email = 'email' . $empID . '@gmail.com';
    $result = $this->queryFactory->get('user')
        ->condition('mail', strtolower(trim($email)), 'LIKE')->execute();
    if (empty($result) || count($result) == 0) {
      $emp_id = $empID;
      $emp_band = 'B';
      $emp_fname = 'Firts Name';
      $emp_mname = 'Middle Name';
      $emp_lname = 'Last Name';
      $emp_gender = 'Male';
      $emp_contact = '1234565789';
      $emp_pm = $item[9];
      $emp_dlt = $item[10];
      $emp_roles_txt = $item[11];

    }
  }
}
