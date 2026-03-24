import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JobDto, CreateJobDto, UpdateJobDto } from '../models/job.model';
import { Observable } from 'rxjs';

export interface SearchJobResponse {
  jobs: JobDto[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/job`;

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<JobDto> {
    return this.http.get<JobDto>(`${this.apiUrl}/${id}`);
  }

  getByCompanyId(companyId: string, activeOnly: boolean = true): Observable<JobDto[]> {
    let params = new HttpParams().set('activeOnly', activeOnly);
    return this.http.get<JobDto[]>(`${this.apiUrl}/company/${companyId}`, { params });
  }

  search(
    keyword?: string,
    location?: string,
    category?: string,
    employmentType?: string,
    experienceLevel?: string,
    minSalary?: number,
    maxSalary?: number,
    locationType?: number,
    page: number = 1,
    pageSize: number = 10
  ): Observable<SearchJobResponse> {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    if (location) params = params.set('location', location);
    if (category) params = params.set('category', category);
    if (employmentType) params = params.set('employmentType', employmentType);
    if (experienceLevel) params = params.set('experienceLevel', experienceLevel);
    if (minSalary) params = params.set('minSalary', minSalary.toString());
    if (maxSalary) params = params.set('maxSalary', maxSalary.toString());
    if (locationType !== undefined) params = params.set('locationType', locationType.toString());
    params = params.set('page', page).set('pageSize', pageSize);

    return this.http.get<SearchJobResponse>(`${this.apiUrl}/search`, { params });
  }

  create(dto: CreateJobDto): Observable<JobDto> {
    return this.http.post<JobDto>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateJobDto): Observable<JobDto> {
    return this.http.put<JobDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  incrementViewCount(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/view`, {});
  }

  getRecommendations(userId: string, count: number = 5): Observable<JobDto[]> {
    return this.http.get<JobDto[]>(`${this.apiUrl}/recommendations/${userId}?count=${count}`);
  }
}
