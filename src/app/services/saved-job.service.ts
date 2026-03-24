import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface SavedJobDto {
  id: string;
  candidateId: string;
  jobId: string;
  savedAt: Date;
}

export interface CreateSavedJobDto {
  candidateId: string;
  jobId: string;
}

@Injectable({
  providedIn: 'root'
})
export class SavedJobService {
  private apiUrl = `${environment.apiUrl}/savedjob`;

  constructor(private http: HttpClient) {}

  getByCandidateId(candidateId: string): Observable<SavedJobDto[]> {
    return this.http.get<SavedJobDto[]>(`${this.apiUrl}/candidate/${candidateId}`);
  }

  saveJob(candidateId: string, jobId: string): Observable<SavedJobDto> {
    const dto: CreateSavedJobDto = { candidateId, jobId };
    return this.http.post<SavedJobDto>(this.apiUrl, dto);
  }

  removeJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
