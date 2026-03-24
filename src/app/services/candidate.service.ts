import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CandidateDto, CreateCandidateDto, UpdateCandidateDto } from '../models/candidate.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = `${environment.apiUrl}/candidate`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 1, pageSize: number = 10): Observable<CandidateDto[]> {
    return this.http.get<CandidateDto[]>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  getById(id: string): Observable<CandidateDto> {
    return this.http.get<CandidateDto>(`${this.apiUrl}/${id}`);
  }

  getByUserId(userId: string): Observable<CandidateDto> {
    return this.http.get<CandidateDto>(`${this.apiUrl}/user/${userId}`);
  }

  create(dto: CreateCandidateDto): Observable<CandidateDto> {
    return this.http.post<CandidateDto>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateCandidateDto): Observable<CandidateDto> {
    return this.http.put<CandidateDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
