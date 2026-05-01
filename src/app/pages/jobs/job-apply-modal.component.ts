import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ApplicationService } from "../../services/application.service";
import { CvService } from "../../services/cv.service";
import { ToastService } from "../../core/services/toast.service";
import { AuthService } from "../../core/services/auth.service";
import { CandidateService } from "../../services/candidate.service";
import { CreateApplicationDto } from "../../models/application.model";
import { CvDto } from "../../models/cv.model";
import { switchMap } from "rxjs";

@Component({
  selector: "app-job-apply-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-500 animate-in fade-in"
        (click)="close()"
      ></div>

      <!-- Modal Panel -->
      <div
        class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden transform transition-all z-10 animate-in zoom-in-95 duration-300"
      >
        <!-- Header -->
        <div
          class="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
        >
          <div>
            <div class="flex items-center gap-3 mb-1">
              <span class="w-2 h-6 bg-indigo-600 rounded-full"></span>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight">
                Apply for Role
              </h3>
            </div>
            <p class="text-sm font-bold text-slate-400 ml-5">{{ jobTitle }}</p>
          </div>
          <button
            (click)="close()"
            class="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          *ngIf="isLoading"
          class="flex flex-col items-center justify-center p-20 space-y-4"
        >
          <div
            class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
          ></div>
          <p
            class="text-xs font-black text-slate-400 uppercase tracking-widest"
          >
            Preparing application...
          </p>
        </div>

        <form
          *ngIf="!isLoading"
          [formGroup]="applyForm"
          (ngSubmit)="submitApplication()"
          class="p-10 space-y-8"
        >
          <!-- Resume Selection Toggle -->
          <div class="space-y-4">
            <label
              class="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4"
              >Choose your Resume</label
            >

            <div
              class="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl mb-6"
            >
              <button
                type="button"
                (click)="setUseExisting(true)"
                [class]="
                  useExistingCv
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                "
                class="py-3 px-4 rounded-xl text-sm font-black transition-all"
              >
                Existing CV
              </button>
              <button
                type="button"
                (click)="setUseExisting(false)"
                [class]="
                  !useExistingCv
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                "
                class="py-3 px-4 rounded-xl text-sm font-black transition-all"
              >
                Upload New
              </button>
            </div>

            <!-- Existing CV List -->
            <div *ngIf="useExistingCv" class="space-y-3">
              <div
                *ngIf="cvs.length === 0"
                class="text-sm font-bold text-amber-600 bg-amber-50 p-6 rounded-[1.5rem] border border-amber-100 flex items-center gap-4"
              >
                <svg
                  class="w-6 h-6 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span
                  >No CVs found in your profile. Please upload a new one to
                  continue.</span
                >
              </div>

              <div
                *ngFor="let cv of cvs"
                (click)="applyForm.patchValue({ cvId: cv.id })"
                [class]="
                  applyForm.get('cvId')?.value === cv.id
                    ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/10'
                    : 'border-slate-100 bg-white hover:border-slate-300'
                "
                class="p-4 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center"
                    [class]="
                      applyForm.get('cvId')?.value === cv.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                    "
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-black text-slate-900 truncate">
                      {{ cv.fileName }}
                    </p>
                    <p
                      class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                    >
                      {{ cv.uploadedAt | date : "mediumDate" }} •
                      {{ cv.isDefault ? "Primary" : "Backup" }}
                    </p>
                  </div>
                </div>
                <div
                  *ngIf="applyForm.get('cvId')?.value === cv.id"
                  class="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white"
                >
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Upload New Field -->
            <div
              *ngIf="!useExistingCv"
              class="animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div class="relative group">
                <input
                  type="file"
                  (change)="onFileSelected($event)"
                  accept=".pdf,.doc,.docx"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  class="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center group-hover:border-indigo-400 group-hover:bg-indigo-50/30 transition-all"
                >
                  <div
                    class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"
                  >
                    <svg
                      class="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p class="text-sm font-black text-slate-900 mb-1">
                    {{
                      selectedFile ? selectedFile.name : "Drop your resume here"
                    }}
                  </p>
                  <p class="text-xs font-bold text-slate-400">
                    PDF, DOC up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Cover Letter -->
          <div class="space-y-4">
            <label
              class="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-[0.2em]"
            >
              Cover Letter
              <span class="font-bold lowercase text-slate-300">Optional</span>
            </label>
            <textarea
              formControlName="coverLetter"
              rows="4"
              placeholder="Briefly describe why you are the perfect candidate..."
              class="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700 font-medium"
            ></textarea>
          </div>

          <div class="pt-6 flex gap-4">
            <button
              type="button"
              (click)="close()"
              class="flex-1 py-5 px-4 text-slate-400 font-black text-sm uppercase tracking-widest hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="
                (useExistingCv && !applyForm.get('cvId')?.value) ||
                (!useExistingCv && !selectedFile) ||
                isSubmitting
              "
              class="flex-[2] py-5 px-4 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
            >
              <span *ngIf="isSubmitting" class="mr-3 animate-spin"
                ><svg
                  class="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path></svg
              ></span>
              {{ isSubmitting ? "Processing..." : "Submit Application" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .animate-in {
        animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class JobApplyModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() jobId: string = "";
  @Input() jobTitle: string = "";
  @Output() closeEvent = new EventEmitter<void>();
  @Output() applySuccessEvent = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private applicationService = inject(ApplicationService);
  private candidateService = inject(CandidateService);
  private cvService = inject(CvService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  applyForm = this.fb.group({
    cvId: [""],
    coverLetter: [""],
  });

  candidateId: string = "";
  cvs: CvDto[] = [];
  isLoading = false;
  isSubmitting = false;

  useExistingCv = true;
  selectedFile: File | null = null;

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
    this.candidateService
      .getByUserId(userId)
      .pipe(
        switchMap((candidate) => {
          this.candidateId = candidate.id;
          return this.cvService.getByCandidateId(candidate.id);
        })
      )
      .subscribe({
        next: (cvs) => {
          this.cvs = cvs;
          if (cvs.length > 0) {
            const primaryCv = cvs.find((c) => c.isDefault);
            this.applyForm.patchValue({
              cvId: primaryCv ? primaryCv.id : cvs[0].id,
            });
          } else {
            this.useExistingCv = false;
          }
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error("Failed to load your profile details.");
          this.isLoading = false;
          this.close();
        },
      });
  }

  setUseExisting(val: boolean) {
    this.useExistingCv = val;
    if (val && this.cvs.length > 0 && !this.applyForm.get("cvId")?.value) {
      const primaryCv = this.cvs.find((c) => c.isDefault);
      this.applyForm.patchValue({
        cvId: primaryCv ? primaryCv.id : this.cvs[0].id,
      });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  close() {
    this.applyForm.reset();
    this.selectedFile = null;
    this.closeEvent.emit();
  }

  submitApplication() {
    if (!this.candidateId || !this.jobId) return;

    this.isSubmitting = true;
    const vals = this.applyForm.value;

    if (this.useExistingCv) {
      if (!vals.cvId) {
        this.toastService.error("Please select a CV.");
        this.isSubmitting = false;
        return;
      }
      this.createApplication(vals.cvId, vals.coverLetter || "");
    } else {
      if (!this.selectedFile) {
        this.toastService.error("Please upload a CV.");
        this.isSubmitting = false;
        return;
      }

      // First upload the new CV
      this.cvService
        .upload(
          this.candidateId,
          this.selectedFile.name.split(".")[0],
          this.selectedFile,
          false
        )
        .subscribe({
          next: (cv) => {
            this.createApplication(cv.id, vals.coverLetter || "");
          },
          error: () => {
            this.toastService.error("Failed to upload CV. Please try again.");
            this.isSubmitting = false;
          },
        });
    }
  }

  private createApplication(cvId: string, coverLetter: string) {
    const dto: CreateApplicationDto = {
      jobId: this.jobId,
      cvId: cvId,
      coverLetter: coverLetter,
    };

    this.applicationService.create(this.candidateId, dto).subscribe({
      next: () => {
        this.toastService.success("Application submitted successfully!");
        this.isSubmitting = false;
        this.applySuccessEvent.emit();
        this.close();
      },
      error: (err) => {
        this.toastService.error(
          err.error?.message ||
            "Failed to submit application. Did you already apply?"
        );
        this.isSubmitting = false;
      },
    });
  }
}
