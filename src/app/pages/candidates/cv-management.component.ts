import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CvService } from '../../services/cv.service';
import { CandidateService } from '../../services/candidate.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CvDto } from '../../models/cv.model';
import { CandidateDto } from '../../models/candidate.model';
import { forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-cv-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
           <h2 class="text-3xl font-bold text-gray-900 tracking-tight">CV Management</h2>
           <p class="text-gray-500 mt-1">Upload and manage your resumes for quick applications.</p>
        </div>
        <button (click)="openUploadModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center">
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Upload New CV
        </button>
      </div>

      <div *ngIf="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && cvs.length === 0" class="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-16 text-center">
        <div class="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400">
          <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No resumés found</h3>
        <p class="text-gray-500 mb-8 max-w-sm mx-auto">You haven't uploaded any CVs yet. Add one now to start applying.</p>
        <button (click)="openUploadModal()" class="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold py-3 px-8 rounded-xl transition-all">
          Upload CV
        </button>
      </div>

      <!-- CVs List -->
      <div *ngIf="!isLoading && cvs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let cv of cvs" class="bg-white p-6 rounded-2xl shadow-sm border transition-all hover:shadow-lg relative min-h-[200px] flex flex-col justify-between"
             [ngClass]="cv.isDefault ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-gray-100'">
             
           <div *ngIf="cv.isDefault" class="absolute -top-3 left-6 px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
             Primary
           </div>

           <div>
             <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mb-4">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
             </div>
             <h3 class="font-bold text-gray-900 text-lg mb-1 truncate" [title]="cv.fileName">{{ cv.fileName }}</h3>
             <p class="text-sm text-gray-500">Uploaded on {{ cv.uploadedAt | date:'mediumDate' }}</p>
           </div>

           <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <button *ngIf="!cv.isDefault" (click)="setPrimary(cv.id)" class="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                 Set as Primary
              </button>
              <span *ngIf="cv.isDefault" class="text-sm font-medium text-gray-400">Default CV</span>
              
              <button (click)="deleteCv(cv.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
           </div>
        </div>
      </div>

      <!-- Upload Modal (Simulated Upload) -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">Upload CV</h3>
            <button (click)="closeUploadModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <form [formGroup]="uploadForm" (ngSubmit)="submitUpload()" class="p-6">
             <div class="mb-6">
                <!-- In a real app, this would be a file input. Here we simulate for API shape matching CreateCvDto -->
                <label class="block text-sm font-semibold text-gray-700 mb-2">CV Name / Title</label>
                <input type="text" formControlName="fileName" placeholder="E.g., Senior Full Stack Dev Resume" 
                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
             </div>

             <div class="mb-6">
                <!-- Real File Input -->
                <label class="block text-sm font-semibold text-gray-700 mb-2">CV File (PDF, DOC, DOCX)</label>
                <input type="file" (change)="onFileSelected($event)" accept=".pdf,.doc,.docx" 
                   class="w-full px-4 py-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all border border-gray-200 rounded-xl">
             </div>

             <label class="flex items-center text-sm font-medium text-gray-700 mb-6 cursor-pointer group">
               <input type="checkbox" formControlName="isPrimary" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2 transition-all">
               Set as Primary CV
             </label>

             <div class="flex gap-3 pt-2">
               <button type="button" (click)="closeUploadModal()" class="flex-1 py-3 px-4 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
               <button type="submit" [disabled]="uploadForm.invalid || isUploading" class="flex-1 py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50">
                  <span *ngIf="isUploading" class="mr-2 animate-spin"><svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg></span>
                  Upload
               </button>
             </div>
          </form>
        </div>
      </div>
      
    </div>
  `,
  styles: [`
    .animate-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class CvManagementComponent implements OnInit {
  private cvService = inject(CvService);
  private candidateService = inject(CandidateService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  cvs: CvDto[] = [];
  isLoading = true;
  candidateId: string = '';

  isModalOpen = false;
  isUploading = false;
  selectedFile: File | null = null;
  
  uploadForm = this.fb.group({
    fileName: ['', Validators.required],
    isPrimary: [false]
  });

  ngOnInit() {
    this.loadCandidateIdAndCvs();
  }

  loadCandidateIdAndCvs() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.candidateService.getByUserId(userId).pipe(
      switchMap(candidate => {
        this.candidateId = candidate.id;
        return this.cvService.getByCandidateId(candidate.id);
      })
    ).subscribe({
      next: (cvs) => {
        this.cvs = cvs;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load CVs.');
        this.isLoading = false;
      }
    });
  }

  openUploadModal() {
    this.uploadForm.reset({ isPrimary: this.cvs.length === 0 });
    this.selectedFile = null;
    this.isModalOpen = true;
  }

  closeUploadModal() {
    this.isModalOpen = false;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      if (!this.uploadForm.get('fileName')?.value) {
        this.uploadForm.patchValue({ fileName: file.name.split('.')[0] });
      }
    }
  }

  submitUpload() {
    if (this.uploadForm.valid && this.candidateId && this.selectedFile) {
      this.isUploading = true;
      const vals = this.uploadForm.value;
      
      this.cvService.upload(this.candidateId, vals.fileName!, this.selectedFile, vals.isPrimary || false).subscribe({
        next: (createdCv: CvDto) => {
           this.cvs.push(createdCv);
           this.toastService.success('CV uploaded successfully!');
           this.closeUploadModal();
           this.isUploading = false;
        },
        error: () => {
           this.toastService.error('Failed to upload CV.');
           this.isUploading = false;
        }
      });
    } else if (!this.selectedFile) {
      this.toastService.error('Please select a file to upload.');
    }
  }

  setPrimary(cvId: string) {
    if (!this.candidateId) return;
    this.cvService.setDefault(this.candidateId, cvId).subscribe({
      next: () => {
        this.cvs.forEach(c => c.isDefault = (c.id === cvId));
        this.toastService.success('Primary CV updated.');
      },
      error: () => this.toastService.error('Failed to update primary CV.')
    });
  }

  deleteCv(id: string) {
    if (confirm('Are you sure you want to delete this CV?')) {
      this.cvService.delete(id).subscribe({
        next: () => {
          this.cvs = this.cvs.filter(c => c.id !== id);
          this.toastService.success('CV deleted.');
        },
        error: () => this.toastService.error('Failed to delete CV.')
      });
    }
  }
}
