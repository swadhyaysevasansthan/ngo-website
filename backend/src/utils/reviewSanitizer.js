export const sanitizeReviewInput = (input) => {
  const clean = {};
  
  if (input.name) clean.name = input.name.trim().substring(0, 100);
  if (input.email) clean.email = input.email.trim().toLowerCase();
  if (input.phone) clean.phone = input.phone.trim().replace(/[^+\d\s-]/g, '').substring(0, 20);
  if (input.designation) clean.designation = input.designation.trim().substring(0, 100);
  if (input.review_text) clean.review_text = input.review_text.trim();
  if (input.recaptchaToken) clean.recaptchaToken = input.recaptchaToken;
  
  return clean;
};