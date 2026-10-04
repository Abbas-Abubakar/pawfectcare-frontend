import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useUpdateProfile, useChangePassword } from '@/hooks/useProfile';

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.profilePhoto?.url ?? null);
  const [photoFile, setPhotoFile] = useState<File | undefined>();
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!user) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);

    updateProfile.mutate(
      { name, phone, photo: photoFile },
      {
        onSuccess: () => setProfileSuccess(true),
        onError: (err) => {
          setProfileError(
            axios.isAxiosError(err) ? err.response?.data?.message || 'Could not update profile.' : 'Could not update profile.'
          );
        },
      }
    );
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setPasswordSuccess(true);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
        onError: (err) => {
          setPasswordError(
            axios.isAxiosError(err) ? err.response?.data?.message || 'Could not change password.' : 'Could not change password.'
          );
        },
      }
    );
  };

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-ink">Profile</h1>
        <p className="mt-1 text-ink/60">Manage your account details.</p>
      </div>

      {/* Profile info form */}
      <form onSubmit={handleProfileSubmit} className="space-y-5">
        <h2 className="font-display text-xl font-bold text-ink">Your details</h2>

        <div className="flex items-center gap-5">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-sunshine">
            {photoPreview ? (
              <img src={photoPreview} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-ink">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="photo" className="btn-secondary cursor-pointer">
              Change photo
            </label>
            <input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <label htmlFor="name" className="form-label">
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input id="email" type="email" disabled className="input-field bg-cream text-ink/50" value={user.email} />
          <p className="mt-1 text-xs text-ink/40">Email can't be changed here.</p>
        </div>

        <div>
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {profileError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{profileError}</p>}
        {profileSuccess && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">Profile updated!</p>
        )}

        <button type="submit" disabled={updateProfile.isPending} className="btn-primary">
          {updateProfile.isPending ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      {/* Change password form */}
      <form onSubmit={handlePasswordSubmit} className="space-y-5 border-t border-ink/10 pt-8">
        <h2 className="font-display text-xl font-bold text-ink">Change password</h2>

        <div>
          <label htmlFor="currentPassword" className="form-label">
            Current password
          </label>
          <input
            id="currentPassword"
            type="password"
            required
            className="input-field"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="form-label">
            New password
          </label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={8}
            className="input-field"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {passwordError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{passwordError}</p>}
        {passwordSuccess && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">Password changed!</p>
        )}

        <button type="submit" disabled={changePassword.isPending} className="btn-primary">
          {changePassword.isPending ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
};