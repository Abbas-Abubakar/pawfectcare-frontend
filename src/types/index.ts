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


export type UpdateProfilePayload = Partial<Pick<User, 'name' | 'phone'>> & {
  photo?: File;
};

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}