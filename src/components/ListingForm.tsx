import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCreateListing, useUpdateListing, useRemoveListingPhoto } from '@/hooks/useAdoptionListings';
import type { AdoptionListing, AdoptionListingFormValues } from '@/types/adoption';

interface ListingFormProps {
  existingListing?: AdoptionListing;
}

const toFormValues = (listing?: AdoptionListing): Omit<AdoptionListingFormValues, 'photos'> => ({
  name: listing?.name ?? '',
  species: listing?.species ?? '',
  breed: listing?.breed ?? '',
  age: listing?.age ?? '',
  gender: listing?.gender ?? 'unknown',
  description: listing?.description ?? '',
  temperament: listing?.temperament ?? '',
});

export const ListingForm = ({ existingListing }: ListingFormProps) => {
  const navigate = useNavigate();
  const isEditMode = !!existingListing;

  const [values, setValues] = useState(toFormValues(existingListing));
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [error, setError] = useState('');

  const createMutation = useCreateListing();
  const updateMutation = useUpdateListing(existingListing?._id ?? '');
  const removePhotoMutation = useRemoveListingPhoto(existingListing?._id ?? '');
  const mutation = isEditMode ? updateMutation : createMutation;

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 6);
    setNewPhotos(files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!values.name.trim() || !values.species.trim()) {
      setError('Name and species are required.');
      return;
    }

    mutation.mutate(
      { ...values, photos: newPhotos },
      {
        onSuccess: (data) => navigate(`/shelter/listings/${data.listing._id}`),
        onError: (err) => {
          setError(
            axios.isAxiosError(err) ? err.response?.data?.message || 'Something went wrong.' : 'Something went wrong.'
          );
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {isEditMode && existingListing.photos.length > 0 && (
        <div>
          <span className="form-label">Current photos</span>
          <div className="flex flex-wrap gap-3">
            {existingListing.photos.map((photo) => (
              <div key={photo._id} className="group relative h-24 w-24 overflow-hidden rounded-2xl bg-peach">
                <img src={photo.url} alt={existingListing.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => photo._id && removePhotoMutation.mutate(photo._id)}
                  className="absolute inset-0 flex items-center justify-center bg-ink/0 text-transparent transition-all group-hover:bg-ink/40 group-hover:text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="photos" className="form-label">
          {isEditMode ? 'Add more photos' : 'Photos'} <span className="font-normal text-ink/40">(up to 6)</span>
        </label>
        <input
          id="photos"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotosChange}
          className="input-field"
        />
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
            placeholder="Dog, Cat..."
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
            value={values.breed}
            onChange={(e) => setValues({ ...values, breed: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="age" className="form-label">
            Age <span className="font-normal text-ink/40">(e.g. "2 years")</span>
          </label>
          <input
            id="age"
            type="text"
            className="input-field"
            value={values.age}
            onChange={(e) => setValues({ ...values, age: e.target.value })}
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
            onChange={(e) => setValues({ ...values, gender: e.target.value as typeof values.gender })}
          >
            <option value="unknown">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="temperament" className="form-label">
          Temperament <span className="font-normal text-ink/40">(optional)</span>
        </label>
        <input
          id="temperament"
          type="text"
          className="input-field"
          placeholder="Friendly, good with kids, house-trained..."
          value={values.temperament}
          onChange={(e) => setValues({ ...values, temperament: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="description" className="form-label">
          Description <span className="font-normal text-ink/40">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={4}
          className="input-field resize-none"
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
        />
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={mutation.isPending} className="btn-primary">
          {mutation.isPending ? 'Saving...' : isEditMode ? 'Save changes' : 'Create listing'}
        </button>
        <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};