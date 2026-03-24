import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApplicationDto, CreateApplicationDto } from '../models/application.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = `${environment.apiUrl}/application`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApplicationDto[]> {
    return this.http.get<ApplicationDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<ApplicationDto> {
    return this.http.get<ApplicationDto>(`${this.apiUrl}/${id}`);
  }
  
  getByCandidateId(candidateId: string): Observable<ApplicationDto[]> {
    return this.http.get<ApplicationDto[]>(`${this.apiUrl}/candidate/${candidateId}`);
  }

  getByJobId(jobId: string): Observable<ApplicationDto[]> {
    return this.http.get<ApplicationDto[]>(`${this.apiUrl}/job/${jobId}`);
  }

  create(candidateId: string, dto: CreateApplicationDto): Observable<ApplicationDto> {
    return this.http.post<ApplicationDto>(`${this.apiUrl}/${candidateId}`, dto);
  }

  updateStatus(id: string, newStatus: string): Observable<ApplicationDto> {
    return this.http.patch<ApplicationDto>(`${this.apiUrl}/${id}/status`, { status: newStatus });
  }

  reAnalyze(id: string): Observable<ApplicationDto> {
    return this.http.post<ApplicationDto>(`${this.apiUrl}/${id}/analyze`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
