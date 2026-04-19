export const FORMATS = [
  {
    id: 'emailer',
    label: 'Emailer',
    icon: 'Mail',
    description: 'Subject, heading, body, CTA',
  },
  {
    id: 'social',
    label: 'Social media',
    icon: 'Share2',
    description: 'Instagram, LinkedIn, X',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp / SMS',
    icon: 'MessageCircle',
    description: 'Broadcast + SMS variant',
  },
  {
    id: 'ads',
    label: 'Ad copy',
    icon: 'Megaphone',
    description: 'Google + Meta formats',
  },
  {
    id: 'push',
    label: 'Push notification',
    icon: 'Bell',
    description: 'Title, body, urgency',
  },
] as const;
