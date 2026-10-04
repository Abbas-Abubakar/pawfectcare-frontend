import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicalRecordApi } from '@/api/medicalRecord.api';
import { VET_TODAY_QUERY_KEY } from './useVetDashboard';

export const PET_MEDICAL_HISTORY_QUERY_KEY = (petId: string) => ['medical-history', petId] as const;

export const usePetMedicalHistory = (petId: string) => {
  return useQuery({
    queryKey: PET_MEDICAL_HISTORY_QUERY_KEY(petId),
    queryFn: () => medicalRecordApi.getPetHistory(petId),
    enabled: !!petId,
  });
};

export const useCreateMedicalRecord = (appointmentId: string, petId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: { diagnosis: string; prescription?: string; notes?: string; attachments?: File[] }) =>
      medicalRecordApi.create(appointmentId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PET_MEDICAL_HISTORY_QUERY_KEY(petId) });
      queryClient.invalidateQueries({ queryKey: VET_TODAY_QUERY_KEY });
    },
  });
};