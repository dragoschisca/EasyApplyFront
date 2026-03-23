import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { CandidateService } from '../../services/candidate.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ApplicationDto } from '../../models/application.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-applied-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">My Applications</h2>
      </div>

      <div *ngIf="isLoading" class="flex justify-center p-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && applications.length === 0" class="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
        <div class="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400">
          <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No applications yet</h3>
        <p class="text-gray-500 mb-8 max-w-sm mx-auto">Explore the job board and start making your next career move.</p>
        <button routerLink="/jobs" class="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
          Browse Jobs
        </button>
      </div>

      <!-- Applications List -->
      <div *ngIf="!isLoading && applications.length > 0" class="grid gap-6">
        <div *ngFor="let app of applications" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-6 flex-1 min-w-0">
             <div class="w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-2xl flex-shrink-0 border border-white shadow-inner">
                {{ app.companyName.charAt(0) || 'C' }}
             </div>
             
             <div class="flex-1 min-w-0">
               <h3 class="font-bold text-xl text-gray-900 truncate mb-1">
                 <a [routerLink]="['/jobs', app.jobId]" class="hover:text-indigo-600 transition-colors">{{ app.jobTitle }}</a>
               </h3>
               <p class="text-gray-600 text-sm font-medium mb-1">
                 {{ app.companyName }}
               </p>
               <div class="flex items-center gap-4 text-xs text-gray-500">
                 <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 012-2V7a2 2 0 01-2-2H5a2 2 0 01-2 2v12a2 2 0 012 2z" /></svg>
                    Applied {{ app.createdAt | date:'mediumDate' }}
                 </span>
                 <span class="font-medium text-gray-400">CV: {{ app.cvFileName }}</span>
               </div>
             </div>
          </div>

          <!-- Status & AI Feedback -->
          <div class="md:w-60 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
             
             <!-- AI Match Preview -->
             <div *ngIf="app.compatibilityScore !== null" class="mb-1">
                <div class="flex items-center justify-between mb-1">
                   <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Match Score</span>
                   <span class="text-xs font-black text-indigo-700">{{ (app.compatibilityScore! * 1).toFixed(0) }}%</span>
                </div>
                <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                   <div class="bg-indigo-600 h-full rounded-full" [style.width.%]="app.compatibilityScore! * 1"></div>
                </div>
             </div>

             <div class="px-3 py-1.5 rounded-xl text-center text-xs font-bold transition-colors shadow-sm"
                [ngClass]="{
                   'bg-yellow-50 text-yellow-700 border border-yellow-100': app.status === 'Pending',
                   'bg-blue-50 text-blue-700 border border-blue-100': app.status === 'Reviewed',
                   'bg-indigo-50 text-indigo-700 border border-indigo-100': app.status === 'Interviewing',
                   'bg-green-50 text-green-700 border border-green-100': app.status === 'Accepted',
                   'bg-red-50 text-red-700 border border-red-100': app.status === 'Rejected'
                }">
                {{ app.status }}
             </div>

             <button *ngIf="app.compatibilityScore !== null" (click)="openFeedback(app)" class="w-full py-2 px-3 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-indigo-100/50">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                View AI Feedback
             </button>
             
             <button *ngIf="app.compatibilityScore === null" (click)="reAnalyze(app)" 
                [disabled]="analyzingAppId === app.id"
                class="w-full py-2 px-3 bg-gray-50 border border-gray-200 text-gray-600 text-[10px] font-bold rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-1 disabled:opacity-50">
                <svg *ngIf="analyzingAppId === app.id" class="animate-spin h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                <svg *ngIf="analyzingAppId !== app.id" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                {{ analyzingAppId === app.id ? 'Analyzing...' : 'Analyze Now' }}
             </button>
          </div>
        </div>
      </div>

      <!-- AI Feedback Modal -->
      <div *ngIf="selectedApp" class="fixed inset-0 z-50 flex items-center justify-center p-4">
         <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" (click)="selectedApp = null"></div>
         <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform animate-in fade-in slide-in-from-bottom-8 relative z-10">
            <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
               <div>
                  <h3 class="text-xl font-bold">AI CV Feedback</h3>
                  <p class="text-xs text-indigo-100 mt-1">For {{ selectedApp.jobTitle }} at {{ selectedApp.companyName }}</p>
               </div>
               <button (click)="selectedApp = null" class="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
            
            <div class="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
               <div class="flex items-center gap-6 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div class="w-20 h-20 bg-white text-indigo-600 rounded-xl flex flex-col items-center justify-center shadow-lg border border-indigo-50">
                     <span class="text-3xl font-black">{{ (selectedApp.compatibilityScore! * 1).toFixed(0) }}%</span>
                     <span class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Match</span>
                  </div>
                  <div>
                     <h4 class="font-bold text-gray-900 mb-1">Analityic Compatibility Score</h4>
                     <p class="text-sm text-gray-500 leading-relaxed">Our AI analyzed your CV against the specific requirements of this role. This score represents how well your professional experience aligns with the job profile.</p>
                  </div>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                     <span class="flex items-center text-[10px] font-bold text-green-600 uppercase tracking-widest gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                        Puncte Forte (Avantaje)
                     </span>
                     <ul class="space-y-3">
                        <li *ngFor="let adv of selectedApp.advantages" class="text-xs text-gray-700 bg-green-50/50 p-3 rounded-xl border border-green-50 flex items-start gap-2">
                           <span class="text-green-500 font-bold">•</span>
                           {{ adv }}
                        </li>
                     </ul>
                  </div>
                  <div class="space-y-4">
                     <span class="flex items-center text-[10px] font-bold text-red-500 uppercase tracking-widest gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
                        Puncte Slabe (Dezavantaje)
                     </span>
                     <ul class="space-y-3">
                        <li *ngFor="let dis of selectedApp.disadvantages" class="text-xs text-gray-700 bg-red-50/50 p-3 rounded-xl border border-red-50 flex items-start gap-2">
                           <span class="text-red-400 font-bold">•</span>
                           {{ dis }}
                        </li>
                     </ul>
                  </div>
               </div>
            </div>

            <div class="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
               <button (click)="selectedApp = null" class="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all">
                  Close Feedback
               </button>
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
export class AppliedJobsComponent implements OnInit {
  private applicationService = inject(ApplicationService);
  private candidateService = inject(CandidateService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  applications: ApplicationDto[] = [];
  isLoading = true;
  analyzingAppId: string | null = null;
  selectedApp: ApplicationDto | null = null;

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.candidateService.getByUserId(userId).pipe(
      switchMap(candidate => this.applicationService.getByCandidateId(candidate.id))
    ).subscribe({
      next: (apps) => {
        this.applications = apps;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load applications.');
        this.isLoading = false;
      }
    });
  }

  openFeedback(app: ApplicationDto) {
    this.selectedApp = app;
  }

  reAnalyze(app: ApplicationDto) {
    this.analyzingAppId = app.id;
    this.toastService.info('Starting AI analysis...');
    
    this.applicationService.reAnalyze(app.id).subscribe({
      next: (updated) => {
        this.toastService.success('Analysis complete!');
        this.analyzingAppId = null;
        const index = this.applications.findIndex(a => a.id === app.id);
        if (index !== -1) {
          this.applications[index] = updated;
        }
      },
      error: () => {
        this.toastService.error('Analysis failed. Please try again later.');
        this.analyzingAppId = null;
      }
    });
  }
}
