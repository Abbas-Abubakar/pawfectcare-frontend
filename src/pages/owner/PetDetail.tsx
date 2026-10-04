import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePet } from '@/hooks/usePets';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { Tabs } from '@/components/Tabs';
import { Modal } from '@/components/Modal';
import { HealthRecordCard } from '@/components/HealthRecordCard';
import { AddHealthRecordForm } from '@/components/AddHealthRecordForm';

const formatAge = (years: number | null): string => {
  if (years === null || years < 0) return 'Age unknown';
  if (years < 1) return 'Under 1 year';
  return `${years} ${years === 1 ? 'year' : 'years'} old`;
};

export const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);

  const { data: petData, isLoading: petLoading } = usePet(id!);
  const { data: recordsData, isLoading: recordsLoading } = useHealthRecords(id!);

  if (petLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-display text-xl text-ink/40">Loading...</p>
      </div>
    );
  }

  const pet = petData?.pet;
  if (!pet) return null;

  return (
    <div className="max-w-3xl">
      <Link to=".." className="text-sm font-semibold text-ink/50 hover:text-ink">
        ← Back to My Pets
      </Link>

      <div className="mt-4 flex items-start gap-6">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-4xl bg-peach">
          {pet.photo?.url ? (
            <img src={pet.photo.url} alt={pet.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">🐾</div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold text-ink">{pet.name}</h1>
          <p className="mt-1 text-ink/60">
            {pet.breed || pet.species} · {formatAge(pet.age)} old
          </p>

          <div className="mt-4 flex gap-3">
            <Link to={`/owner/pets/${pet._id}/edit`} className="btn-secondary">
              Edit profile
            </Link>
            <Link to={`/owner/appointments/new?petId=${pet._id}`} className="btn-primary">
              Book appointment
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultTab="overview">
          <Tabs.List>
            <Tabs.Tab id="overview">Overview</Tabs.Tab>
            <Tabs.Tab id="health">Health Records</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel id="overview">
            <dl className="grid grid-cols-2 gap-5">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">Species</dt>
                <dd className="mt-1 text-ink">{pet.species}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">Gender</dt>
                <dd className="mt-1 capitalize text-ink">{pet.gender}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">Color</dt>
                <dd className="mt-1 text-ink">{pet.color || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">Weight</dt>
                <dd className="mt-1 text-ink">{pet.weight ? `${pet.weight} kg` : '—'}</dd>
              </div>
              {pet.notes && (
                <div className="col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">Notes</dt>
                  <dd className="mt-1 text-ink">{pet.notes}</dd>
                </div>
              )}
            </dl>
          </Tabs.Panel>

          <Tabs.Panel id="health">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink">
                {recordsData?.count ?? 0} {recordsData?.count === 1 ? 'record' : 'records'}
              </h3>
              <button onClick={() => setIsAddRecordOpen(true)} className="btn-secondary text-sm">
                + Add record
              </button>
            </div>

            {recordsLoading ? (
              <p className="mt-6 text-sm text-ink/50">Loading health records...</p>
            ) : recordsData && recordsData.records.length > 0 ? (
              <div className="mt-5 space-y-3">
                {recordsData.records.map((record) => (
                  <HealthRecordCard key={record._id} record={record} />
                ))}
              </div>
            ) : (
              <div className="mt-10 text-center text-ink/50">
                <p className="text-4xl">📋</p>
                <p className="mt-2">No health records yet.</p>
              </div>
            )}
          </Tabs.Panel>
        </Tabs>
      </div>

      <Modal isOpen={isAddRecordOpen} onClose={() => setIsAddRecordOpen(false)} title="Add health record">
        <AddHealthRecordForm petId={pet._id} onSuccess={() => setIsAddRecordOpen(false)} />
      </Modal>
    </div>
  );
};