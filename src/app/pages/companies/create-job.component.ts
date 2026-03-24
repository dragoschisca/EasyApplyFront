import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CreateJobDto, UpdateJobDto } from '../../models/job.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-create-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      <div class="flex items-center gap-4">
        <a routerLink="/company-jobs" class="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 text-gray-500 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </a>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">{{ isEditMode ? 'Edit Job Posting' : 'Create New Job' }}</h2>
      </div>

      <div *ngIf="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>

      <form *ngIf="!isLoading" [formGroup]="jobForm" (ngSubmit)="onSubmit()" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
         <div class="p-8 space-y-8">
            
            <!-- Basic Details -->
            <div class="space-y-6">
              <h3 class="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Basic Details</h3>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                <input type="text" formControlName="title" placeholder="e.g. Senior Frontend Engineer" 
                  class="w-full px-4 py-3 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input type="text" formControlName="location" placeholder="e.g. Remote, New York, etc." 
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Detailed Address (for Map)</label>
                  <input type="text" formControlName="address" placeholder="e.g. Chisinau, bd. Moscova 5/1" 
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Employment Type *</label>
                  <select formControlName="type" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-white appearance-none">
                     <option value="" disabled>Select Type</option>
                     <option value="FullTime">Full-Time</option>
                     <option value="PartTime">Part-Time</option>
                     <option value="FlexibleTime">Flexible</option>
                     <option value="InTurns">In Shifts / Turns</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <input type="text" formControlName="category" placeholder="e.g. Engineering, Marketing..." 
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Salary Range Min-Max</label>
                  <div class="flex gap-2">
                    <input type="number" formControlName="salaryMin" placeholder="Min" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all">
                    <input type="number" formControlName="salaryMax" placeholder="Max" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all">
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label class="block text-sm font-semibold text-gray-700 mb-2">Experience Level *</label>
                   <select formControlName="experienceLevel" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-white appearance-none">
                      <option value="NoExperience">No Experience</option>
                      <option value="SmallExperience">Junior / Small Exp</option>
                      <option value="MediumExperience">Mid-Level / Medium Exp</option>
                      <option value="LargeExperience">Senior / Large Exp</option>
                   </select>
                 </div>
                 <div>
                   <label class="block text-sm font-semibold text-gray-700 mb-2">Work Mode *</label>
                   <select formControlName="locationType" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-white appearance-none">
                      <option [value]="0">On-site</option>
                      <option [value]="1">Remote</option>
                      <option [value]="2">Hybrid</option>
                   </select>
                 </div>
              </div>
            </div>

            <!-- Content -->
            <div class="space-y-6 pt-6">
               <h3 class="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Description & Requirements</h3>

               <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
                <textarea formControlName="description" rows="6" placeholder="Describe the role and responsibilities..." 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-y"></textarea>
               </div>

               <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Requirements *</label>
                <textarea formControlName="requirements" rows="6" placeholder="List the skills, experience, and qualifications needed..." 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-y"></textarea>
               </div>
            </div>
         </div>

         <div class="bg-gray-50 border-t border-gray-100 p-8 flex items-center justify-between">
           <button type="button" routerLink="/company-jobs" class="text-gray-500 hover:text-gray-800 font-bold py-3 px-6 transition-colors">
             Cancel
           </button>
           <button type="submit" [disabled]="jobForm.invalid || isSaving" class="bg-purple-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-50 flex items-center">
             <span *ngIf="isSaving" class="mr-2 animate-spin"><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg></span>
             {{ isEditMode ? 'Update Job' : 'Publish Job' }}
           </button>
         </div>
      </form>
    </div>
  `,
  styles: [`
    .animate-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class CreateJobComponent implements OnInit {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private companyService = inject(CompanyService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  jobForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    requirements: ['', Validators.required],
    location: ['', Validators.required],
    salaryMin: [0],
    salaryMax: [0],
    type: ['', Validators.required],
    category: ['', Validators.required],
    experienceLevel: ['MediumExperience', Validators.required],
    locationType: [0, Validators.required],
    address: ['']
  });

  isEditMode = false;
  jobId: string | null = null;
  companyId: string | null = null;
  isLoading = true;
  isSaving = false;

  ngOnInit() {
    this.jobId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.jobId;

    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    // Get company ID first
    this.companyService.getByUserId(userId).subscribe({
      next: (company) => {
        this.companyId = company.id;
        
        if (this.isEditMode && this.jobId) {
          this.loadJobDetails(this.jobId);
        } else {
          this.isLoading = false; // Add mode
        }
      },
      error: () => {
        this.toastService.error('Unauthorized. Company profile not found.');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loadJobDetails(id: string) {
    this.jobService.getById(id).subscribe({
      next: (job) => {
        // Enforce ownership slightly on frontend (backend must secure as well)
        if (job.companyId !== this.companyId) {
          this.toastService.error('You do not have permission to edit this job.');
          this.router.navigate(['/company-jobs']);
          return;
        }

        this.jobForm.patchValue({
          title: job.title,
          description: job.description,
          requirements: job.requirements,
          location: job.location,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          type: job.employmentType,
          category: job.category,
          experienceLevel: job.experienceLevel,
          locationType: job.locationType,
          address: job.address || ''
        });
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load job details.');
        this.router.navigate(['/company-jobs']);
      }
    });
  }

  onSubmit() {
    if (this.jobForm.valid && this.companyId) {
      this.isSaving = true;
      const vals = this.jobForm.value;

      if (this.isEditMode && this.jobId) {
        // Update
        const dto: UpdateJobDto = {
          title: vals.title!,
          description: vals.description!,
          requirements: vals.requirements!,
          location: vals.location!,
          salaryMin: vals.salaryMin || undefined,
          salaryMax: vals.salaryMax || undefined,
          employmentType: vals.type!,
          category: vals.category!,
          experienceLevel: vals.experienceLevel || 'MediumExperience',
          locationType: Number(vals.locationType || 0),
          address: vals.address || undefined,
          isActive: true
        };

        this.jobService.update(this.jobId, dto).subscribe({
          next: () => {
            this.toastService.success('Job updated successfully!');
            this.router.navigate(['/company-jobs']);
          },
          error: () => {
            this.toastService.error('Failed to update job.');
            this.isSaving = false;
          }
        });
      } else {
        // Create
        const dto: CreateJobDto = {
          title: vals.title!,
          description: vals.description!,
          requirements: vals.requirements!,
          location: vals.location!,
          salaryMin: vals.salaryMin || undefined,
          salaryMax: vals.salaryMax || undefined,
          employmentType: vals.type!,
          category: vals.category!,
          companyId: this.companyId,
          experienceLevel: vals.experienceLevel || 'MediumExperience',
          locationType: Number(vals.locationType || 0),
          address: vals.address || undefined,
          isActive: true
        };

        this.jobService.create(dto).subscribe({
          next: () => {
            this.toastService.success('Job published successfully!');
            this.router.navigate(['/company-jobs']);
          },
          error: () => {
            this.toastService.error('Failed to publish job.');
            this.isSaving = false;
          }
        });
      }
    }
  }
}
