export const RESEND_COOL_DOWN = 2 * 60 * 1000;
export const RESEND_STORAGE_KEY = "verify_email_resend_until";

export function startResendCooldown() {
  localStorage.setItem(
    RESEND_STORAGE_KEY,
    JSON.stringify(Date.now() + RESEND_COOL_DOWN),
  );
}
