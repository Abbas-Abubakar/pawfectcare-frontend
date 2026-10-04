import type { UserRole } from '../types';

export const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'pet_owner':
      return '/owner';
    case 'veterinarian':
      return '/vet/dashboard';
    case 'shelter_admin':
      return '/shelter/dashboard';
    default:
      return '/';
  }
};