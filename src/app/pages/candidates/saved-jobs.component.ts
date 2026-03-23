import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CandidateService } from '../../services/candidate.service';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SavedJobService, SavedJobDto } from '../../services/saved-job.service';
import { JobDto } from '../../models/job.model';
import { switchMap, forkJoin, of } from 'rxjs';

interface EnrichedSavedJob extends SavedJobDto {
  job?: JobDto;
}

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Saved Jobs</h2>
          <p class="text-gray-500 mt-1 text-sm">Jobs you've bookmarked to apply later.</p>
        </div>
        <a routerLink="/jobs" class="text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors">
          Browse More Jobs
        </a>
      </div>

      <div *ngIf="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>

      <div *ngIf="!isLoading && savedJobs.length === 0" class="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
        <div class="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-pink-400">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">No saved jobs yet</h3>
        <p class="text-gray-500 text-sm mb-6">Browse jobs and click "Save" to track opportunities you like.</p>
        <a routerLink="/jobs" class="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg hover:bg-indigo-700 transition-all">
          Explore Jobs
        </a>
      </div>

      <div *ngIf="!isLoading && savedJobs.length > 0" class="grid gap-4">
        <div *ngFor="let item of savedJobs" 
             class="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-5">
          
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
            {{ (item.job?.companyName || '?').charAt(0).toUpperCase() }}
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-gray-900 text-base group-hover:text-indigo-600 transition-colors truncate cursor-pointer"
                [routerLink]="['/jobs', item.jobId]">
              {{ item.job?.title || 'Loading...' }}
            </h3>
            <p class="text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                {{ item.job?.companyName || '—' }}
              </span>
              <span *ngIf="item.job?.location" class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {{ item.job?.location }}
              </span>
              <span class="text-xs text-gray-400">Saved {{ item.savedAt | date:'MMM d, yyyy' }}</span>
            </p>
            <div *ngIf="item.job" class="flex flex-wrap gap-2 mt-2">
              <span class="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded">{{ item.job.employmentType }}</span>
              <span *ngIf="item.job.salaryMin" class="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider rounded">
                {{ item.job.salaryMin | number }} - {{ item.job.salaryMax | number }} MDL
              </span>
            </div>
          </div>

          <div class="flex items-center gap-3 flex-shrink-0">
            <a [routerLink]="['/jobs', item.jobId]"
               class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all">
              Apply Now
            </a>
            <button (click)="remove(item.id)"
                    class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.animate-in { animation: fadeIn 0.4s ease; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`]
})
export class SavedJobsComponent implements OnInit {
  private candidateService = inject(CandidateService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private savedJobService = inject(SavedJobService);
  private jobService = inject(JobService);

  savedJobs: EnrichedSavedJob[] = [];
  isLoading = true;
  candidateId = '';

  ngOnInit() { this.load(); }

  load() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.candidateService.getByUserId(userId).pipe(
      switchMap(candidate => {
        this.candidateId = candidate.id;
        return this.savedJobService.getByCandidateId(candidate.id);
      })
    ).subscribe({
      next: (saves) => {
        this.savedJobs = saves as EnrichedSavedJob[];
        this.isLoading = false;
        saves.forEach((save, i) => {
          this.jobService.getById(save.jobId).subscribe({
            next: (job) => { this.savedJobs[i].job = job; }
          });
        });
      },
      error: () => { this.toastService.error('Could not load saved jobs.'); this.isLoading = false; }
    });
  }

  remove(id: string) {
    this.savedJobService.removeJob(id).subscribe({
      next: () => { this.savedJobs = this.savedJobs.filter(s => s.id !== id); this.toastService.success('Removed from saved jobs.'); },
      error: () => this.toastService.error('Could not remove job.')
    });
  }
}
