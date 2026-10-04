import type { Vet } from '@/types/appointment';

interface VetPickerCardProps {
  vet: Vet;
  isSelected: boolean;
  onSelect: () => void;
}

export const VetPickerCard = ({ vet, isSelected, onSelect }: VetPickerCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center gap-4 rounded-3xl border-2 p-4 text-left transition-all ${
        isSelected ? 'border-coral bg-coral-light' : 'border-ink/10 bg-white hover:border-ink/20'
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sunshine font-display text-lg font-bold text-ink">
        {vet.profilePhoto?.url ? (
          <img src={vet.profilePhoto.url} alt={vet.name} className="h-full w-full object-cover" />
        ) : (
          vet.name.charAt(0).toUpperCase()
        )}
      </div>
      <div>
        <p className="font-semibold text-ink">Dr. {vet.name}</p>
        <p className="text-sm text-ink/50">{vet.email}</p>
      </div>
    </button>
  );
};