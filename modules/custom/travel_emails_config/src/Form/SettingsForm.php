<?php

/**
 * @file
 * Contains Drupal\travel_emails_config\Form\SettingsForm.
 */

namespace Drupal\travel_emails_config\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class SettingsForm.
 *
 * @package Drupal\travel_emails_config\Form
 */
class SettingsForm extends ConfigFormBase {

    /**
     * {@inheritdoc}
     */
    protected function getEditableConfigNames() {
        return [
            'travel_emails_config.settings',
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getFormId() {
        return 'settings_form';
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state) {
        $config = $this->config('travel_emails_config.settings');
        $form['emails'] = array(
            '#type' => 'textfield',
            '#title' => $this->t('Emails'),
            '#default_value' => $config->get('emails'),
        );
        $form['travel_emails'] = array(
            '#type' => 'textfield',
            '#title' => $this->t('Travel Management Emails'),
            '#default_value' => $config->get('travel_emails'),
        );
        $form['accomodation_emails'] = array(
            '#type' => 'textfield',
            '#title' => $this->t('Accomodation Emails'),
            '#default_value' => $config->get('accomodation_emails'),
        );
        $form['cc_emails'] = array(
            '#type' => 'textfield',
            '#title' => $this->t('CC Emails'),
            '#default_value' => $config->get('cc_emails'),
        );
        $form['international_emails'] = array(
            '#type' => 'textfield',
            '#title' => $this->t('International Emails'),
            '#default_value' => $config->get('international_emails'),
        );
        $form['email_settings'] = array(
            '#type' => 'select',
            '#title' => $this->t('Email Configuration'),
            '#options' => array(t('- Select -'), 'dev' => t('Development'), 'prod' => t('Production')),
            '#default_value' => $config->get('email_settings'),
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

        $this->config('travel_emails_config.settings')
                ->set('emails', $form_state->getValue('emails'))
                ->set('travel_emails', $form_state->getValue('travel_emails'))
                ->set('accomodation_emails', $form_state->getValue('accomodation_emails'))
                ->set('cc_emails', $form_state->getValue('cc_emails'))
                ->set('email_settings', $form_state->getValue('email_settings'))
                ->set('international_emails', $form_state->getValue('international_emails'))
                ->save();
    }

}
