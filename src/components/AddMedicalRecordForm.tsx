import { useState } from 'react';
import axios from 'axios';
import { useCreateMedicalRecord } from '@/hooks/useMedicalRecords';

interface AddMedicalRecordFormProps {
  appointmentId: string;
  petId: string;
  onSuccess: () => void;
}

export const AddMedicalRecordForm = ({ appointmentId, petId, onSuccess }: AddMedicalRecordFormProps) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');

  const mutation = useCreateMedicalRecord(appointmentId, petId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!diagnosis.trim()) {
      setError('Diagnosis is required.');
      return;
    }

    mutation.mutate(
      { diagnosis, prescription, notes, attachments: files },
      {
        onSuccess: () => onSuccess(),
        onError: (err) => {
          setError(
            axios.isAxiosError(err) ? err.response?.data?.message || 'Could not save record.' : 'Could not save record.'
          );
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="diagnosis" className="form-label">
          Diagnosis
        </label>
        <textarea
          id="diagnosis"
          required
          rows={2}
          className="input-field resize-none"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="prescription" className="form-label">
          Prescription <span className="font-normal text-ink/40">(optional)</span>
        </label>
        <textarea
          id="prescription"
          rows={2}
          className="input-field resize-none"
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="notes" className="form-label">
          Notes <span className="font-normal text-ink/40">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={2}
          className="input-field resize-none"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="attachments" className="form-label">
          Attachments <span className="font-normal text-ink/40">(X-rays, lab results — up to 5)</span>
        </label>
        <input
          id="attachments"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 5))}
          className="input-field"
        />
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
        {mutation.isPending ? 'Saving...' : 'Save medical record'}
      </button>
    </form>
  );
};