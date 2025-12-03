export type TicketStatus = 'waiting' | 'called' | 'serving' | 'completed' | 'cancelled' | 'no-show';
export type ServiceType = 'account' | 'loan' | 'general' | 'registration' | 'consultation' | 'payment';

export interface Ticket {
  _id: string;
  ticketNumber: string;
  serviceType: ServiceType;
  status: TicketStatus;
  priority: number;
  customerName?: string;
  customerPhone?: string;
  counterNumber?: number;
  servedBy?: Agent;
  createdAt: string;
  calledAt?: string;
  servedAt?: string;
  completedAt?: string;
  estimatedWaitTime: number;
  notes?: string;
  queuePosition?: number;
  waitDuration?: number;
  serviceDuration?: number;
}

export interface Agent {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  role: 'agent' | 'admin' | 'supervisor';
  counterNumber?: number;
  services: ServiceType[];
  isActive: boolean;
  isOnline: boolean;
  currentTicket?: Ticket;
  ticketsServedToday: number;
  averageServiceTime: number;
}

export interface CreateTicketRequest {
  serviceType: ServiceType;
  customerName?: string;
  customerPhone?: string;
  priority?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

export const SERVICE_TYPES: { value: ServiceType; label: string; icon: string }[] = [
  { value: 'general', label: 'Services Généraux', icon: 'help_outline' },
  { value: 'account', label: 'Gestion de Compte', icon: 'account_balance' },
  { value: 'loan', label: 'Crédit / Prêt', icon: 'payments' },
  { value: 'registration', label: 'Inscription', icon: 'how_to_reg' },
  { value: 'consultation', label: 'Consultation', icon: 'chat' },
  { value: 'payment', label: 'Paiement', icon: 'credit_card' }
];

export const STATUS_LABELS: Record<TicketStatus, { label: string; class: string }> = {
  waiting: { label: 'En attente', class: 'badge-waiting' },
  called: { label: 'Appelé', class: 'badge-called' },
  serving: { label: 'En cours', class: 'badge-serving' },
  completed: { label: 'Terminé', class: 'badge-completed' },
  cancelled: { label: 'Annulé', class: 'badge-cancelled' },
  'no-show': { label: 'Absent', class: 'badge-no-show' }
};

