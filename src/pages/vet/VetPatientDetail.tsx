import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePet } from '@/hooks/usePets';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { usePetMedicalHistory } from '@/hooks/useMedicalRecords';
import { Tabs } from '@/components/Tabs';
import { Modal } from '@/components/Modal';
import { HealthRecordCard } from '@/components/HealthRecordCard';
import { MedicalRecordCard } from '@/components/MedicalRecordCard';
import { AddHealthRecordForm } from '@/components/AddHealthRecordForm';
import type { HealthRecord } from '@/types/healthRecord';

export const VetPatientDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);

  const { data: petData, isLoading: petLoading } = usePet(id!);
  const { data: recordsData } = useHealthRecords(id!);
  const { data: historyData } = usePetMedicalHistory(id!);

  const openAddModal = () => {
    setEditingRecord(null);
    setIsRecordModalOpen(true);
  };

  const openEditModal = (record: HealthRecord) => {
    setEditingRecord(record);
    setIsRecordModalOpen(true);
  };

  const closeModal = () => {
    setIsRecordModalOpen(false);
    setEditingRecord(null);
  };

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
      <div className="flex items-center gap-5">
        <div className="h-20 w-20 overflow-hidden rounded-4xl bg-peach">
          {pet.photo?.url ? (
            <img src={pet.photo.url} alt={pet.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl">🐾</div>
          )}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{pet.name}</h1>
          <p className="text-ink/60 capitalize">
            {pet.breed || pet.species} · {pet.gender}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultTab="health">
          <Tabs.List>
            <Tabs.Tab id="health">Health Records</Tabs.Tab>
            <Tabs.Tab id="medical">Medical History</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel id="health">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink">
                {recordsData?.count ?? 0} {recordsData?.count === 1 ? 'record' : 'records'}
              </h3>
              <button onClick={openAddModal} className="btn-secondary text-sm">
                + Add record
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {recordsData && recordsData.records.length > 0 ? (
                recordsData.records.map((record) => (
                  <HealthRecordCard key={record._id} record={record} petId={pet._id} onEdit={openEditModal} />
                ))
              ) : (
                <p className="text-ink/50">No health records logged yet.</p>
              )}
            </div>
          </Tabs.Panel>

          <Tabs.Panel id="medical">
            <div className="space-y-3">
              {historyData && historyData.records.length > 0 ? (
                historyData.records.map((record) => <MedicalRecordCard key={record._id} record={record} />)
              ) : (
                <p className="text-ink/50">No medical history yet.</p>
              )}
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>

      <Modal
        isOpen={isRecordModalOpen}
        onClose={closeModal}
        title={editingRecord ? 'Edit health record' : 'Add health record'}
      >
        <AddHealthRecordForm
          key={editingRecord?._id ?? 'new'}
          petId={pet._id}
          existingRecord={editingRecord ?? undefined}
          onSuccess={closeModal}
        />
      </Modal>
    </div>
  );
};