import type { UserRole } from '@/types';

export interface NavItem {
  label: string;
  path: string;
  icon: string; // emoji for now — simple, on-brand, zero extra dependency
}

export const navigationByRole: Record<UserRole, NavItem[]> = {
  pet_owner: [
    { label: 'My Pets', path: '.', icon: '🐾' },
    { label: 'Appointments', path: '/owner/appointments', icon: '📅' },
    { label: 'Pet Store', path: '/owner/store', icon: '🛒' },
    { label: 'Blog & Tips', path: '/owner/blog', icon: '📝' },
    { label: 'Notifications', path: '/owner/notifications', icon: '🔔' },
    { label: 'Profile', path: '/owner/profile', icon: '👤' },
  ],
  veterinarian: [
    { label: "Today's Appointments", path: '/vet/dashboard', icon: '📅' },
    { label: 'My Patients', path: '/vet/patients', icon: '🐾' },
    { label: 'Notifications', path: '/vet/notifications', icon: '🔔' },
    { label: 'Profile', path: '/vet/profile', icon: '👤' },
  ],
  shelter_admin: [
    { label: 'Adoption Listings', path: '/shelter/listings', icon: '🏠' },
    { label: 'Requests', path: '/shelter/requests', icon: '📋' },
    { label: 'Success Stories', path: '/shelter/stories', icon: '🎉' },
    { label: 'Messages', path: '/shelter/messages', icon: '✉️' },
    { label: 'Notifications', path: '/shelter/notifications', icon: '🔔' },
    { label: 'Profile', path: '/shelter/profile', icon: '👤' },
  ],
};