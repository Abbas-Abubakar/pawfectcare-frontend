import type { UserRole } from '@/types';

export const SHOW_DEMO_ACCOUNTS = import.meta.env.VITE_SHOW_DEMO_ACCOUNTS === 'true';

interface DemoAccount {
  role: UserRole;
  label: string;
  emoji: string;
  blurb: string;
  email: string;
  password: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'pet_owner',
    label: 'Pet Owner',
    emoji: '🐾',
    blurb: 'Pets, appointments, store, adoption',
    email: 'owner1@pawfectcare.test',
    password: 'Password123',
  },
  {
    role: 'veterinarian',
    label: 'Veterinarian',
    emoji: '🩺',
    blurb: 'Schedule, patients, medical records',
    email: 'vet1@pawfectcare.test',
    password: 'Password123',
  },
  {
    role: 'shelter_admin',
    label: 'Shelter Admin',
    emoji: '🏠',
    blurb: 'Listings, adoption requests, stories',
    email: 'shelter1@pawfectcare.test',
    password: 'Password123',
  },
];