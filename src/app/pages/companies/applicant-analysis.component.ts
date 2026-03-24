import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { ApplicationDto } from '../../models/application.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-applicant-analysis',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <button (click)="goBack()" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-2 transition-colors">
             <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Back to Applicants
           </button>
           <h2 class="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              CV Analysis Detail
           </h2>
        </div>
        
        <button (click)="reAnalyze()" [disabled]="isAnalyzing" class="bg-indigo-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2 min-w-[160px] justify-center">
            <svg *ngIf="isAnalyzing" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
            <svg *ngIf="!isAnalyzing" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {{ isAnalyzing ? 'Analyzing...' : 'Refresh Analysis' }}
        </button>
      </div>

      <div *ngIf="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div *ngIf="!isLoading && application" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left: Candidate & Job Info -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
             <div class="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-bold text-3xl mb-6 mx-auto">
                {{ application.candidateName.charAt(0) || 'C' }}
             </div>
             <h3 class="text-2xl font-bold text-center text-gray-900 mb-1">{{ application.candidateName || 'Candidate' }}</h3>
             <p class="text-gray-500 text-center text-sm mb-6">Applied for {{ application.jobTitle }}</p>
             
             <div class="space-y-4 border-t border-gray-50 pt-6">
                <div>
                  <span class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</span>
                  <span class="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                    {{ application.status }}
                  </span>
                </div>
                <div>
                  <span class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Applied On</span>
                  <p class="text-sm font-medium text-gray-700">{{ application.createdAt | date:'mediumDate' }}</p>
                </div>
                <div>
                   <span class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">CV File</span>
                   <a (click)="viewCv()" class="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-1 group">
                      {{ application.cvFileName }}
                      <svg class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                   </a>
                </div>
             </div>
          </div>

          <div *ngIf="application.compatibilityScore !== null" class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white text-center shadow-xl shadow-indigo-200">
             <p class="text-indigo-100 text-sm font-bold uppercase tracking-widest mb-2">Match Score</p>
             <div class="text-6xl font-black mb-2">{{ (application.compatibilityScore! * 1).toFixed(0) }}<span class="text-2xl opacity-60">%</span></div>
             <p class="text-indigo-100/80 text-xs px-4">Based on professional AI analysis comparing CV against Job Description</p>
          </div>
        </div>

        <!-- Right: Detailed Analysis -->
        <div class="lg:col-span-2 space-y-8">
          
          <div *ngIf="application.compatibilityScore === null && !isAnalyzing" class="bg-yellow-50 border border-yellow-100 rounded-3xl p-10 text-center">
             <div class="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             </div>
             <h3 class="text-xl font-bold text-gray-900 mb-2">No Analysis Available</h3>
             <p class="text-gray-500 mb-6">This application hasn't been analyzed by CvCheck yet, or the analysis failed.</p>
             <button (click)="reAnalyze()" class="bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-all">
                Analyze Now
             </button>
          </div>

          <!-- Advantages Section -->
          <div *ngIf="application.advantages && application.advantages.length > 0" class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in slide-in-from-right duration-500">
             <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span class="p-2 bg-green-100 text-green-600 rounded-lg">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
                Puncte Forte (Avantaje)
             </h3>
             <ul class="space-y-4">
               <li *ngFor="let adv of application.advantages" class="flex gap-4 p-4 bg-green-50/30 rounded-2xl border border-green-50">
                  <span class="text-green-500 font-bold text-lg">•</span>
                  <p class="text-gray-700 font-medium">{{ adv }}</p>
               </li>
             </ul>
          </div>

          <!-- Disadvantages Section -->
          <div *ngIf="application.disadvantages && application.disadvantages.length > 0" class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in slide-in-from-right duration-700">
             <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span class="p-2 bg-red-100 text-red-600 rounded-lg">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </span>
                Puncte Slabe (Dezavantaje)
             </h3>
             <ul class="space-y-4">
               <li *ngFor="let dis of application.disadvantages" class="flex gap-4 p-4 bg-red-50/30 rounded-2xl border border-red-50">
                  <span class="text-red-400 font-bold text-lg">•</span>
                  <p class="text-gray-700 font-medium">{{ dis }}</p>
               </li>
             </ul>
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
export class ApplicantAnalysisComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private applicationService = inject(ApplicationService);
  private toastService = inject(ToastService);

  applicationId: string | null = null;
  application: ApplicationDto | null = null;
  isLoading = true;
  isAnalyzing = false;

  viewCv() {
    if (!this.application?.cvPath) return;
    const baseUrl = 'http://localhost:5077'; // Fallback base URL
    window.open(`${baseUrl}${this.application.cvPath}`, '_blank');
  }

  ngOnInit() {
    this.applicationId = this.route.snapshot.paramMap.get('id');
    if (this.applicationId) {
      this.loadApplication();
    }
  }

  loadApplication() {
    if (!this.applicationId) return;
    this.isLoading = true;
    this.applicationService.getById(this.applicationId).subscribe({
      next: (app) => {
        this.application = app;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load application analysis.');
        this.isLoading = false;
      }
    });
  }

  reAnalyze() {
    if (!this.applicationId) return;
    this.isAnalyzing = true;
    this.applicationService.reAnalyze(this.applicationId).subscribe({
      next: (app) => {
        this.application = app;
        this.isAnalyzing = false;
        this.toastService.success('Analysis refreshed successfully!');
      },
      error: () => {
        this.toastService.error('Failed to re-analyze CV.');
        this.isAnalyzing = false;
      }
    });
  }

  goBack() {
    window.history.back();
  }
}
