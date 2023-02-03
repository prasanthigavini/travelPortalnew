<?php

/**
 * Hashing method for casa_mail
 */
public function user_exist($empId) {
  $result = \Drupal::entityQuery("user")
  ->condition('field_employee_id', $empId)
  ->execute();

  return $result;
}

