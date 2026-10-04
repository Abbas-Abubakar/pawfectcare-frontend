import { Link } from 'react-router-dom';
import { usePets } from '@/hooks/usePets';
import { PetCard } from '@/components/PetCard';

export const PetsList = () => {
  const { data, isLoading, isError } = usePets();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-display text-xl text-ink/40">Fetching your furry friends...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <p className="text-4xl">😿</p>
        <p className="text-ink/60">Something went wrong loading your pets. Try refreshing.</p>
      </div>
    );
  }

  const pets = data?.pets ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">My Pets</h1>
          <p className="mt-1 text-ink/60">Everyone you're taking care of, in one place.</p>
        </div>
        <Link to="/owner/pets/new" className="btn-primary">
          + Add a pet
        </Link>
      </div>

      {pets.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-6xl">🐕</p>
          <h2 className="font-display text-2xl font-bold text-ink">No pets yet</h2>
          <p className="max-w-sm text-ink/60">
            Add your first pet to start tracking their health, booking vet visits, and more.
          </p>
          <Link to="/owner/pets/new" className="btn-primary mt-2">
            Add your first pet
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
};