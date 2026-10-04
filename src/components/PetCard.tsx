import { Link } from 'react-router-dom';
import type { Pet } from '@/types/pet';

const formatAge = (years: number | null): string => {
  if (years === null || years < 0) return 'Age unknown';
  if (years < 1) return 'Under 1 year';
  return `${years} ${years === 1 ? 'year' : 'years'} old`;
};

export const PetCard = ({ pet }: { pet: Pet }) => {
  return (
    <Link
      to={`/owner/pets/${pet._id}`}
      className="group block overflow-hidden rounded-4xl bg-white transition-shadow hover:shadow-coral"
    >
      <div className="aspect-square w-full overflow-hidden bg-peach">
        {pet.photo?.url ? (
          <img
            src={pet.photo.url}
            alt={pet.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">🐾</div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-bold text-ink">{pet.name}</h3>
        <p className="mt-1 text-sm text-ink/60">
          {pet.breed || pet.species} · {formatAge(pet.age)}
        </p>
      </div>
    </Link>
  );
};