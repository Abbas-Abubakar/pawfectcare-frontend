import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petApi } from '@/api/pet.api';
import type { PetFormValues } from '@/types/pet';

export const PETS_QUERY_KEY = ['pets'] as const;
export const PET_QUERY_KEY = (id: string) => ['pets', id] as const;

export const usePets = (page = 1) => {
  return useQuery({
    queryKey: [...PETS_QUERY_KEY, page],
    queryFn: () => petApi.getMyPets(page),
  });
};

export const usePet = (id: string) => {
  return useQuery({
    queryKey: PET_QUERY_KEY(id),
    queryFn: () => petApi.getPetById(id),
    enabled: !!id, // don't fire the request if id isn't available yet
  });
};

export const useCreatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: PetFormValues) => petApi.createPet(values),
    onSuccess: () => {
      // Pets list is now stale — refetch it so the new pet appears
      // without the user needing to manually refresh the page.
      queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEY });
    },
  });
};

export const useUpdatePet = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: PetFormValues) => petApi.updatePet(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PET_QUERY_KEY(id) });
    },
  });
};