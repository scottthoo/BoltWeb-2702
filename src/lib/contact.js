// Single source of truth for how prospects reach Scott.
export const EMAIL = "scott@bolt-interactive.com";
export const PHONE_E164 = "+601115497865";
export const PHONE_DISPLAY = "+60 11-1549 7865";

const WHATSAPP_NUMBER = "601115497865";

export const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const BRIEFING_LINK = whatsappLink(
  "Hi Scott, I would like to discuss strategic AI implementation"
);
