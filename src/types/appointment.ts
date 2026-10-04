export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Vet {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profilePhoto?: { url: string; publicId: string };
}

export interface VetsResponse {
  success: boolean;
  count: number;
  vets: Vet[];
}

export interface AvailabilitySlot {
  _id: string;
  vet: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface AvailabilityResponse {
  success: boolean;
  count: number;
  slots: AvailabilitySlot[];
}

export interface Appointment {
  _id: string;
  pet: { _id: string; name: string; species: string; photo?: { url: string } };
  owner: string;
  vet: { _id: string; name: string; email: string };
  availability: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: AppointmentStatus;
  cancelReason?: string;
  createdAt: string;
}

export interface AppointmentsResponse {
  success: boolean;
  count: number;
  appointments: Appointment[];
}

export interface AppointmentResponse {
  success: boolean;
  message: string;
  appointment: Appointment;
}