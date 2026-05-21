// Per-template variable shapes. Keeps consumers honest — TypeScript catches
// when a caller forgets a variable a template needs.

export type OrderConfirmationVars = {
  customer_name: string;
  order_number: string;
  order_date: string;
  plan_name: string;
  plan_cycle: string;
  order_total: string;
  billing_email: string;
  view_order_url: string;
};

export type LicenseDeliveryVars = {
  customer_name: string;
  plugin_name: string;
  license_key: string;
  max_sites: number;
  expires_at: string;
  download_url: string;
  activation_docs_url: string;
  dashboard_url: string;
};

export type WelcomeVars = {
  customer_name: string;
  plugin_name: string;
  docs_url: string;
  support_email: string;
  community_url: string;
};

export type RenewalUpcomingVars = {
  customer_name: string;
  plugin_name: string;
  renewal_date: string;
  renewal_amount: string;
  payment_method_last4: string;
  manage_subscription_url: string;
};

export type RenewalSuccessfulVars = {
  customer_name: string;
  plugin_name: string;
  renewal_date: string;
  amount: string;
  next_renewal_date: string;
  invoice_url: string;
};

export type PaymentFailedVars = {
  customer_name: string;
  plugin_name: string;
  amount: string;
  update_payment_url: string;
  retry_date: string;
  grace_period_days: number;
};

export type SubscriptionCancelledVars = {
  customer_name: string;
  plugin_name: string;
  cancellation_date: string;
  access_until_date: string;
  reactivate_url: string;
};

export type LicenseExpiredVars = {
  customer_name: string;
  plugin_name: string;
  expired_on: string;
  reactivate_url: string;
};

export type SiteActivatedVars = {
  customer_name: string;
  plugin_name: string;
  site_url: string;
  activated_at: string;
  current_sites: number;
  max_sites: number;
  manage_sites_url: string;
};

export type PasswordResetVars = {
  customer_name: string;
  reset_url: string;
  request_ip: string;
  expires_in_hours: number;
};

export type NewUserVars = {
  customer_name: string;
  login_email: string;
  reset_url: string;
  expires_in_hours: number;
  dashboard_url: string;
};

export type PasswordChangedVars = {
  customer_name: string;
  changed_at: string;
  request_ip: string;
  login_url: string;
};
