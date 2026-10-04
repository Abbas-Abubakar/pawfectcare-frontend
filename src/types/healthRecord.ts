export type HealthRecordType = 'vaccination' | 'deworming' | 'allergy' | 'checkup' | 'other';
export type Severity = 'mild' | 'moderate' | 'severe';

export interface HealthRecord {
  _id: string;
  pet: string;
  addedBy: { _id: string; name: string; role: string };
  type: HealthRecordType;
  title: string;
  description?: string;
  dateAdministered?: string;
  nextDueDate?: string;
  severity?: Severity;
  isActive: boolean;
  createdAt: string;
}

export interface HealthRecordsResponse {
  success: boolean;
  count: number;
  records: HealthRecord[];
}

export interface HealthRecordFormValues {
  type: HealthRecordType;
  title: string;
  description: string;
  dateAdministered: string;
  nextDueDate: string;
  severity: Severity | '';
}