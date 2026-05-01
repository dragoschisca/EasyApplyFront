import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CvService } from "../../services/cv.service";
import { CandidateService } from "../../services/candidate.service";
import { AuthService } from "../../core/services/auth.service";
import { ToastService } from "../../core/services/toast.service";
import { CvDto } from "../../models/cv.model";
import { CandidateDto } from "../../models/candidate.model";
import { forkJoin, of, switchMap } from "rxjs";

@Component({
  selector: "app-cv-management",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 font-sans px-4 pb-20"
    >
      <div
        class="flex items-center justify-between flex-wrap gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"
      >
        <div>
          <h2
            class="text-3xl font-black text-slate-900 tracking-tight mb-2 flex items-center gap-3"
          >
            <div class="w-2 h-8 bg-indigo-600 rounded-full"></div>
            CV Management
          </h2>
          <p class="text-slate-500 font-medium ml-5">
            Upload and manage your professional resumes for quick applications.
          </p>
        </div>
        <button
          (click)="openUploadModal()"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center group"
        >
          <svg
            class="h-5 w-5 mr-3 group-hover:translate-y-[-2px] transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Upload New CV
        </button>
      </div>

      <div
        *ngIf="isLoading"
        class="flex flex-col items-center justify-center py-32 space-y-4"
      >
        <div
          class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="text-xs font-black text-slate-400 uppercase tracking-widest">
          Loading Resumes...
        </p>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="!isLoading && cvs.length === 0"
        class="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-20 text-center"
      >
        <div
          class="bg-slate-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-300"
        >
          <svg
            class="h-12 w-12"
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
        <h3 class="text-2xl font-black text-slate-900 mb-3 tracking-tight">
          Your Resume Vault is Empty
        </h3>
        <p class="text-slate-500 mb-10 max-w-sm mx-auto font-medium">
          You haven't uploaded any CVs yet. Add your first one to start applying
          to premium roles.
        </p>
        <button
          (click)="openUploadModal()"
          class="bg-slate-900 text-white font-black py-4 px-10 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
        >
          Upload your first CV
        </button>
      </div>

      <!-- CVs List -->
      <div
        *ngIf="!isLoading && cvs.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div
          *ngFor="let cv of cvs"
          class="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 relative flex flex-col justify-between overflow-hidden"
          [ngClass]="
            cv.isDefault ? 'border-indigo-200 ring-4 ring-indigo-50' : ''
          "
        >
          <div
            *ngIf="cv.isDefault"
            class="absolute top-0 right-0 px-5 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl shadow-sm"
          >
            Primary
          </div>

          <div>
            <div
              class="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"
            >
              <svg
                class="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3
              class="font-black text-slate-900 text-xl mb-2 truncate"
              [title]="cv.fileName"
            >
              {{ cv.fileName }}
            </h3>
            <p
              class="text-sm font-bold text-slate-400 uppercase tracking-widest"
            >
              Added {{ cv.uploadedAt | date : "mediumDate" }}
            </p>
          </div>

          <div
            class="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between"
          >
            <button
              *ngIf="!cv.isDefault"
              (click)="setPrimary(cv.id)"
              class="text-sm font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
            >
              Set as Primary
            </button>
            <span
              *ngIf="cv.isDefault"
              class="text-sm font-black text-slate-300 uppercase tracking-widest"
              >Selected CV</span
            >

            <button
              (click)="deleteCv(cv.id)"
              class="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Upload Modal -->
      <div
        *ngIf="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in"
      >
        <div
          class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
        >
          <div
            class="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30"
          >
            <h3 class="text-xl font-black text-slate-900 tracking-tight">
              Upload New Resume
            </h3>
            <button
              (click)="closeUploadModal()"
              class="text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-white transition-all shadow-sm border border-transparent hover:border-slate-100"
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

          <form
            [formGroup]="uploadForm"
            (ngSubmit)="submitUpload()"
            class="p-10 space-y-8"
          >
            <div class="space-y-3">
              <label
                class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1"
                >Resume Title</label
              >
              <input
                type="text"
                formControlName="fileName"
                placeholder="e.g. Senior Product Designer"
                class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 shadow-inner"
              />
            </div>

            <div class="space-y-3">
              <label
                class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1"
                >Select File</label
              >
              <div class="relative group">
                <input
                  type="file"
                  (change)="onFileSelected($event)"
                  accept=".pdf,.doc,.docx"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  class="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all"
                >
                  <div
                    class="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all"
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
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p
                    class="text-sm font-black text-slate-900 mb-1 truncate px-4"
                  >
                    {{ selectedFile ? selectedFile.name : "Choose file" }}
                  </p>
                  <p
                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                  >
                    PDF, DOC, DOCX
                  </p>
                </div>
              </div>
            </div>

            <label
              class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl cursor-pointer group hover:bg-slate-100 transition-colors"
            >
              <input
                type="checkbox"
                formControlName="isPrimary"
                class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded-lg transition-all"
              />
              <span
                class="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors"
                >Set as my Primary Resume</span
              >
            </label>

            <div class="flex gap-4 pt-4">
              <button
                type="button"
                (click)="closeUploadModal()"
                class="flex-1 py-4 bg-slate-50 text-slate-400 font-black text-sm uppercase tracking-widest rounded-2xl hover:text-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="uploadForm.invalid || isUploading || !selectedFile"
                class="flex-[2] py-4 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-30 flex items-center justify-center"
              >
                <span *ngIf="isUploading" class="mr-3 animate-spin"
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
                {{ isUploading ? "Uploading..." : "Confirm Upload" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background: #f8fafc;
        min-height: 100vh;
      }
      .animate-in {
        animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
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
export class CvManagementComponent implements OnInit {
  private cvService = inject(CvService);
  private candidateService = inject(CandidateService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  cvs: CvDto[] = [];
  isLoading = true;
  candidateId: string = "";

  isModalOpen = false;
  isUploading = false;
  selectedFile: File | null = null;

  uploadForm = this.fb.group({
    fileName: ["", Validators.required],
    isPrimary: [false],
  });

  ngOnInit() {
    this.loadCandidateIdAndCvs();
  }

  loadCandidateIdAndCvs() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

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
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error("Failed to load CVs.");
          this.isLoading = false;
        },
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
      if (!this.uploadForm.get("fileName")?.value) {
        this.uploadForm.patchValue({ fileName: file.name.split(".")[0] });
      }
    }
  }

  submitUpload() {
    if (this.uploadForm.valid && this.candidateId && this.selectedFile) {
      this.isUploading = true;
      const vals = this.uploadForm.value;

      this.cvService
        .upload(
          this.candidateId,
          vals.fileName!,
          this.selectedFile,
          vals.isPrimary || false
        )
        .subscribe({
          next: (createdCv: CvDto) => {
            this.cvs.push(createdCv);
            this.toastService.success("CV uploaded successfully!");
            this.closeUploadModal();
            this.isUploading = false;
          },
          error: () => {
            this.toastService.error("Failed to upload CV.");
            this.isUploading = false;
          },
        });
    } else if (!this.selectedFile) {
      this.toastService.error("Please select a file to upload.");
    }
  }

  setPrimary(cvId: string) {
    if (!this.candidateId) return;
    this.cvService.setDefault(this.candidateId, cvId).subscribe({
      next: () => {
        this.cvs.forEach((c) => (c.isDefault = c.id === cvId));
        this.toastService.success("Primary CV updated.");
      },
      error: () => this.toastService.error("Failed to update primary CV."),
    });
  }

  deleteCv(id: string) {
    if (confirm("Are you sure you want to delete this CV?")) {
      this.cvService.delete(id).subscribe({
        next: () => {
          this.cvs = this.cvs.filter((c) => c.id !== id);
          this.toastService.success("CV deleted.");
        },
        error: () => this.toastService.error("Failed to delete CV."),
      });
    }
  }
}
