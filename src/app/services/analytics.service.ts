import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CompanyStatistics } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/company`;

  constructor(private http: HttpClient) { }

  getCompanyAnalytics(companyId: string, timeframe: string = 'weekly'): Observable<CompanyStatistics> {
    return this.http.get<CompanyStatistics>(`${this.apiUrl}/${companyId}/analytics`, {
      params: { timeframe }
    });
  }
}
