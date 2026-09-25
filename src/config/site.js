// Company details used across the site. Edit here; nothing else needs to change.
export const site = {
  name: 'Pentacon Construction',
  shortName: 'Pentacon',

  social: {
    instagram: 'https://www.instagram.com/pentacon.egy?stkn=MWZrdXFzM2F2a2VhMA==',
    facebook: 'https://www.facebook.com/share/19CNeDhZdk/?mibextid=wwXIfr',
    linkedin: 'https://lnkd.in/p/eAb3FdBR'
  },

  // Leave a value empty to hide it. Fill these in when you have the real details.
  contact: {
    email: 'info@pentacon.com',
    phone: '01101202340',
    whatsapp: '01101202340',
    address: ''
  },

  // Contact form endpoint (see .env.example). Empty means: open the visitor's email app instead.
  contactFormUrl: import.meta.env.VITE_CONTACT_FORM_URL || ''
};
