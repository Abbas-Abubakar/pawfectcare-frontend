export type UserRole = 'pet_owner' | 'veterinarian' | 'shelter_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profilePhoto?: { url: string; publicId: string };
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}