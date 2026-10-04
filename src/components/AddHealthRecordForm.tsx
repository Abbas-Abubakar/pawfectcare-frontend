import { useState } from 'react';
import axios from 'axios';
import { useCreateHealthRecord } from '@/hooks/useHealthRecords';
import type { HealthRecordFormValues, HealthRecordType, Severity } from '@/types/healthRecord';

const EMPTY_VALUES: HealthRecordFormValues = {
  type: 'vaccination',
  title: '',
  description: '',
  dateAdministered: '',
  nextDueDate: '',
  severity: '',
};

export const AddHealthRecordForm = ({ petId, onSuccess }: { petId: string; onSuccess: () => void }) => {
  const [values, setValues] = useState<HealthRecordFormValues>(EMPTY_VALUES);
  const [error, setError] = useState('');
  const mutation = useCreateHealthRecord(petId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!values.title.trim()) {
      setError('Title is required.');
      return;
    }

    mutation.mutate(values, {
      onSuccess: () => onSuccess(),
      onError: (err) => {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Something went wrong.');
        } else {
          setError('Something went wrong.');
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="form-label">
          Type
        </label>
        <select
          id="type"
          className="input-field"
          value={values.type}
          onChange={(e) => setValues({ ...values, type: e.target.value as HealthRecordType })}
        >
          <option value="vaccination">Vaccination</option>
          <option value="deworming">Deworming</option>
          <option value="allergy">Allergy</option>
          <option value="checkup">Checkup</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          className="input-field"
          placeholder="Rabies Vaccine"
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
      </div>

      {values.type === 'allergy' && (
        <div>
          <label htmlFor="severity" className="form-label">
            Severity
          </label>
          <select
            id="severity"
            className="input-field"
            value={values.severity}
            onChange={(e) => setValues({ ...values, severity: e.target.value as Severity })}
          >
            <option value="">Select severity</option>
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dateAdministered" className="form-label">
            Date given
          </label>
          <input
            id="dateAdministered"
            type="date"
            className="input-field"
            value={values.dateAdministered}
            onChange={(e) => setValues({ ...values, dateAdministered: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="nextDueDate" className="form-label">
            Next due
          </label>
          <input
            id="nextDueDate"
            type="date"
            className="input-field"
            value={values.nextDueDate}
            onChange={(e) => setValues({ ...values, nextDueDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="form-label">
          Notes <span className="font-normal text-ink/40">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={2}
          className="input-field resize-none"
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
        />
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
        {mutation.isPending ? 'Adding...' : 'Add record'}
      </button>
    </form>
  );
};