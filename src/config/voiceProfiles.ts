export interface VoiceProfile {
  value: string;
  label: string;
  image: string;
  fallbackImage: string;
  role: string;
  company: string;
}

export const voiceProfiles: VoiceProfile[] = [
  {
    value: 'Puck',
    label: 'Puck - Senior Software Engineer',
    image: '/images/woman-4525646_1280.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    role: 'Senior Software Engineer',
    company: 'Google'
  },
  {
    value: 'Charon',
    label: 'Charon - Tech Lead',
    image: '/images/man-7367511_1280.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    role: 'Tech Lead',
    company: 'Microsoft'
  },
  {
    value: 'Kore',
    label: 'Kore - Engineering Manager',
    image: '/images/annegret-krischok-876187_1280.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    role: 'Engineering Manager',
    company: 'Apple'
  },
  {
    value: 'Fenrir',
    label: 'Fenrir - Principal Engineer',
    image: '/images/black-and-white-1282264_1280.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    role: 'Principal Engineer',
    company: 'Meta'
  },
  {
    value: 'Aoede',
    label: 'Aoede - Senior Engineering Manager',
    image: '/images/ad200-7391099_1280.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    role: 'Senior Engineering Manager',
    company: 'Amazon'
  },
  {
    value: 'Leda',
    label: 'Leda - VP of Engineering',
    image: '/images/boy-6334821_1280.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    role: 'VP of Engineering',
    company: 'Netflix'
  },
  {
    value: 'Orus',
    label: 'Orus - CTO',
    image: '/images/man-7367511_1280 (1).jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
    role: 'CTO',
    company: 'Uber'
  },
  {
    value: 'Zephyr',
    label: 'Zephyr - Director of Engineering',
    image: '/images/boy-6334821_1280 copy.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    role: 'Director of Engineering',
    company: 'LinkedIn'
  }
]; 