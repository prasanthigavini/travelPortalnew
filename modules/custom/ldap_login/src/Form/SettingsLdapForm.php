<?php

/**
 * @file
 * Contains Drupal\ldap_login\Form\SettingsLdapForm.
 */

namespace Drupal\ldap_login\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class SettingsForm.
 *
 * @package Drupal\ldap_login\Form
 */
class SettingsLdapForm extends ConfigFormBase {

    /**
     * {@inheritdoc}
     */
    protected function getEditableConfigNames() {
        return [
            'ldap_login.settings',
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getFormId() {
        return 'settings_ldap_form';
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state) {
        $config = $this->config('ldap_login.settings');
        $form['ldap_entity'] = array(
            '#type' => 'textarea',
            '#title' => $this->t('Ldap Entity'),
            '#default_value' => $config->get('ldap_entity'),
        );
        $form['ldap_config'] = array(
            '#type' => 'textarea',
            '#title' => $this->t('Ldap Configuration'),
            '#default_value' => $config->get('ldap_config'),
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

        $this->config('ldap_login.settings')
                ->set('ldap_config', $form_state->getValue('ldap_config'))
                ->set('ldap_entity', $form_state->getValue('ldap_entity'))
                ->save();
    }

}
