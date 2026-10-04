import { useParams } from 'react-router-dom';
import { usePet } from '@/hooks/usePets';
import { PetForm } from '@/components/PetForm';

export const AddEditPet = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Only fetch an existing pet when we're actually in edit mode
  const { data, isLoading } = usePet(isEditMode ? id! : '');

  if (isEditMode && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-display text-xl text-ink/40">Loading pet details...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">
        {isEditMode ? `Edit ${data?.pet.name ?? 'Pet'}` : 'Add a new pet'}
      </h1>
      <p className="mt-1 text-ink/60">
        {isEditMode
          ? "Update your pet's details below."
          : "Tell us a bit about your new companion."}
      </p>

      <div className="mt-8">
        <PetForm existingPet={data?.pet} />
      </div>
    </div>
  );
};