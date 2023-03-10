<?php

namespace Drupal\admin_content_notification;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Url;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Mail\MailManagerInterface;
use Drupal\user\Entity\User;
use Drupal\Core\Utility\LinkGeneratorInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Logger\LoggerChannelTrait;

/**
 * AdminContentNotificationService implement helper service class.
 */
class AdminContentNotificationService {

  use StringTranslationTrait;
  use LoggerChannelTrait;

  /**
   * The config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The current user account.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $account;

  /**
   * The mail manager instance.
   *
   * @var Drupal\Core\Mail\MailManager
   */
  protected $mailManager;

  /**
   * The link generator instance.
   *
   * @var Drupal\Core\Mail\MailManager
   */
  protected $linkGenerator;

  /**
   * Creates a verbose messenger.
   */
  public function __construct(ConfigFactoryInterface $config_factory, AccountInterface $account, MailManagerInterface $mailManager, LinkGeneratorInterface $linkGenerator) {
    $this->configFactory = $config_factory;
    $this->account = $account;
    $this->mailManager = $mailManager;
    $this->linkGenerator = $linkGenerator;
  }

  /**
   * Get settings of admin content notification.
   */
  public function getConfigs() {
    return $this->configFactory->get('admin_content_notification.settings');
  }

  /**
   * Get users of roles.
   *
   * @return array
   *   Array of User Uids.
   */
  public function getUsersOfRoles($roles) {
    $ids = \Drupal::entityQuery('user')
      ->condition('status', 1)
      ->condition('roles', $roles, 'IN')
      ->execute();
    return $ids;
  }

  /**
   * Check if current user allowed to send admin content notification.
   *
   * @return bool
   *   Return true if allowed to send admin content notification.
   */
  public function isCurrentUserRoleAllowedToSendNotification() {
    $roles = $this->account->getRoles();
    $trigger_for_roles = ($this->getConfigs()->get('admin_content_notification_allowed_roles')) ?: [];
    return count(array_intersect(array_filter($trigger_for_roles), $roles));
  }

  /**
   * Send Eamil.
   *
   * @param Drupal\Core\Entity\EntityInterface $node
   * @param bool $is_new
   */
  public function sendMail(EntityInterface $node, $is_new = FALSE) {
    global $base_url;
    $config = $this->getConfigs();
    $node_type = $node->getType();
    // Checking if the nodetype is the one selected.
    $selected_node_types = $config->get('admin_content_notification_node_types');
    if (count($selected_node_types) && in_array($node_type, $selected_node_types)) {
      // Check if limiting based on node status.
      $selected_node_status = $config->get('admin_content_notification_trigger_on_node_status');
      if ($selected_node_status > 0) {
        $node_published = $node->isPublished();
        // Don't notify of published nodes.
        if ($node_published && $selected_node_status == 2) {
          return;
        }
        // Don't notify of unpublished nodes.
        elseif (!$node_published && $selected_node_status == 1) {
          return;
        }
      }
      $user = $node->getOwner();
      $user_name = $user->getDisplayName();
      $url = Url::fromUri($base_url . '/node/' . $node->id());
      $internal_link = $this->linkGenerator->generate($this->t('@title', ['@title' => $node->label()]), $url);
      $variables = [
        '@user_who_posted' => $user_name,
        '@content_link' => $internal_link,
        '@content_title' => $node->label(),
        '@content_type' => $node_type,
        '@action' => $is_new ? $this->t('posted') : $this->t('updated'),
      ];
      $subject = $this->t($config->get('admin_content_notification_email_subject'), $variables);
      $body = $this->t($config->get('admin_content_notification_email_body'), $variables);
      $admin_email = $config->get('admin_content_notification_email');
      if (empty($admin_email)) {
        $roles_notify = array_keys(array_filter($config->get('admin_content_notification_roles_notified')));
        $ids = $this->getUsersOfRoles($roles_notify);
        $emails = [];
        if (count($ids)) {
          $users = User::loadMultiple($ids);
          foreach ($users as $userload) {
            $emails[] = $userload->getEmail();
          }
        }
        $admin_email = implode(',', $emails);
      }
      $params = [
        'body' => $body,
        'subject' => $subject,
        'nid' => $node->id(),
      ];

      // Allow to alter $admin_email
      // by using hook_admin_content_notification_recipients_alter().
      // @see admin_content_notification.api.php
      \Drupal::moduleHandler()
        ->alter('admin_content_notification_recipients', $admin_email, $node);

      // Allow to alter $params
      // by using hook_admin_content_notification_params_alter().
      // @see admin_content_notification.api.php
      \Drupal::moduleHandler()
        ->alter('admin_content_notification_params', $params, $node);

      $key = 'admin_content_notification_key';
      $this->mailManager->mail('admin_content_notification', $key, $admin_email, 'en', $params, \Drupal::config('system.site')->get('mail'), TRUE);
      $this->getLogger('admin_content_notification')->notice(t('Admin content notification sent to @emails.', ['@emails' => $admin_email]));
    }
  }

}
