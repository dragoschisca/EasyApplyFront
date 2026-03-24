import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { CreateJobDto, UpdateJobDto } from '../../models/job.model';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-4">
        <a routerLink="/jobs" class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">{{ isEditMode ? 'Edit Job Posting' : 'Create New Job Listing' }}</h2>
      </div>

      <div *ngIf="isLoading" class="flex justify-center items-center py-20">
         <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
         </svg>
      </div>

      <div *ngIf="!isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 sm:p-10">
          <form [formGroup]="jobForm" (ngSubmit)="onSubmit()" class="space-y-8">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input type="text" formControlName="title" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" placeholder="e.g. Senior Software Engineer">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select formControlName="category" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white">
                  <option value="">Select Category</option>
                  <option value="IT / Software">IT / Software</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Design">Design</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea formControlName="description" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" placeholder="Describe the responsibilities..."></textarea>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea formControlName="requirements" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" placeholder="List the requirements..."></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City / Region</label>
                <input type="text" formControlName="location" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" placeholder="e.g. Chisinau">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                <select formControlName="locationType" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white">
                  <option [value]="0">Remote</option>
                  <option [value]="1">On-site</option>
                  <option [value]="2">Hybrid</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Exact Address (for Map)</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  </span>
                  <input type="text" formControlName="address" class="w-full pl-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" placeholder="e.g. bd. Moscova 5/1, Chisinau">
                </div>
                <p class="mt-1 text-xs text-gray-400">Specify the exact address to show a precise marker on the map.</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Salary (Optional)</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input type="number" formControlName="salaryMin" class="w-full pl-8 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" placeholder="0">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Maximum Salary (Optional)</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input type="number" formControlName="salaryMax" class="w-full pl-8 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" placeholder="0">
                </div>
              </div>

              <!-- Dummy company field logic since user might not be logged in fully or company system structure might need a select dropdown in real life. We'll use a fixed UUID or hidden input if they have one company linked -->
              <div class="md:col-span-2" *ngIf="!isEditMode">
                <label class="block text-sm font-medium text-gray-700 mb-1">Company ID (UUID)</label>
                <input type="text" formControlName="companyId" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm text-gray-500 bg-gray-50" placeholder="00000000-0000-0000-0000-000000000000" title="Usually fetched from logged in user's profile automatically">
                <p class="mt-1 text-xs text-gray-500">Provide a valid UUID of your company.</p>
              </div>
              
              <div class="flex items-center mb-4">
                  <input id="isActive" type="checkbox" formControlName="isActive" class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                  <label for="isActive" class="ml-3 block text-sm font-medium text-gray-700">Make job active immediately</label>
              </div>

            </div>

            <!-- Error Notification -->
            <div *ngIf="errorMsg" class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ errorMsg }}</p>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
              <button type="button" routerLink="/jobs" class="px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                Cancel
              </button>
              <button type="submit" [disabled]="jobForm.invalid || isSaving" class="px-6 py-3 border border-transparent shadow-sm text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 inline-flex items-center">
                <span *ngIf="isSaving" class="mr-2">
                   <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                </span>
                {{ isSaving ? 'Saving...' : (isEditMode ? 'Update Job' : 'Publish Job') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class JobFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  jobId: string | null = null;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMsg = '';

  jobForm = this.fb.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    requirements: ['', Validators.required],
    location: ['', Validators.required],
    locationType: [1, Validators.required], // Default to Local (1)
    address: [''],
    employmentType: ['Full-Time', Validators.required],
    experienceLevel: ['Mid Level', Validators.required],
    salaryMin: [null],
    salaryMax: [null],
    companyId: ['', [Validators.required]],
    isActive: [true]
  });

  ngOnInit() {
    this.jobId = this.route.snapshot.paramMap.get('id');
    
    if (this.jobId) {
      this.isEditMode = true;
      this.jobForm.get('companyId')?.clearValidators();
      this.jobForm.get('companyId')?.updateValueAndValidity();
      this.loadJob(this.jobId);
    }
  }

  loadJob(id: string) {
    this.isLoading = true;
    this.jobService.getById(id).subscribe({
      next: (job) => {
        this.jobForm.patchValue({
          title: job.title,
          category: job.category,
          description: job.description,
          requirements: job.requirements,
          location: job.location!,
          locationType: job.locationType,
          address: job.address || '',
          employmentType: job.employmentType as any,
          experienceLevel: job.experienceLevel as any,
          salaryMin: job.salaryMin as any,
          salaryMax: job.salaryMax as any,
          isActive: job.isActive
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load job details.';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.jobForm.invalid) return;

    this.isSaving = true;
    this.errorMsg = '';
    const formVals = this.jobForm.value;

    if (this.isEditMode) {
      const updateData: UpdateJobDto = {
        title: formVals.title!,
        category: formVals.category!,
        description: formVals.description!,
        requirements: formVals.requirements!,
        location: formVals.location!,
        locationType: formVals.locationType || 1,
        address: formVals.address || undefined,
        employmentType: formVals.employmentType as any,
        experienceLevel: formVals.experienceLevel as any,
        salaryMin: formVals.salaryMin || undefined,
        salaryMax: formVals.salaryMax || undefined,
        isActive: formVals.isActive || false
      };

      this.jobService.update(this.jobId!, updateData).subscribe({
        next: () => this.router.navigate(['/jobs']),
        error: (err: any) => {
          this.isSaving = false;
          this.errorMsg = err.error?.message || 'Failed to update job';
        }
      });
    } else {
      const createData: CreateJobDto = {
        title: formVals.title!,
        category: formVals.category!,
        description: formVals.description!,
        requirements: formVals.requirements!,
        location: formVals.location!,
        locationType: formVals.locationType || 1,
        address: formVals.address || undefined,
        employmentType: formVals.employmentType as any,
        experienceLevel: formVals.experienceLevel as any,
        salaryMin: formVals.salaryMin || undefined,
        salaryMax: formVals.salaryMax || undefined,
        companyId: formVals.companyId!,
        isActive: formVals.isActive || false
      };

      this.jobService.create(createData).subscribe({
        next: () => this.router.navigate(['/jobs']),
        error: (err: any) => {
          this.isSaving = false;
          this.errorMsg = err.error?.message?.title || 'Failed to create job';
        }
      });
    }
  }
}
