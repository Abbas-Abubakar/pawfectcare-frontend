import { Link } from 'react-router-dom';
import { useAssignedPets } from '@/hooks/useVetDashboard';

export const VetPatients = () => {
  const { data, isLoading } = useAssignedPets();
  const pets = data?.pets ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">My Patients</h1>
      <p className="mt-1 text-ink/60">Pets you've seen through appointments.</p>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-ink/50">Loading...</p>
        ) : pets.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <Link
                key={pet._id}
                to={`/vet/patients/${pet._id}`}
                className="flex items-center gap-4 rounded-4xl bg-white p-4 transition-shadow hover:shadow-coral"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-3xl bg-peach">
                  {pet.photo?.url ? (
                    <img src={pet.photo.url} alt={pet.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">🐾</div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-ink">{pet.name}</p>
                  <p className="text-sm text-ink/50">{pet.breed || pet.species}</p>
                  <p className="text-xs text-ink/40">Owner: {pet.owner.name}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center text-ink/50">
            <p className="text-4xl">🐾</p>
            <p className="mt-2">No patients yet — they'll appear here after your first appointment.</p>
          </div>
        )}
      </div>
    </div>
  );
};