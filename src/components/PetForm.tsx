import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCreatePet, useUpdatePet } from '@/hooks/usePets';
import type { Pet, PetFormValues, PetGender } from '@/types/pet';

interface PetFormProps {
  existingPet?: Pet; // presence of this prop determines create vs edit mode
}

const toFormValues = (pet?: Pet): PetFormValues => ({
  name: pet?.name ?? '',
  species: pet?.species ?? '',
  breed: pet?.breed ?? '',
  gender: pet?.gender ?? 'unknown',
  dateOfBirth: pet?.dateOfBirth ? pet.dateOfBirth.slice(0, 10) : '', // trim to YYYY-MM-DD for <input type="date">
  weight: pet?.weight?.toString() ?? '',
  color: pet?.color ?? '',
  notes: pet?.notes ?? '',
});

export const PetForm = ({ existingPet }: PetFormProps) => {
  const navigate = useNavigate();
  const isEditMode = !!existingPet;

  const [values, setValues] = useState<PetFormValues>(toFormValues(existingPet));
  const [photoPreview, setPhotoPreview] = useState<string | null>(existingPet?.photo?.url ?? null);
  const [error, setError] = useState('');

  const createMutation = useCreatePet();
  const updateMutation = useUpdatePet(existingPet?._id ?? '');
  const mutation = isEditMode ? updateMutation : createMutation;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValues({ ...values, photo: file });
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!values.name.trim() || !values.species.trim()) {
      setError('Name and species are required.');
      return;
    }

    mutation.mutate(values, {
      onSuccess: (data) => {
        navigate(`/owner/pets/${data.pet._id}`);
      },
      onError: (err) => {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } else {
          setError('Something went wrong. Please try again.');
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Photo upload */}
      <div className="flex items-center gap-5">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-4xl bg-peach">
          {photoPreview ? (
            <img src={photoPreview} alt="Pet preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">🐾</div>
          )}
        </div>
        <div>
          <label htmlFor="photo" className="btn-secondary cursor-pointer">
            {photoPreview ? 'Change photo' : 'Upload photo'}
          </label>
          <input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <p className="mt-2 text-xs text-ink/50">JPEG, PNG or WEBP. Max 5MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            className="input-field"
            placeholder="Max"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="species" className="form-label">
            Species
          </label>
          <input
            id="species"
            type="text"
            required
            className="input-field"
            placeholder="Dog, Cat, Bird..."
            value={values.species}
            onChange={(e) => setValues({ ...values, species: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="breed" className="form-label">
            Breed <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <input
            id="breed"
            type="text"
            className="input-field"
            placeholder="Labrador Retriever"
            value={values.breed}
            onChange={(e) => setValues({ ...values, breed: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="gender" className="form-label">
            Gender
          </label>
          <select
            id="gender"
            className="input-field"
            value={values.gender}
            onChange={(e) => setValues({ ...values, gender: e.target.value as PetGender })}
          >
            <option value="unknown">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="form-label">
            Date of birth <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <input
            id="dateOfBirth"
            type="date"
            className="input-field"
            value={values.dateOfBirth}
            onChange={(e) => setValues({ ...values, dateOfBirth: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="weight" className="form-label">
            Weight (kg) <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <input
            id="weight"
            type="number"
            min="0"
            step="0.1"
            className="input-field"
            placeholder="28.5"
            value={values.weight}
            onChange={(e) => setValues({ ...values, weight: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="color" className="form-label">
            Color <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <input
            id="color"
            type="text"
            className="input-field"
            placeholder="Golden"
            value={values.color}
            onChange={(e) => setValues({ ...values, color: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="form-label">
          Notes <span className="font-normal text-ink/40">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          className="input-field resize-none"
          placeholder="Anything else worth knowing — personality, quirks, preferences..."
          value={values.notes}
          onChange={(e) => setValues({ ...values, notes: e.target.value })}
        />
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={mutation.isPending} className="btn-primary">
          {mutation.isPending
            ? isEditMode
              ? 'Saving...'
              : 'Adding...'
            : isEditMode
              ? 'Save changes'
              : 'Add pet'}
        </button>
        <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};