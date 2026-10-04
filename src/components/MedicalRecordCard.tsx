import type { MedicalRecord } from '@/types/medicalRecord';

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export const MedicalRecordCard = ({ record }: { record: MedicalRecord }) => {
  return (
    <div className="rounded-3xl border-2 border-ink/5 p-5">
      <p className="text-xs text-ink/50">
        {formatDate(record.createdAt)} · Dr. {record.vet.name}
      </p>
      <h4 className="mt-2 font-semibold text-ink">{record.diagnosis}</h4>
      {record.prescription && (
        <p className="mt-1 text-sm text-ink/70">
          <span className="font-medium">Prescription:</span> {record.prescription}
        </p>
      )}
      {record.notes && <p className="mt-1 text-sm text-ink/70">{record.notes}</p>}
      {record.attachments.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {record.attachments.map((att, i) => (
            <a
              key={att.publicId}
              href={att.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-cream px-3 py-1 text-xs font-medium text-coral hover:bg-coral-light"
            >
              📎 Attachment {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};