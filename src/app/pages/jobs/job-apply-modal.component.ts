import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationService } from '../../services/application.service';
import { CvService } from '../../services/cv.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { CandidateService } from '../../services/candidate.service';
import { CreateApplicationDto } from '../../models/application.model';
import { CvDto } from '../../models/cv.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-job-apply-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" (click)="close()"></div>
      
      <!-- Modal Panel -->
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all z-10 animate-in fade-in slide-in-from-bottom-8">
        
        <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 class="text-2xl font-black text-gray-900">Apply for Role</h3>
            <p class="text-sm font-medium text-gray-500 mt-1">{{ jobTitle }}</p>
          </div>
          <button (click)="close()" class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div *ngIf="isLoading" class="flex justify-center p-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>

        <form *ngIf="!isLoading" [formGroup]="applyForm" (ngSubmit)="submitApplication()" class="p-8 space-y-6">
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Select Resume</label>
            <div *ngIf="cvs.length === 0" class="text-sm text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 mb-2">
              You don't have any CVs uploaded. Please go to your profile to upload one before applying.
            </div>
            <select *ngIf="cvs.length > 0" formControlName="cvId" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all appearance-none cursor-pointer bg-white text-gray-800 font-medium shadow-sm">
               <option value="" disabled>Select a CV to attach</option>
               <option *ngFor="let cv of cvs" [value]="cv.id">{{ cv.fileName }} {{ cv.isDefault ? '(Primary)' : '' }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide flex justify-between">
              Cover Letter
              <span class="text-xs text-gray-400 font-medium normal-case">Optional</span>
            </label>
            <textarea formControlName="coverLetter" rows="5" placeholder="Why are you a great fit for this role?" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all resize-y shadow-sm text-gray-800"></textarea>
          </div>

          <div class="pt-4 flex gap-3">
             <button type="button" (click)="close()" class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
               Cancel
             </button>
             <button type="submit" [disabled]="applyForm.invalid || isSubmitting || cvs.length === 0" 
                class="flex-1 py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50">
               <span *ngIf="isSubmitting" class="mr-2 animate-spin"><svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg></span>
               Submit Application
             </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .animate-in { animation: fadeIn 0.3s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
  `]
})
export class JobApplyModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() jobId: string = '';
  @Input() jobTitle: string = '';
  @Output() closeEvent = new EventEmitter<void>();
  @Output() applySuccessEvent = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private applicationService = inject(ApplicationService);
  private candidateService = inject(CandidateService);
  private cvService = inject(CvService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  applyForm = this.fb.group({
    cvId: ['', Validators.required],
    coverLetter: ['']
  });

  candidateId: string = '';
  cvs: CvDto[] = [];
  isLoading = false;
  isSubmitting = false;

  ngOnInit() {
    if (this.isOpen) {
      this.loadCandidateData();
    }
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.loadCandidateData();
    }
  }

  loadCandidateData() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.isLoading = true;
    this.candidateService.getByUserId(userId).pipe(
      switchMap(candidate => {
        this.candidateId = candidate.id;
        return this.cvService.getByCandidateId(candidate.id);
      })
    ).subscribe({
      next: (cvs) => {
        this.cvs = cvs;
        if (cvs.length > 0) {
          const primaryCv = cvs.find(c => c.isDefault);
          this.applyForm.patchValue({ cvId: primaryCv ? primaryCv.id : cvs[0].id });
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load your profile details.');
        this.isLoading = false;
        this.close();
      }
    });
  }

  close() {
    this.applyForm.reset();
    this.closeEvent.emit();
  }

  submitApplication() {
    if (this.applyForm.valid && this.candidateId && this.jobId) {
      this.isSubmitting = true;
      const vals = this.applyForm.value;
      
      const dto: CreateApplicationDto = {
        jobId: this.jobId,
        cvId: vals.cvId!,
        coverLetter: vals.coverLetter || ''
      };

      this.applicationService.create(this.candidateId, dto).subscribe({
        next: () => {
          this.toastService.success('Application submitted successfully!');
          this.isSubmitting = false;
          this.applySuccessEvent.emit();
          this.close();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to submit application. Did you already apply?');
          this.isSubmitting = false;
        }
      });
    }
  }
}
