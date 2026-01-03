import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QueueStats, QueueStatus } from '../models/stats.model';
import { Agent, ApiResponse } from '../models/ticket.model';

// Service to handle statistics and reporting

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) {}

  // Get overall statistics (protected)
  getStats(): Observable<ApiResponse<QueueStats>> {
    return this.http.get<ApiResponse<QueueStats>>(this.apiUrl);
  }

  // Get queue status (public - for display)
  getQueueStatus(): Observable<ApiResponse<QueueStatus>> {
    return this.http.get<ApiResponse<QueueStatus>>(`${this.apiUrl}/queue`);
  }

  // Get agent performance stats (admin/supervisor only)
  getAgentStats(): Observable<ApiResponse<Agent[]>> {
    return this.http.get<ApiResponse<Agent[]>>(`${this.apiUrl}/agents`);
  }
}

