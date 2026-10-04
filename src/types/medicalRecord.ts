export interface MedicalRecordAttachment {
  url: string;
  publicId: string;
  fileType?: string;
}

export interface MedicalRecord {
  _id: string;
  appointment: string;
  pet: string;
  vet: { _id: string; name: string };
  diagnosis: string;
  prescription?: string;
  notes?: string;
  attachments: MedicalRecordAttachment[];
  createdAt: string;
}

export interface MedicalRecordResponse {
  success: boolean;
  message: string;
  record: MedicalRecord;
}

export interface MedicalHistoryResponse {
  success: boolean;
  count: number;
  records: MedicalRecord[];
}

export interface MedicalRecordFormValues {
  diagnosis: string;
  prescription: string;
  notes: string;
  attachments: File[];
}