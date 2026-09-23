/** Builds a WhatsApp chat link from a phone number (digits only). */
export const whatsappLink = (number) => `https://wa.me/${(number ?? '').replace(/\D/g, '')}`;

/** Opens a Gmail compose window (or the installed Gmail app) addressed to `to`. */
export const gmailLink = (to, subject = '') =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}`;