<?php

/**
 * @file
 * Contains Drupal\travel_hris\Form\SettingsHrisForm.
 */

namespace Drupal\travel_hris\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class SettingsHrisForm.
 *
 * @package Drupal\travel_hris\Form
 */
class SettingsHrisForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'travel_hris.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'hris_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('travel_hris.settings');
    $form['api_host'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('API Host'),
      '#default_value' => $config->get('api_host'),
    );

    $form['api_username'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('API Username'),
      '#default_value' => $config->get('api_username'),
    );

    $form['api_password'] = array(
      '#type' => 'password',
      '#title' => $this->t('API Password'),
      '#default_value' => $config->get('api_password'),
    );

    $form['grant_type'] = array(
      '#type' => 'select',
      '#title' => $this->t('Grant Type'),
      '#options' => array('password' => t('password')),
      '#default_value' => $config->get('grant_type'),
    );
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('travel_hris.settings')
      ->set('api_host', $form_state->getValue('api_host'))
      ->set('api_username', $form_state->getValue('api_username'))
      ->set('api_password', $form_state->getValue('api_password'))
      ->set('grant_type', $form_state->getValue('grant_type'))
      ->save();
  }

}
