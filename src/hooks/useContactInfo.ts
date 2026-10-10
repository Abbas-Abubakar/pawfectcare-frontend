import { useQuery } from '@tanstack/react-query';
import { contactInfoApi } from '@/api/contactInfo.api';

export const useContactInfo = () => {
  return useQuery({
    queryKey: ['contact-info'],
    queryFn: contactInfoApi.get,
    staleTime: Infinity, // this is static env-configured data, never changes during a session
  });
};