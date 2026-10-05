import { useParams } from 'react-router-dom';
import { useListing } from '@/hooks/useAdoptionListings';
import { ListingForm } from '@/components/ListingForm';

export const AddEditListing = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { data, isLoading } = useListing(isEditMode ? id! : '');

  if (isEditMode && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-display text-xl text-ink/40">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">{isEditMode ? 'Edit listing' : 'New adoption listing'}</h1>
      <p className="mt-1 text-ink/60">
        {isEditMode ? "Update this pet's listing details." : 'Add a new pet looking for a home.'}
      </p>
      <div className="mt-8">
        <ListingForm existingListing={data?.listing} />
      </div>
    </div>
  );
};