import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePets } from '@/hooks/usePets';
import { useVets, useOpenSlots, useBookAppointment } from '@/hooks/useAppointments';
import { VetPickerCard } from '@/components/VetPickerCard';
import { SlotPicker } from '@/components/SlotPicker';
import type { AvailabilitySlot } from '@/types/appointment';

type Step = 'vet' | 'slot' | 'details';

export const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedPetId = searchParams.get('petId') ?? '';

  const [step, setStep] = useState<Step>('vet');
  const [selectedPetId, setSelectedPetId] = useState(preselectedPetId);
  const [selectedVetId, setSelectedVetId] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const { data: petsData } = usePets();
  const { data: vetsData, isLoading: vetsLoading } = useVets();
  const { data: slotsData, isLoading: slotsLoading } = useOpenSlots(selectedVetId);
  const bookMutation = useBookAppointment();

  const pets = petsData?.pets ?? [];
  const vets = vetsData?.vets ?? [];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedPetId || !selectedSlot || !reason.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    bookMutation.mutate(
      { petId: selectedPetId, availabilityId: selectedSlot._id, reason },
      {
        onSuccess: () => navigate('/owner/appointments'),
        onError: (err) => {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'Could not book this appointment.');
          } else {
            setError('Could not book this appointment.');
          }
        },
      }
    );
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-ink">Book an appointment</h1>

      {/* Step indicator */}
      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-ink/40">
        <span className={step === 'vet' ? 'text-coral' : ''}>1. Choose a vet</span>
        <span>→</span>
        <span className={step === 'slot' ? 'text-coral' : ''}>2. Pick a time</span>
        <span>→</span>
        <span className={step === 'details' ? 'text-coral' : ''}>3. Confirm</span>
      </div>

      <div className="mt-8">
        {step === 'vet' && (
          <div>
            {vetsLoading ? (
              <p className="text-ink/50">Loading veterinarians...</p>
            ) : (
              <div className="space-y-3">
                {vets.map((vet) => (
                  <VetPickerCard
                    key={vet._id}
                    vet={vet}
                    isSelected={selectedVetId === vet._id}
                    onSelect={() => setSelectedVetId(vet._id)}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              disabled={!selectedVetId}
              onClick={() => setStep('slot')}
              className="btn-primary mt-6"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'slot' && (
          <div>
            {slotsLoading ? (
              <p className="text-ink/50">Loading available times...</p>
            ) : (
              <SlotPicker
                slots={slotsData?.slots ?? []}
                selectedSlotId={selectedSlot?._id ?? null}
                onSelect={setSelectedSlot}
              />
            )}

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setStep('vet')} className="btn-secondary">
                Back
              </button>
              <button
                type="button"
                disabled={!selectedSlot}
                onClick={() => setStep('details')}
                className="btn-primary"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={handleBook} className="space-y-5">
            <div>
              <label htmlFor="pet" className="form-label">
                Which pet is this for?
              </label>
              <select
                id="pet"
                required
                className="input-field"
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
              >
                <option value="">Select a pet</option>
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reason" className="form-label">
                Reason for visit
              </label>
              <textarea
                id="reason"
                required
                rows={3}
                className="input-field resize-none"
                placeholder="Annual checkup, limping on back leg, etc."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {selectedSlot && (
              <div className="rounded-2xl bg-cream p-4 text-sm text-ink/70">
                <p className="font-semibold text-ink">Appointment summary</p>
                <p className="mt-1">
                  {new Date(selectedSlot.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  at {selectedSlot.startTime}
                </p>
              </div>
            )}

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep('slot')} className="btn-secondary">
                Back
              </button>
              <button type="submit" disabled={bookMutation.isPending} className="btn-primary">
                {bookMutation.isPending ? 'Booking...' : 'Confirm booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};