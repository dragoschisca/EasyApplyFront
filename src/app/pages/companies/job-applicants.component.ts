import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { JobService } from '../../services/job.service';
import { ToastService } from '../../core/services/toast.service';
import { ApplicationDto, UpdateApplicationStatusDto } from '../../models/application.model';

@Component({
  selector: 'app-job-applicants',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 font-sans pb-20">
      
      <!-- Premium Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
           <a routerLink="/company-jobs" class="inline-flex items-center text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 mb-4 transition-all group">
             <svg class="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Back to active jobs
           </a>
           <h2 class="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
              {{ jobTitle }} 
              <span class="text-indigo-600 block sm:inline mt-2 sm:mt-0 font-medium text-2xl opacity-40">Applicants</span>
           </h2>
        </div>
        
        <div class="flex items-center gap-4">
           <div class="hidden sm:block text-right">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pool</p>
              <p class="text-2xl font-black text-gray-900">{{ applications.length }}</p>
           </div>
           <select class="pl-4 pr-10 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer hover:bg-gray-100 transition-all appearance-none">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="interviewing">Interviewing</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
           </select>
        </div>
      </div>

      <div *ngIf="isLoading" class="flex flex-col items-center justify-center py-32 space-y-4">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">Curating Talent...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && applications.length === 0" class="bg-gray-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-200">
        <div class="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-gray-200/50 text-indigo-600">
          <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        </div>
        <h3 class="text-2xl font-black text-gray-900 mb-3">No applications found</h3>
        <p class="text-gray-500 max-w-sm mx-auto font-medium">Your job post is live, but no one has applied yet. It usually takes 24-48h to start seeing candidates.</p>
      </div>

      <!-- Applicants List Grid -->
      <div *ngIf="!isLoading && applications.length > 0" class="grid gap-8">
        
        <div *ngFor="let app of applications" class="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 border border-gray-50 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group relative">
           
           <div class="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
              
              <!-- Left: Avatar & Basic Info -->
              <div class="flex items-center gap-6 min-w-[300px]">
                 <div class="relative">
                    <div class="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-lg group-hover:scale-105 transition-transform duration-500">
                       {{ app.candidateName.charAt(0) || 'C' }}
                    </div>
                    <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl border-4 border-white flex items-center justify-center shadow-md"
                         [ngClass]="{
                            'bg-yellow-400': app.status === 'Pending',
                            'bg-blue-500': app.status === 'Reviewed',
                            'bg-indigo-500': app.status === 'Interviewing',
                            'bg-green-500': app.status === 'Accepted',
                            'bg-red-500': app.status === 'Rejected'
                         }">
                    </div>
                 </div>
                 <div>
                    <h3 class="font-black text-2xl text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                       {{ app.candidateName || 'Anonymous' }}
                    </h3>
                    <div class="flex items-center gap-3 text-sm text-gray-400 font-bold uppercase tracking-wider">
                       {{ app.candidateEmail }}
                    </div>
                 </div>
              </div>

              <!-- Center: Experience & CV (Simplified) -->
              <div class="flex-1 flex flex-col sm:flex-row gap-10 w-full">
                 <div class="flex-1">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Professional CV</p>
                    <button (click)="viewCv(app)" class="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-2xl text-gray-700 font-bold hover:bg-gray-900 hover:text-white transition-all w-full sm:w-auto group/cv">
                      <svg class="w-5 h-5 text-indigo-500 group-hover/cv:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <span class="truncate max-w-[150px]">{{ app.cvFileName || 'candidate_cv.pdf' }}</span>
                    </button>
                 </div>

                 <div *ngIf="app.compatibilityScore !== null" class="flex flex-col justify-center items-center sm:items-end">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">AI Match Score</p>
                    <div class="flex items-baseline gap-1">
                      <span class="text-4xl font-black text-gray-900">{{ (app.compatibilityScore! * 1).toFixed(0) }}</span>
                      <span class="text-lg font-bold text-indigo-600">%</span>
                    </div>
                    <div class="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                       <div class="h-full bg-indigo-600 rounded-full" [style.width.%]="app.compatibilityScore"></div>
                    </div>
                 </div>
              </div>

              <!-- Right: Actions & Status -->
              <div class="w-full lg:w-64 flex flex-col gap-4">
                 <div class="relative">
                   <select [ngModel]="app.status" (ngModelChange)="updateStatus(app.id, $event)"
                      class="w-full pl-4 pr-10 py-3 font-bold border-2 border-transparent rounded-2xl bg-gray-50 outline-none focus:bg-white focus:border-indigo-600 transition-all cursor-pointer appearance-none shadow-sm text-sm"
                      [ngClass]="{
                        'text-yellow-700': app.status === 'Pending',
                        'text-blue-700': app.status === 'Reviewed',
                        'text-indigo-700': app.status === 'Interviewing',
                        'text-green-700': app.status === 'Accepted',
                        'text-red-700': app.status === 'Rejected'
                      }">
                      <option value="Pending">Pending Review</option>
                      <option value="Reviewed">Document Reviewed</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Accepted">Hired / Accepted</option>
                      <option value="Rejected">Declined</option>
                   </select>
                   <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
                   </div>
                 </div>
                 
                 <div class="flex gap-3">
                    <button [routerLink]="['/applicants', app.id, 'analysis']" class="flex-1 bg-gray-900 text-white font-bold py-3 px-4 rounded-2xl text-sm transition-all shadow-lg shadow-gray-200 hover:bg-indigo-600 hover:shadow-indigo-200 group/btn">
                       Analysis
                       <svg class="w-4 h-4 inline-block ml-1 opacity-50 group-hover/btn:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </button>
                    <button class="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-100 text-gray-400 rounded-2xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                       <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </button>
                 </div>
              </div>

           </div>
        </div>
        
      </div>

    </div>
  `,
  styles: [`
    .animate-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class JobApplicantsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private applicationService = inject(ApplicationService);
  private jobService = inject(JobService);
  private toastService = inject(ToastService);

  jobId: string | null = null;
  jobTitle = 'Loading Job...';
  applications: ApplicationDto[] = [];
  isLoading = true;

  viewCv(app: ApplicationDto) {
    if (!app.cvPath) return;
    const baseUrl = 'http://localhost:5077';
    window.open(`${baseUrl}${app.cvPath}`, '_blank');
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.jobId = params['jobId'];
      if (this.jobId) {
        this.loadJobInfo();
        this.loadApplicants();
      } else {
        this.isLoading = false;
        this.toastService.error('Direct access without job id is invalid.');
      }
    });
  }

  loadJobInfo() {
    if (!this.jobId) return;
    this.jobService.getById(this.jobId).subscribe({
      next: (job) => this.jobTitle = job.title,
      error: () => this.jobTitle = 'Job Not Found'
    });
  }

  loadApplicants() {
    if (!this.jobId) return;
    
    this.applicationService.getByJobId(this.jobId).subscribe({
      next: (apps) => {
        this.applications = apps;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load applicants.');
        this.isLoading = false;
      }
    });
  }

  updateStatus(appId: string, newStatus: string) {
    this.applicationService.updateStatus(appId, newStatus).subscribe({
      next: () => {
        this.toastService.success(`Status updated to ${newStatus}`);
        const app = this.applications.find(a => a.id === appId);
        if (app) app.status = newStatus;
      },
      error: () => {
        this.toastService.error('Failed to update status.');
        // Revert local state requires reload or maintaining old state visually
      }
    });
  }
}
