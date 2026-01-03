import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ticket, Agent, ApiResponse, ServiceType } from '../models/ticket.model';

// Service to handle all functionalities 
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Call next ticket
  callNextTicket(serviceType?: ServiceType): Observable<ApiResponse<Ticket>> {
    return this.http.post<ApiResponse<Ticket>>(`${this.apiUrl}/next`, { serviceType });
  }

  // Start serving current ticket
  startServing(): Observable<ApiResponse<Ticket>> {
    return this.http.post<ApiResponse<Ticket>>(`${this.apiUrl}/serve`, {});
  }

  // Complete current ticket
  completeTicket(notes?: string): Observable<ApiResponse<Ticket>> {
    return this.http.post<ApiResponse<Ticket>>(`${this.apiUrl}/complete`, { notes });
  }

  // Mark ticket as no-show
  markNoShow(): Observable<ApiResponse<Ticket>> {
    return this.http.post<ApiResponse<Ticket>>(`${this.apiUrl}/no-show`, {});
  }

  // Get all agents (admin/supervisor only)
  getAgents(): Observable<ApiResponse<Agent[]>> {
    return this.http.get<ApiResponse<Agent[]>>(`${this.apiUrl}/agents`);
  }
}

