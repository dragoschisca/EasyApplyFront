import {
  Component,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { JobDto } from '../../models/job.model';
import { JobMapComponent } from './job-map.component';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  of,
  tap,
  catchError,
  takeUntil,
  map,
} from 'rxjs';

interface FilterState {
  keyword: string;
  useGeolocation: boolean;
  latitude: number | null;
  longitude: number | null;
  radiusKm: number;
}

@Component({
  selector: 'app-explore-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, JobMapComponent],
  template: `
    <div class="flex flex-col h-[calc(100vh-64px)] overflow-hidden font-sans bg-[#F8FAFC]">

      <!-- Top Search Bar -->
      <div class="bg-white/80 backdrop-blur-xl border-b border-slate-200 p-5 z-30 shadow-sm flex flex-col md:flex-row gap-5 items-center">
        <h1 class="text-2xl font-black text-slate-900 flex items-center gap-3 min-w-max mr-6">
          <div class="p-2 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
          </div>
          <span class="tracking-tight">Explore Jobs</span>
        </h1>

        <!-- Search Input -->
        <div class="relative flex-1 max-w-2xl group">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchTermChange($event)"
            [disabled]="filters.useGeolocation"
            class="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium placeholder:text-slate-400 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Search by title, skills or keywords..."
          />
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Geolocation + Radius Controls -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <!-- Use My Location Button -->
          <button
            (click)="toggleGeolocation()"
            [class.bg-indigo-600]="filters.useGeolocation"
            [class.text-white]="filters.useGeolocation"
            [class.bg-slate-100]="!filters.useGeolocation"
            [class.text-slate-700]="!filters.useGeolocation"
            class="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm hover:shadow-md active:scale-95"
            [title]="filters.useGeolocation ? 'Disable geolocation filter' : 'Filter by my current location'"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span *ngIf="isLocating" class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
              Locating...
            </span>
            <span *ngIf="!isLocating">{{ filters.useGeolocation ? 'Near Me ✓' : 'Near Me' }}</span>
          </button>

          <!-- Radius Slider (visible only when geolocation is active) -->
          <div *ngIf="filters.useGeolocation" class="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
            <svg class="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="9" stroke-width="2"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2M3 12h2m14 0h2"/>
            </svg>
            <input
              type="range"
              [value]="filters.radiusKm"
              (input)="onRadiusChange($event)"
              min="2" max="100" step="1"
              class="w-24 accent-indigo-600"
            />
            <span class="text-xs font-black text-indigo-700 whitespace-nowrap min-w-[42px]">{{ filters.radiusKm }} km</span>
          </div>

          <!-- Geolocation error banner -->
          <span *ngIf="geoError" class="text-xs font-bold text-red-500 max-w-[140px] leading-tight">{{ geoError }}</span>

          <button
            (click)="resetFilters()"
            class="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors px-4 py-2 hover:bg-slate-50 rounded-xl"
          >
            Reset
          </button>

          <a
            routerLink="/jobs"
            class="inline-flex items-center bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            List View
          </a>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden relative">
        <!-- Sidebar: Discovery List -->
        <aside
          [class.translate-x-0]="isSidebarOpen"
          [class.-translate-x-full]="!isSidebarOpen"
          class="absolute md:relative z-20 w-[380px] h-full bg-white/70 backdrop-blur-2xl border-r border-slate-200 transition-transform duration-500 shadow-2xl md:shadow-none flex flex-col"
        >
          <!-- Quick Stats -->
          <div class="p-6 bg-indigo-600 text-white relative overflow-hidden">
            <div class="relative z-10">
              <p class="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-1">
                {{ filters.useGeolocation ? 'Within ' + filters.radiusKm + ' km' : 'Live Opportunities' }}
              </p>
              <p class="text-2xl font-black">
                {{ jobs.length }}
                <span class="text-indigo-200 font-medium">{{ filters.useGeolocation ? 'Nearby Jobs' : 'Found in Area' }}</span>
              </p>
            </div>
            <!-- Geolocation indicator -->
            <div *ngIf="filters.useGeolocation" class="absolute top-4 right-4 flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span class="text-[10px] font-bold text-white uppercase tracking-wider">Live Location</span>
            </div>
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <!-- The List -->
          <div class="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 bg-slate-50/50">
            <div *ngIf="isLoading" class="space-y-4">
              <div *ngFor="let i of [1, 2, 3, 4, 5]"
                class="h-32 bg-white rounded-3xl animate-pulse border border-slate-100">
              </div>
            </div>

            <div
              *ngFor="let job of jobs; let i = index"
              class="p-5 bg-white rounded-3xl border-2 border-slate-200 shadow-md hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group relative overflow-hidden"
              [style.animation-delay]="i * 50 + 'ms'"
              [routerLink]="['/jobs', job.id]"
              (mouseenter)="hoveredJobId = job.id"
              (mouseleave)="hoveredJobId = null"
            >
              <div class="flex items-start gap-4 mb-4">
                <div class="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <img *ngIf="job.companyLogoUrl" [src]="job.companyLogoUrl" class="w-full h-full object-cover" />
                  <span *ngIf="!job.companyLogoUrl">{{ job.companyName.charAt(0) }}</span>
                </div>
                <div class="min-w-0">
                  <h4 class="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate mb-0.5">
                    {{ job.title }}
                  </h4>
                  <div class="flex items-center gap-2">
                    <p class="text-xs font-bold text-slate-500">{{ job.companyName }}</p>
                    <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <p class="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                      {{ job.category || 'Tech' }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between mt-auto">
                <div class="bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100/50">
                  <span class="text-xs font-black text-indigo-700">{{
                    job.salaryMin ? (job.salaryMin | number) + ' MDL' : 'Negotiable'
                  }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ job.location }}
                </div>
              </div>

              <!-- Hover accent -->
              <div class="absolute top-0 left-0 w-1 h-full bg-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
            </div>

            <div *ngIf="!isLoading && jobs.length === 0" class="text-center py-20 px-10">
              <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-black text-slate-900 mb-2">No results found</h3>
              <p class="text-sm text-slate-500 mb-8">
                {{ filters.useGeolocation ? 'No jobs found within ' + filters.radiusKm + ' km. Try increasing the radius.' : 'Try adjusting your filters or search terms.' }}
              </p>
              <button
                (click)="resetFilters()"
                class="w-full py-4 bg-indigo-50 text-indigo-600 font-black rounded-2xl hover:bg-indigo-100 transition-all"
              >
                Clear everything
              </button>
            </div>
          </div>
        </aside>

        <!-- Toggle Button for Mobile -->
        <button
          (click)="isSidebarOpen = !isSidebarOpen"
          class="md:hidden absolute bottom-8 left-8 z-40 p-5 bg-slate-900 text-white rounded-full shadow-2xl active:scale-90 transition-transform"
        >
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path *ngIf="!isSidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
              d="M4 6h16M4 12h16M4 18h16"/>
            <path *ngIf="isSidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
              d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Map Area -->
        <main class="flex-1 relative bg-[#F1F5F9]">
          <app-job-map
            [jobs]="jobs"
            [selectedJobId]="hoveredJobId || undefined"
            [userLat]="filters.useGeolocation ? filters.latitude : null"
            [userLng]="filters.useGeolocation ? filters.longitude : null"
            [radiusKm]="filters.useGeolocation ? filters.radiusKm : null"
          ></app-job-map>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  `],
})
export class ExploreJobsComponent implements OnInit, OnDestroy {
  private jobService = inject(JobService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  jobs: JobDto[] = [];
  isLoading = false;
  isLocating = false;
  geoError = '';
  searchTerm = '';
  isSidebarOpen = true;
  hoveredJobId: string | null = null;

  filters: FilterState = {
    keyword: '',
    useGeolocation: false,
    latitude: null,
    longitude: null,
    radiusKm: 10,
  };

  private filters$ = new BehaviorSubject<FilterState>(this.filters);
  private searchInput$ = new Subject<string>();

  ngOnInit() {
    // Debounce keyword typing, then push into the main filter stream
    this.searchInput$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe(keyword => {
      this.filters = { ...this.filters, keyword };
      this.filters$.next(this.filters);
    });

    // Reactive data loading: every filter change triggers the right backend call
    this.filters$.pipe(
      switchMap(f => {
        this.isLoading = true;
        if (f.useGeolocation && f.latitude !== null && f.longitude !== null) {
          return this.jobService.getNearby(f.latitude, f.longitude, f.radiusKm).pipe(
            map(jobs => jobs),
            catchError(() => of([] as JobDto[])),
          );
        }
        return this.jobService.search(f.keyword, '', '', '', '', undefined, undefined, undefined, 1, 100).pipe(
          map(res => res.jobs),
          catchError(() => of([] as JobDto[])),
        );
      }),
      takeUntil(this.destroy$),
    ).subscribe(jobs => {
      this.jobs = jobs;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchTermChange(term: string) {
    this.searchInput$.next(term);
  }

  onRadiusChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    this.filters = { ...this.filters, radiusKm: value };
    this.filters$.next(this.filters);
  }

  toggleGeolocation() {
    if (this.filters.useGeolocation) {
      // Disable geolocation mode — revert to keyword search
      this.filters = { ...this.filters, useGeolocation: false, latitude: null, longitude: null };
      this.filters$.next(this.filters);
      return;
    }

    if (!navigator.geolocation) {
      this.geoError = 'Geolocation is not supported by your browser.';
      return;
    }

    this.isLocating = true;
    this.geoError = '';

    navigator.geolocation.getCurrentPosition(
      position => {
        this.isLocating = false;
        this.filters = {
          ...this.filters,
          useGeolocation: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.filters$.next(this.filters);
      },
      error => {
        this.isLocating = false;
        this.geoError = error.code === 1
          ? 'Location access denied.'
          : 'Could not retrieve location.';
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  resetFilters() {
    this.searchTerm = '';
    this.geoError = '';
    this.filters = {
      keyword: '',
      useGeolocation: false,
      latitude: null,
      longitude: null,
      radiusKm: 10,
    };
    this.filters$.next(this.filters);
  }
}
