import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CvDto } from '../models/cv.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private apiUrl = `${environment.apiUrl}/cv`;

  constructor(private http: HttpClient) {}

  getByCandidateId(candidateId: string): Observable<CvDto[]> {
    return this.http.get<CvDto[]>(`${this.apiUrl}/candidate/${candidateId}`);
  }

  getById(id: string): Observable<CvDto> {
    return this.http.get<CvDto>(`${this.apiUrl}/${id}`);
  }

  // To upload a file, typically we use FormData
  upload(candidateId: string, title: string, file: File, isPrimary: boolean = false): Observable<CvDto> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', title);
    formData.append('isPrimary', isPrimary.toString());
    return this.http.post<CvDto>(`${this.apiUrl}/${candidateId}`, formData);
  }

  setDefault(candidateId: string, cvId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${cvId}/primary/${candidateId}`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
