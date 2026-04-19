export const OCCASION_OPTIONS: Record<string, string[]> = {
  festival: [
    'Diwali', 'Holi', 'Eid al-Fitr', 'Eid ul-Adha', 'Navratri', 'Durga Puja',
    'Raksha Bandhan', 'Karwa Chauth', 'Ganesh Chaturthi', 'Janmashtami',
    'Onam', 'Pongal / Makar Sankranti', 'Baisakhi', 'Gudi Padwa', 'Ugadi',
    'Chhath Puja', 'Guru Purnima', 'Maha Shivratri', 'Christmas',
    'New Year', 'Bhai Dooj',
  ],
  seasonal: [
    'Summer sale', 'End-of-season sale', 'Mid-year sale',
    'Pre-Diwali sale', 'Black Friday', 'Year-end sale',
    'Big Billion Days', 'Great Indian Festival', 'Back to school',
    'Wedding season', 'Monsoon offers',
  ],
  product: [
    'New launch', 'Limited edition drop', 'Restock alert',
    'Bundle / combo offer', 'Pre-launch waitlist', 'Early bird offer',
    'Flash sale', 'Clearance sale',
  ],
  brand: [
    'Brand story / origin', 'Customer testimonial', 'Milestone announcement',
    'User-generated content', 'Behind the scenes', 'Team introduction',
    'Brand anniversary', 'Community post',
  ],
};

export const OCCASION_TYPES = [
  { id: 'festival', label: 'Festival' },
  { id: 'seasonal', label: 'Seasonal' },
  { id: 'product', label: 'Product Launch' },
  { id: 'brand', label: 'Brand Awareness' },
  { id: 'custom', label: 'Custom' },
] as const;
