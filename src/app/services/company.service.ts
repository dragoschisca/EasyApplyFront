import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CompanyDto, CreateCompanyDto, UpdateCompanyDto } from '../models/company.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `${environment.apiUrl}/company`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CompanyDto[]> {
    return this.http.get<CompanyDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<CompanyDto> {
    return this.http.get<CompanyDto>(`${this.apiUrl}/${id}`);
  }
  
  getByUserId(userId: string): Observable<CompanyDto> {
    return this.http.get<CompanyDto>(`${this.apiUrl}/user/${userId}`);
  }

  create(dto: CreateCompanyDto): Observable<CompanyDto> {
    return this.http.post<CompanyDto>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateCompanyDto): Observable<CompanyDto> {
    return this.http.put<CompanyDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
