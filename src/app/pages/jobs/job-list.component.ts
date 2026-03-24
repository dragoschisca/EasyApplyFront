import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService, SearchJobResponse } from '../../services/job.service';
import { JobDto } from '../../models/job.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { JobMapComponent } from './job-map.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, JobMapComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-72 space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Filters</h3>
            
            <!-- Category Filter -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider text-xs">Category</label>
              <select [(ngModel)]="categoryFilter" (change)="applyFilters()" 
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                <option value="">All Categories</option>
                <option value="IT / Software">IT / Software</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Design">Design</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <!-- Work Mode Filter -->
            <div class="mb-6">
              <label class="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Work Mode</label>
              <div class="space-y-2">
                <label class="flex items-center group cursor-pointer">
                  <input type="radio" name="locationType" [(ngModel)]="locationTypeFilter" [value]="undefined" (change)="applyFilters()" class="hidden">
                  <div class="w-5 h-5 rounded-lg border-2 border-gray-200 mr-3 flex items-center justify-center group-hover:border-indigo-400 transition-all" [class.bg-indigo-600]="locationTypeFilter === undefined" [class.border-indigo-600]="locationTypeFilter === undefined">
                    <div class="w-1.5 h-1.5 bg-white rounded-full" *ngIf="locationTypeFilter === undefined"></div>
                  </div>
                  <span class="text-sm font-bold text-gray-600 group-hover:text-indigo-600 transition-colors" [class.text-indigo-600]="locationTypeFilter === undefined">All Modes</span>
                </label>
                <label class="flex items-center group cursor-pointer">
                  <input type="radio" name="locationType" [(ngModel)]="locationTypeFilter" [value]="0" (change)="applyFilters()" class="hidden">
                  <div class="w-5 h-5 rounded-lg border-2 border-gray-200 mr-3 flex items-center justify-center group-hover:border-green-400 transition-all" [class.bg-green-500]="locationTypeFilter === 0" [class.border-green-500]="locationTypeFilter === 0">
                    <div class="w-1.5 h-1.5 bg-white rounded-full" *ngIf="locationTypeFilter === 0"></div>
                  </div>
                  <span class="text-sm font-bold text-gray-600 group-hover:text-green-600 transition-colors" [class.text-green-600]="locationTypeFilter === 0">Remote</span>
                </label>
                <label class="flex items-center group cursor-pointer">
                  <input type="radio" name="locationType" [(ngModel)]="locationTypeFilter" [value]="2" (change)="applyFilters()" class="hidden">
                  <div class="w-5 h-5 rounded-lg border-2 border-gray-200 mr-3 flex items-center justify-center group-hover:border-purple-400 transition-all" [class.bg-purple-500]="locationTypeFilter === 2" [class.border-purple-500]="locationTypeFilter === 2">
                    <div class="w-1.5 h-1.5 bg-white rounded-full" *ngIf="locationTypeFilter === 2"></div>
                  </div>
                  <span class="text-sm font-bold text-gray-600 group-hover:text-purple-600 transition-colors" [class.text-purple-600]="locationTypeFilter === 2">Hybrid</span>
                </label>
                <label class="flex items-center group cursor-pointer">
                  <input type="radio" name="locationType" [(ngModel)]="locationTypeFilter" [value]="1" (change)="applyFilters()" class="hidden">
                  <div class="w-5 h-5 rounded-lg border-2 border-gray-200 mr-3 flex items-center justify-center group-hover:border-blue-400 transition-all" [class.bg-blue-500]="locationTypeFilter === 1" [class.border-blue-500]="locationTypeFilter === 1">
                    <div class="w-1.5 h-1.5 bg-white rounded-full" *ngIf="locationTypeFilter === 1"></div>
                  </div>
                  <span class="text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-colors" [class.text-blue-600]="locationTypeFilter === 1">On-site</span>
                </label>
              </div>
            </div>

            <!-- Location Search -->
            <div class="mb-6">
              <label class="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Location</label>
              <div class="relative">
                <input type="text" [(ngModel)]="locationFilter" (ngModelChange)="applyFilters()" 
                  class="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
                  placeholder="City or Region">
                <svg class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              </div>
            </div>

            <!-- Salary Range -->
            <div class="mb-6">
              <label class="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Salary Range (MDL)</label>
              <div class="grid grid-cols-2 gap-2">
                <input type="number" [(ngModel)]="minSalaryFilter" (ngModelChange)="applyFilters()"
                  class="w-full bg-gray-50 border-2 border-transparent rounded-xl px-3 py-3 text-xs focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
                  placeholder="Min">
                <input type="number" [(ngModel)]="maxSalaryFilter" (ngModelChange)="applyFilters()"
                  class="w-full bg-gray-50 border-2 border-transparent rounded-xl px-3 py-3 text-xs focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
                  placeholder="Max">
              </div>
            </div>

            <!-- Employment Type -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider text-xs">Type</label>
              <div class="space-y-2">
                <label class="flex items-center text-sm text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors">
                  <input type="radio" name="type" [(ngModel)]="typeFilter" value="" (change)="applyFilters()" class="mr-2 text-indigo-600 focus:ring-indigo-500 h-4 w-4">
                  Any Type
                </label>
                <label class="flex items-center text-sm text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors">
                  <input type="radio" name="type" [(ngModel)]="typeFilter" value="FullTime" (change)="applyFilters()" class="mr-2 text-indigo-600 focus:ring-indigo-500 h-4 w-4">
                  Full-Time
                </label>
                <label class="flex items-center text-sm text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors">
                  <input type="radio" name="type" [(ngModel)]="typeFilter" value="Contract" (change)="applyFilters()" class="mr-2 text-indigo-600 focus:ring-indigo-500 h-4 w-4">
                  Contract
                </label>
              </div>
            </div>

            <button (click)="resetFilters()" class="w-full text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors flex items-center justify-center pt-4 border-t border-gray-50">
              Reset all filters
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 space-y-6">
          
          <!-- Search Header -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearchTermChange($event)"
                class="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 transition-all outline-none"
                placeholder="Search jobs by title, company or keywords...">
            </div>
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
              Search
            </button>
          </div>

          <!-- Results Summary -->
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm mb-2">
            <p class="text-gray-500 order-2 sm:order-1">Found <span class="font-bold text-gray-900">{{ totalResults }}</span> job opportunities</p>
            <div class="flex items-center gap-4 order-1 sm:order-2 w-full sm:w-auto">
              <a routerLink="/jobs/explore" class="flex-1 sm:flex-none px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border border-indigo-100 hover:bg-indigo-100">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Explore on Map
              </a>
              <div class="hidden sm:flex items-center space-x-2">
                <span class="text-gray-400">Sort:</span>
                <select class="bg-transparent font-bold text-gray-700 focus:outline-none cursor-pointer text-xs">
                  <option>Newest</option>
                  <option>Salary: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoading" class="flex flex-col justify-center items-center py-24 space-y-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
             <div class="relative">
               <div class="w-12 h-12 rounded-full border-4 border-indigo-50"></div>
               <div class="absolute inset-0 w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
             </div>
             <p class="text-gray-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Matching opportunities...</p>
          </div>

          <!-- Personalized Recommendations -->
          <div *ngIf="!isLoading && isCandidate && recommendedJobs.length > 0" class="mb-12 animate-in slide-in-from-top-4 duration-700">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-black text-gray-900 flex items-center gap-3">
                <span class="p-2 bg-amber-100 rounded-xl">
                  <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </span>
                Tailored <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">for You</span>
              </h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <div *ngFor="let job of recommendedJobs" class="relative group bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 rounded-[2rem] shadow-xl hover:scale-[1.02] transition-all duration-500 overflow-hidden cursor-pointer" [routerLink]="['/jobs', job.id]">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                
                <div class="flex items-start justify-between mb-4 relative z-10">
                  <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                    {{ job.companyName.charAt(0) }}
                  </div>
                  <div class="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 font-black text-[9px] text-indigo-200 uppercase tracking-widest">
                    98% Match
                  </div>
                </div>
                
                <h3 class="text-lg font-black text-white mb-1 group-hover:text-indigo-400 transition-colors truncate">{{ job.title }}</h3>
                <p class="text-indigo-300 text-sm font-bold mb-4">{{ job.companyName }}</p>
                
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <div class="flex flex-col">
                    <span class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Est. Salary</span>
                    <span class="text-white font-black text-sm">{{ job.salaryMin | number:'1.0-0' }} MDL</span>
                  </div>
                  <svg class="w-6 h-6 text-indigo-400 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </div>
          </div>



          <!-- Job Cards List View -->
          <div *ngIf="!isLoading && jobs.length > 0" class="grid grid-cols-1 gap-5 animate-in slide-in-from-bottom-4 duration-500">
            <div *ngFor="let job of jobs" class="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden">
              <div class="flex flex-col sm:flex-row gap-6">
                <!-- Company Logo -->
                <div class="w-16 h-16 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl flex-shrink-0 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                  {{ job.companyName.charAt(0) }}
                </div>
                
                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2 mb-2">
                    <span class="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {{ job.category || 'General' }}
                    </span>
                    <span *ngIf="job.locationType === 0" class="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      Remote
                    </span>
                    <span *ngIf="job.locationType === 2" class="px-2.5 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      Hybrid
                    </span>
                    <span *ngIf="job.locationType === 1" class="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      On-site
                    </span>
                  </div>
                  
                  <h3 class="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors mb-1 truncate cursor-pointer" [routerLink]="['/jobs', job.id]">
                    {{ job.title }}
                  </h3>
                  
                  <p class="text-gray-600 font-semibold mb-4 flex items-center">
                    <span class="hover:text-indigo-600 cursor-pointer" [routerLink]="['/companies', job.companyId]">{{ job.companyName }}</span>
                    <span class="mx-2 text-gray-300">•</span>
                    <span class="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center">
                      <svg class="h-3.5 w-3.5 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {{ job.location }}
                    </span>
                  </p>
                  
                  <div class="flex flex-wrap gap-y-2 gap-x-6">
                    <div class="flex items-center text-sm font-black text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                      <svg class="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <ng-container *ngIf="job.salaryMin">
                        {{ job.salaryMin | number:'1.0-0' }} - {{ job.salaryMax | number:'1.0-0' }} MDL
                      </ng-container>
                      <span *ngIf="!job.salaryMin" class="text-gray-400 font-normal italic">Salary Negotiable</span>
                    </div>
                    <div class="flex items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                      <svg class="h-4 w-4 mr-1.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ job.employmentType }}
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="sm:border-l border-gray-50 sm:pl-6 flex items-center justify-between sm:flex-col sm:justify-center gap-4">
                  <button [routerLink]="['/jobs', job.id]" class="w-full sm:w-32 bg-indigo-600 text-white hover:bg-black font-black py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-100 group-hover:shadow-indigo-200 active:scale-95">
                    View Job
                  </button>
                  <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">{{ job.createdAt | date:'MMM d' }}</p>
                </div>
              </div>
              
              <!-- Subtle Accent -->
              <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-600 opacity-[0.02] rounded-bl-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-700"></div>
            </div>
          </div>

          <!-- Pagination -->
          <div *ngIf="!isLoading && totalResults > pageSize" class="flex justify-center space-x-2 pt-8">
             <button [disabled]="page === 1" (click)="changePage(page - 1)" 
               class="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
               <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
             </button>
             <div class="flex items-center px-4 font-bold text-gray-900 border border-gray-200 rounded-xl bg-white">
               {{ page }}
             </div>
             <button [disabled]="jobs.length < pageSize" (click)="changePage(page + 1)" 
               class="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
               <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
             </button>
          </div>

          <!-- Empty State -->
          <div *ngIf="!isLoading && jobs.length === 0" class="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <div class="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400">
              <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No matching jobs found</h3>
            <p class="text-gray-500 max-w-sm mx-auto mb-8">Try adjusting your filters or search terms to see more opportunities.</p>
            <button (click)="resetFilters()" class="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class JobListComponent implements OnInit {
  private jobService = inject(JobService);
  private authService = inject(AuthService);
  
  jobs: JobDto[] = [];
  recommendedJobs: JobDto[] = [];
  isCandidate = false;
  isLoading = true;
  

  searchTerm = '';
  locationFilter = '';
  categoryFilter = '';
  typeFilter = '';
  locationTypeFilter: number | undefined = undefined;
  minSalaryFilter: number | null = null;
  maxSalaryFilter: number | null = null;
  
  page = 1;
  pageSize = 10;
  totalResults = 0;

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.page = 1;
      this.loadJobs();
    });
    
    this.loadJobs();
    this.checkCandidateStatus();
  }

  checkCandidateStatus() {
    const user = this.authService.currentUser();
    if (user && user.role === 'Candidate') {
      this.isCandidate = true;
      this.loadRecommendations(user.id);
    }
  }

  loadRecommendations(userId: string) {
    this.jobService.getRecommendations(userId).subscribe({
      next: (jobs) => {
        this.recommendedJobs = jobs;
      }
    });
  }

  loadJobs() {
    this.isLoading = true;
    this.jobService.search(
      this.searchTerm, 
      this.locationFilter, 
      this.categoryFilter,
      this.typeFilter, 
      '', // experienceLevel
      this.minSalaryFilter || undefined,
      this.maxSalaryFilter || undefined,
      this.locationTypeFilter, 
      this.page, 
      this.pageSize
    ).subscribe({
      next: (res) => {
        this.jobs = res.jobs;
        this.totalResults = res.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load jobs', err);
        this.isLoading = false;
      }
    });
  }

  onSearchTermChange(term: string) {
    this.searchSubject.next(term);
  }

  applyFilters() {
    this.page = 1;
    this.loadJobs();
  }

  resetFilters() {
    this.searchTerm = '';
    this.locationFilter = '';
    this.categoryFilter = '';
    this.typeFilter = '';
    this.locationTypeFilter = undefined;
    this.minSalaryFilter = null;
    this.maxSalaryFilter = null;
    this.applyFilters();
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadJobs();
  }

  deleteJob(id: string) {
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.delete(id).subscribe({
        next: () => {
          this.loadJobs();
        },
        error: (err) => alert('Failed to delete job.')
      });
    }
  }
}
