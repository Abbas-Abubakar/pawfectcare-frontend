import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthRecordApi } from '@/api/healthRecord.api';
import type { HealthRecordFormValues } from '@/types/healthRecord';

export const HEALTH_RECORDS_QUERY_KEY = (petId: string) => ['health-records', petId] as const;

export const useHealthRecords = (petId: string) => {
  return useQuery({
    queryKey: HEALTH_RECORDS_QUERY_KEY(petId),
    queryFn: () => healthRecordApi.getByPet(petId),
    enabled: !!petId,
  });
};

export const useCreateHealthRecord = (petId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: HealthRecordFormValues) => healthRecordApi.create(petId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HEALTH_RECORDS_QUERY_KEY(petId) });
    },
  });
};