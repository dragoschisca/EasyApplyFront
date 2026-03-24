import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { JobDto } from '../../models/job.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-company-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto pb-12 animate-in fade-in duration-700 font-sans">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">My Job Postings</h1>
          <p class="text-gray-500 text-lg font-medium">Manage your active listings and find your next star employee.</p>
        </div>
        <button routerLink="/jobs/create" class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-purple-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center group">
          <div class="bg-white/20 p-1.5 rounded-lg mr-3 group-hover:rotate-90 transition-transform duration-300">
            <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          </div>
          Create New Posting
        </button>
      </div>

      <div *ngIf="isLoading" class="flex flex-col items-center justify-center p-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-50 border-t-purple-600"></div>
        <p class="mt-6 text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading your postings...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && jobs.length === 0" class="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-purple-100/50 p-20 text-center relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-purple-50 rounded-full opacity-50"></div>
        <div class="bg-gradient-to-br from-purple-50 to-indigo-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 text-purple-600 shadow-inner">
          <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <h3 class="text-3xl font-black text-gray-900 mb-4">No jobs posted yet</h3>
        <p class="text-gray-500 mb-10 max-w-sm mx-auto font-medium leading-relaxed">Your future team is waiting. Start by creating your first professional job posting.</p>
        <button routerLink="/jobs/create" class="bg-gray-900 text-white font-black py-4 px-10 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95">
          Post Your First Job
        </button>
      </div>

      <!-- Jobs Cards Grid (mimicking candidate view but with owner actions) -->
      <div *ngIf="!isLoading && jobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let job of jobs" class="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-purple-200 transition-all duration-500 overflow-hidden flex flex-col relative border-t-4" 
             [ngClass]="job.isActive ? 'border-t-purple-500' : 'border-t-gray-300'">
          
          <div class="p-8 flex-1">
            <div class="flex justify-between items-start mb-6">
              <span class="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
                {{ job.category }}
              </span>
              <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 rounded-full" [ngClass]="job.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'"></div>
                <span class="text-[10px] font-bold uppercase tracking-wider" [ngClass]="job.isActive ? 'text-green-600' : 'text-gray-400'">
                  {{ job.isActive ? 'Active' : 'Draft' }}
                </span>
              </div>
            </div>

            <h3 class="text-xl font-black text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-purple-600 transition-colors">
              {{ job.title }}
            </h3>
            
            <div class="space-y-3 mb-8">
              <div class="flex items-center text-gray-500 font-medium text-sm">
                <svg class="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                {{ job.location }}
              </div>
              <div class="flex items-center text-gray-900 font-bold text-sm">
                <svg class="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {{ job.salaryMin | number:'1.0-0' }} - {{ job.salaryMax | number:'1.0-0' }} MDL
              </div>
              <div class="flex items-center text-gray-500 font-medium text-xs">
                <svg class="h-4 w-4 mr-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                {{ job.viewsCount || 0 }} views
              </div>
            </div>
          </div>

          <!-- Quick Actions Footer -->
          <div class="p-6 bg-gray-50 flex items-center justify-between border-t border-gray-100">
            <div class="flex items-center gap-2">
              <a [routerLink]="['/applicants']" [queryParams]="{jobId: job.id}" 
                 class="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm group/btn" title="View Applicants">
                <div class="relative">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  <span *ngIf="job.applicationsCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {{ job.applicationsCount }}
                  </span>
                </div>
              </a>
              <a [routerLink]="['/jobs/edit', job.id]" 
                 class="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all shadow-sm" title="Edit Job">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </a>
              <button (click)="deleteJob(job.id)" 
                 class="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm" title="Delete Job">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            <a [routerLink]="['/jobs', job.id]" class="text-sm font-black text-purple-600 hover:text-purple-800 transition-colors">
              View Detail →
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-in { animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class CompanyJobsComponent implements OnInit {
  private jobService = inject(JobService);
  private companyService = inject(CompanyService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  jobs: JobDto[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadCompanyJobs();
  }

  loadCompanyJobs() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.companyService.getByUserId(userId).pipe(
      switchMap(company => this.jobService.getByCompanyId(company.id, false))
    ).subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load your job postings.');
        this.isLoading = false;
      }
    });
  }

  deleteJob(id: string) {
    if (confirm('Are you sure you want to delete this job posting? This cannot be undone.')) {
      this.jobService.delete(id).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(j => j.id !== id);
          this.toastService.success('Job deleted successfully.');
        },
        error: () => this.toastService.error('Failed to delete job.')
      });
    }
  }
}
