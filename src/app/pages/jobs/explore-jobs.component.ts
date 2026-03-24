import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { JobDto } from '../../models/job.model';
import { JobMapComponent } from './job-map.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-explore-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, JobMapComponent],
  template: `
    <div class="flex flex-col h-[calc(100vh-64px)] overflow-hidden font-sans">
      
      <!-- Top Search Bar -->
      <div class="bg-white border-b border-gray-200 p-4 z-10 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <h1 class="text-xl font-black text-gray-900 flex items-center gap-2 min-w-max mr-4">
          <span class="p-1.5 bg-indigo-600 rounded-lg text-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          </span>
          Explore Jobs
        </h1>
        
        <div class="relative flex-1 max-w-2xl">
          <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearchTermChange($event)"
            class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
            placeholder="Search by title, skills or keywords...">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div class="flex items-center gap-2">
           <button (click)="resetFilters()" class="text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors px-4">Reset</button>
           <a routerLink="/jobs" class="inline-flex items-center bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all">
             List View
           </a>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden relative">
        
        <!-- Sidebar: Discovery List -->
        <aside [class.translate-x-0]="isSidebarOpen" [class.-translate-x-full]="!isSidebarOpen" 
               class="absolute md:relative z-20 w-80 h-full bg-white border-r border-gray-200 transition-transform duration-300 shadow-xl md:shadow-none flex flex-col">
          
          <!-- Quick Stats -->
          <div class="p-4 bg-indigo-50/50 border-b border-indigo-100">
            <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Opportunities</p>
            <p class="text-lg font-black text-indigo-900">{{ totalResults }} Found in Area</p>
          </div>

          <!-- The List -->
          <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            <div *ngIf="isLoading" class="space-y-4">
              <div *ngFor="let i of [1,2,3,4,5]" class="h-24 bg-gray-50 rounded-2xl animate-pulse"></div>
            </div>

            <div *ngFor="let job of jobs" 
                 class="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer group animate-in slide-in-from-left-2 duration-300"
                 [routerLink]="['/jobs', job.id]"
                 (mouseenter)="hoveredJobId = job.id"
                 (mouseleave)="hoveredJobId = null">
                <div class="flex items-start gap-4 mb-2">
                  <div class="w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {{ job.companyName.charAt(0) }}
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-sm font-black text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{{ job.title }}</h4>
                    <p class="text-[11px] font-bold text-gray-500">{{ job.companyName }}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    <span>{{ job.salaryMin ? (job.salaryMin | number) + ' MDL' : 'Negotiable' }}</span>
                    <span class="flex items-center gap-1">
                      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      {{ job.location }}
                    </span>
                </div>
            </div>

            <div *ngIf="!isLoading && jobs.length === 0" class="text-center py-10">
              <p class="text-gray-400 font-bold">No results found</p>
              <button (click)="resetFilters()" class="text-indigo-600 text-sm font-bold mt-2">Clear search</button>
            </div>
          </div>
        </aside>

        <!-- Toggle Button for Mobile -->
        <button (click)="isSidebarOpen = !isSidebarOpen" 
                class="md:hidden absolute bottom-6 left-6 z-30 p-4 bg-indigo-600 text-white rounded-full shadow-2xl">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path *ngIf="!isSidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path *ngIf="isSidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Map Area -->
        <main class="flex-1 relative bg-gray-100">
           <app-job-map [jobs]="jobs"></app-job-map>
        </main>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
    .animate-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ExploreJobsComponent implements OnInit {
  private jobService = inject(JobService);
  
  jobs: JobDto[] = [];
  isLoading = true;
  searchTerm = '';
  totalResults = 0;
  isSidebarOpen = true;
  hoveredJobId: string | null = null;

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadJobs();
    });
    
    this.loadJobs();
  }

  loadJobs() {
    this.isLoading = true;
    this.jobService.search(
      this.searchTerm, 
      '', '', '', '', undefined, undefined, undefined, 1, 50
    ).subscribe({
      next: (res) => {
        // Only include jobs with coordinates for the map-first view
        this.jobs = res.jobs.filter(j => j.latitude && j.longitude);
        this.totalResults = this.jobs.length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearchTermChange(term: string) {
    this.searchSubject.next(term);
  }

  resetFilters() {
    this.searchTerm = '';
    this.loadJobs();
  }
}
