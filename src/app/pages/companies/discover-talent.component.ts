import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CandidateService } from '../../services/candidate.service';
import { CandidateDto } from '../../models/candidate.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-discover-talent',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 font-sans pb-20">
      
      <!-- Premium Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
           <h2 class="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
              Discover <span class="text-indigo-600">Top Talent</span>
           </h2>
           <p class="text-gray-500 mt-4 text-lg font-medium">Browse our pool of elite candidates and find your next game-changer.</p>
        </div>
        
        <div class="flex items-center gap-4">
           <div class="hidden sm:block text-right">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Available Candidates</p>
              <p class="text-2xl font-black text-gray-900">{{ candidates.length }}</p>
           </div>
        </div>
      </div>

      <div *ngIf="isLoading" class="flex flex-col items-center justify-center py-32 space-y-4">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">Searching talent pool...</p>
      </div>

      <!-- Talent Grid -->
      <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let candidate of candidates" 
             class="group bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-gray-50 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 flex flex-col items-center text-center">
           
           <div class="relative mb-6">
              <div class="w-24 h-24 bg-gradient-to-tr from-indigo-50 to-indigo-100 text-indigo-600 rounded-[2rem] flex items-center justify-center font-black text-4xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                 {{ candidate.firstName.charAt(0) }}{{ candidate.lastName.charAt(0) }}
              </div>
           </div>

           <h3 class="font-black text-2xl text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {{ candidate.fullName }}
           </h3>
           
           <p class="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">
              {{ candidate.location || 'Remote' }}
           </p>

           <div class="w-full space-y-3 mb-8 text-left">
              <div class="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-2xl">
                 <svg class="w-4 h-4 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                 <span class="truncate font-medium">{{ candidate.linkedInUrl ? 'LinkedIn Connected' : 'No LinkedIn' }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-500 bg-gray-100/40 p-3 rounded-2xl">
                 <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                 <span class="truncate font-medium">{{ candidate.gitHubUrl ? 'GitHub Active' : 'No GitHub' }}</span>
              </div>
           </div>

           <div class="mt-auto w-full">
              <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Candidate Assets</p>
              <div class="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                 <div class="text-center">
                    <p class="text-xl font-black text-gray-900 leading-tight">{{ candidate.cvsCount }}</p>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">CVs</p>
                 </div>
                 <div class="h-8 w-[1px] bg-gray-200"></div>
                 <div class="text-center">
                    <p class="text-xl font-black text-gray-900 leading-tight">{{ candidate.applicationsCount }}</p>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Applied</p>
                 </div>
              </div>
              
              <button class="w-full mt-6 bg-gray-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:bg-indigo-600 hover:shadow-indigo-100 flex items-center justify-center gap-2 group/btn">
                 View Portfolio
                 <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
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
export class DiscoverTalentComponent implements OnInit {
  private candidateService = inject(CandidateService);
  private toastService = inject(ToastService);

  candidates: CandidateDto[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.candidateService.getAll(1, 50).subscribe({
      next: (data) => {
        this.candidates = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load talent pool.');
        this.isLoading = false;
      }
    });
  }
}
