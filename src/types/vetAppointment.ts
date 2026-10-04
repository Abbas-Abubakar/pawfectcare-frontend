import type { AppointmentStatus } from './appointment';

export interface VetAppointment {
  _id: string;
  pet: { _id: string; name: string; species: string; breed?: string; photo?: { url: string } };
  owner: { _id: string; name: string; email: string; phone?: string };
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: AppointmentStatus;
  cancelReason?: string;
}

export interface VetAppointmentsResponse {
  success: boolean;
  count: number;
  appointments: VetAppointment[];
}

export interface AssignedPet {
  _id: string;
  name: string;
  species: string;
  breed?: string;
  gender: string;
  photo?: { url: string };
  owner: { _id: string; name: string; email: string; phone?: string };
}

export interface AssignedPetsResponse {
  success: boolean;
  count: number;
  pets: AssignedPet[];
}