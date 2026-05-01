import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CandidateService } from "../../services/candidate.service";
import { AuthService } from "../../core/services/auth.service";
import { ToastService } from "../../core/services/toast.service";
import { CandidateDto, UpdateCandidateDto } from "../../models/candidate.model";

@Component({
  selector: "app-candidate-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#f8fafc] pb-12 animate-fade-in">
      <!-- Hero Header -->
      <div class="relative h-56 bg-[#0f172a] overflow-hidden mb-[-4rem]">
        <div
          class="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-purple-600/20"
        ></div>
        <div
          class="absolute top-[-10%] left-[-5%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
        ></div>
        <div
          class="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 2s"
        ></div>
        <div class="max-w-6xl mx-auto px-6 pt-10 relative z-10">
          <nav
            class="flex items-center gap-2 text-indigo-300 text-sm font-medium mb-4"
          >
            <a
              routerLink="/dashboard"
              class="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >Dashboard</a
            >
            <svg
              class="w-4 h-4 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span>Profile</span>
          </nav>
          <h1
            class="text-4xl md:text-5xl font-black text-white tracking-tight mb-2"
          >
            My Professional
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
              >Profile</span
            >
          </h1>
          <p class="text-indigo-100/70 text-base max-w-xl">
            Manage your personal information and let top companies discover you.
          </p>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <!-- Loading State -->
        <div
          *ngIf="isLoading"
          class="flex flex-col items-center justify-center p-24 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl shadow-indigo-100/20 mt-16"
        >
          <div class="relative w-20 h-20">
            <div
              class="absolute inset-0 rounded-full border-4 border-indigo-50"
            ></div>
            <div
              class="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"
            ></div>
          </div>
          <p
            class="mt-6 text-gray-500 font-semibold tracking-wide animate-pulse uppercase text-sm"
          >
            Loading profile...
          </p>
        </div>

        <div
          *ngIf="!isLoading"
          class="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8"
        >
          <!-- Left Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <div
              class="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/30 border border-gray-100 p-2 overflow-hidden sticky top-8"
            >
              <div class="bg-indigo-50/50 rounded-[2rem] p-8 text-center">
                <!-- Avatar -->
                <div class="relative inline-block mb-6">
                  <div
                    class="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-1 shadow-xl"
                  >
                    <div
                      class="w-full h-full rounded-[1.25rem] bg-white flex items-center justify-center text-3xl font-black text-indigo-600"
                    >
                      {{ candidateData?.firstName?.charAt(0)
                      }}{{ candidateData?.lastName?.charAt(0) }}
                    </div>
                  </div>
                  <div
                    class="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 border-4 border-white rounded-full shadow-lg"
                  ></div>
                </div>

                <h2 class="text-xl font-black text-gray-900 leading-tight mb-1">
                  {{ candidateData?.fullName }}
                </h2>
                <p
                  class="text-indigo-600 font-bold text-xs tracking-wide uppercase mb-5"
                >
                  {{ candidateData?.email }}
                </p>

                <!-- Stats -->
                <div class="grid grid-cols-2 gap-3">
                  <div
                    class="bg-white p-3 rounded-2xl shadow-sm border border-gray-50"
                  >
                    <p
                      class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1"
                    >
                      Applied
                    </p>
                    <p class="text-xl font-black text-gray-900">
                      {{ candidateData?.applicationsCount ?? 0 }}
                    </p>
                  </div>
                  <div
                    class="bg-white p-3 rounded-2xl shadow-sm border border-gray-50"
                  >
                    <p
                      class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1"
                    >
                      CVs
                    </p>
                    <p class="text-xl font-black text-gray-900">
                      {{ candidateData?.cvsCount ?? 0 }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="px-5 py-5 space-y-2">
                <a
                  routerLink="/profile"
                  class="w-full flex items-center justify-between p-4 rounded-2xl bg-indigo-50 text-indigo-700 font-bold transition-all group cursor-pointer hover:bg-indigo-100"
                >
                  <span class="flex items-center gap-3 text-sm">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile Settings
                  </span>
                  <svg
                    class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
                <a
                  routerLink="/cvs"
                  class="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 text-gray-600 font-bold transition-all group cursor-pointer"
                >
                  <span class="flex items-center gap-3 text-sm text-gray-500">
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
                    Manage CVs
                  </span>
                  <svg
                    class="w-4 h-4 group-hover:translate-x-1 transition-transform text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
                <a
                  routerLink="/applications"
                  class="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 text-gray-600 font-bold transition-all group cursor-pointer"
                >
                  <span class="flex items-center gap-3 text-sm text-gray-500">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    My Applications
                  </span>
                  <svg
                    class="w-4 h-4 group-hover:translate-x-1 transition-transform text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
                <a
                  routerLink="/saved-jobs"
                  class="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 text-gray-600 font-bold transition-all group cursor-pointer"
                >
                  <span class="flex items-center gap-3 text-sm text-gray-500">
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Saved Jobs
                  </span>
                  <svg
                    class="w-4 h-4 group-hover:translate-x-1 transition-transform text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Main Form -->
          <div class="lg:col-span-3">
            <div
              class="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/10 border border-gray-100 overflow-hidden"
            >
              <div class="p-8 md:p-12">
                <form
                  [formGroup]="profileForm"
                  (ngSubmit)="onSubmit()"
                  class="space-y-10"
                >
                  <!-- Section 1: Identity & Contact -->
                  <div>
                    <h3
                      class="text-lg font-black text-gray-900 mb-6 flex items-center gap-3"
                    >
                      <span
                        class="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black"
                        >1</span
                      >
                      Identity & Contact
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <label
                          class="text-xs font-black text-gray-400 uppercase tracking-widest"
                          >First Name *</label
                        >
                        <input
                          type="text"
                          formControlName="firstName"
                          placeholder="Alex"
                          class="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-gray-900 placeholder:text-gray-300 outline-none"
                        />
                        <p
                          *ngIf="
                            profileForm.get('firstName')?.invalid &&
                            profileForm.get('firstName')?.touched
                          "
                          class="text-red-500 text-xs font-bold"
                        >
                          First name is required.
                        </p>
                      </div>
                      <div class="space-y-2">
                        <label
                          class="text-xs font-black text-gray-400 uppercase tracking-widest"
                          >Last Name *</label
                        >
                        <input
                          type="text"
                          formControlName="lastName"
                          placeholder="Smith"
                          class="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-gray-900 placeholder:text-gray-300 outline-none"
                        />
                        <p
                          *ngIf="
                            profileForm.get('lastName')?.invalid &&
                            profileForm.get('lastName')?.touched
                          "
                          class="text-red-500 text-xs font-bold"
                        >
                          Last name is required.
                        </p>
                      </div>
                      <div class="space-y-2">
                        <label
                          class="text-xs font-black text-gray-400 uppercase tracking-widest"
                          >Phone</label
                        >
                        <input
                          type="tel"
                          formControlName="phone"
                          placeholder="+373..."
                          class="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-gray-900 placeholder:text-gray-300 outline-none"
                        />
                      </div>
                      <div class="space-y-2">
                        <label
                          class="text-xs font-black text-gray-400 uppercase tracking-widest"
                          >Location</label
                        >
                        <input
                          type="text"
                          formControlName="location"
                          placeholder="Chisinau, MD"
                          class="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-gray-900 placeholder:text-gray-300 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Section 2: Online Presence -->
                  <div>
                    <h3
                      class="text-lg font-black text-gray-900 mb-6 flex items-center gap-3"
                    >
                      <span
                        class="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-black"
                        >2</span
                      >
                      Online Presence
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <label
                          class="text-xs font-black text-gray-400 uppercase tracking-widest"
                          >LinkedIn URL</label
                        >
                        <input
                          type="url"
                          formControlName="linkedInUrl"
                          placeholder="https://linkedin.com/in/username"
                          class="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-gray-900 placeholder:text-gray-300 outline-none"
                        />
                      </div>
                      <div class="space-y-2">
                        <label
                          class="text-xs font-black text-gray-400 uppercase tracking-widest"
                          >GitHub URL</label
                        >
                        <input
                          type="url"
                          formControlName="gitHubUrl"
                          placeholder="https://github.com/username"
                          class="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-gray-900 placeholder:text-gray-300 outline-none"
                        />
                      </div>
                      <div class="md:col-span-2 space-y-2">
                        <label
                          class="text-xs font-black text-gray-400 uppercase tracking-widest"
                          >Portfolio URL</label
                        >
                        <input
                          type="url"
                          formControlName="portfolioUrl"
                          placeholder="https://yourportfolio.dev"
                          class="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-gray-900 placeholder:text-gray-300 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Section 3: Bio -->
                  <div>
                    <h3
                      class="text-lg font-black text-gray-900 mb-6 flex items-center gap-3"
                    >
                      <span
                        class="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black"
                        >3</span
                      >
                      About You
                    </h3>
                    <div class="space-y-2">
                      <label
                        class="text-xs font-black text-gray-400 uppercase tracking-widest"
                        >Bio / Professional Summary</label
                      >
                      <textarea
                        formControlName="bio"
                        rows="6"
                        placeholder="Describe your professional background, key skills, and what drives you..."
                        class="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold text-gray-900 placeholder:text-gray-300 leading-relaxed outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div
                    class="pt-4 flex flex-col sm:flex-row justify-end items-center gap-4 border-t border-gray-100"
                  >
                    <button
                      type="button"
                      (click)="loadProfile()"
                      class="text-sm font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors px-4 py-2"
                    >
                      Reset Changes
                    </button>
                    <button
                      type="submit"
                      [disabled]="profileForm.invalid || isSaving"
                      class="relative group overflow-hidden bg-gray-900 text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100"
                    >
                      <div
                        class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      ></div>
                      <span
                        class="relative flex items-center gap-3 text-sm uppercase tracking-widest"
                      >
                        <span *ngIf="isSaving">
                          <svg
                            class="animate-spin h-4 w-4"
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
                            ></path>
                          </svg>
                        </span>
                        {{ isSaving ? "Saving..." : "Save Profile" }}
                        <svg
                          *ngIf="!isSaving"
                          class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .animate-fade-in {
        animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class CandidateProfileComponent implements OnInit {
  private candidateService = inject(CandidateService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  profileForm = this.fb.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    phone: [""],
    location: [""],
    linkedInUrl: [""],
    gitHubUrl: [""],
    portfolioUrl: [""],
    bio: [""],
  });

  candidateData: CandidateDto | null = null;
  isLoading = true;
  isSaving = false;
  userId: string = "";

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.userId = user.id;
      this.loadProfile();
    }
  }

  loadProfile() {
    this.isLoading = true;
    this.candidateService.getByUserId(this.userId).subscribe({
      next: (data) => {
        this.candidateData = data;
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone ?? "",
          location: data.location ?? "",
          linkedInUrl: data.linkedInUrl ?? "",
          gitHubUrl: data.gitHubUrl ?? "",
          portfolioUrl: data.portfolioUrl ?? "",
          bio: data.bio ?? "",
        });
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error("Failed to load profile.");
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.profileForm.invalid || !this.candidateData) return;
    this.isSaving = true;
    const dto: UpdateCandidateDto = this.profileForm
      .value as UpdateCandidateDto;

    // Use the candidate entity ID (not user ID)
    this.candidateService.update(this.candidateData.id, dto).subscribe({
      next: (updated) => {
        this.candidateData = updated;
        this.toastService.success("Profile updated successfully!");
        this.isSaving = false;
      },
      error: () => {
        this.toastService.error("Failed to update profile.");
        this.isSaving = false;
      },
    });
  }
}
