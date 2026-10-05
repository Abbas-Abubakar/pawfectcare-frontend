import { useState } from 'react';
import type { HealthRecord } from '@/types/healthRecord';
import { useDeleteHealthRecord } from '@/hooks/useHealthRecords';

const TYPE_LABELS: Record<HealthRecord['type'], { label: string; emoji: string }> = {
  vaccination: { label: 'Vaccination', emoji: '💉' },
  deworming: { label: 'Deworming', emoji: '🪱' },
  allergy: { label: 'Allergy', emoji: '⚠️' },
  checkup: { label: 'Checkup', emoji: '🩺' },
  other: { label: 'Other', emoji: '📋' },
};

const SEVERITY_STYLES: Record<string, string> = {
  mild: 'bg-sunshine/30 text-ink',
  moderate: 'bg-coral-light text-coral-dark',
  severe: 'bg-red-100 text-red-700',
};

const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

interface HealthRecordCardProps {
  record: HealthRecord;
  petId: string;
  onEdit: (record: HealthRecord) => void;
}

export const HealthRecordCard = ({ record, petId, onEdit }: HealthRecordCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteHealthRecord(petId);
  const typeInfo = TYPE_LABELS[record.type];

  return (
    <div className="rounded-3xl border-2 border-ink/5 p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeInfo.emoji}</span>
          <div>
            <h4 className="font-semibold text-ink">{record.title}</h4>
            <p className="text-xs text-ink/50">{typeInfo.label}</p>
          </div>
        </div>
        {record.severity && (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${SEVERITY_STYLES[record.severity]}`}>
            {record.severity}
          </span>
        )}
      </div>

      {record.description && <p className="mt-3 text-sm text-ink/70">{record.description}</p>}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
        {record.dateAdministered && <span>Given: {formatDate(record.dateAdministered)}</span>}
        {record.nextDueDate && <span>Next due: {formatDate(record.nextDueDate)}</span>}
        <span>Added by {record.addedBy.name}</span>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <button onClick={() => onEdit(record)} className="text-xs font-semibold text-coral hover:text-coral-dark">
          Edit
        </button>
        {showDeleteConfirm ? (
          <span className="flex items-center gap-2 text-xs">
            <span className="text-ink/60">Delete this record?</span>
            <button
              onClick={() => deleteMutation.mutate(record._id)}
              disabled={deleteMutation.isPending}
              className="font-semibold text-red-600"
            >
              Yes
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="font-semibold text-ink/50">
              No
            </button>
          </span>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs font-semibold text-ink/40 hover:text-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};