import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { CompanyService } from "../../services/company.service";
import { AuthService } from "../../core/services/auth.service";
import { ToastService } from "../../core/services/toast.service";
import { CompanyDto, UpdateCompanyDto } from "../../models/company.model";

@Component({
  selector: "app-company-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div
      class="min-h-screen bg-[#f8fafc] pb-12 animate-in fade-in duration-700"
    >
      <!-- Premium Brand Header -->
      <div class="relative h-72 bg-[#1e1b4b] overflow-hidden mb-[-5rem]">
        <div
          class="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 z-0"
        ></div>
        <div
          class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"
        ></div>

        <!-- Animated Background Elements -->
        <div
          class="absolute top-[-20%] right-[-10%] w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[100px] animate-pulse"
        ></div>
        <div
          class="absolute bottom-[-10%] left-[5%] w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] animate-pulse"
          style="animation-delay: 3s"
        ></div>

        <div class="max-w-6xl mx-auto px-6 pt-16 relative z-10">
          <div
            class="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-6">
                <span
                  class="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-purple-200 uppercase tracking-[0.2em]"
                  >Corporate Identity</span
                >
                <div
                  *ngIf="companyData"
                  class="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg shadow-orange-500/20"
                >
                  <svg
                    class="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span
                    class="text-white font-black text-[10px] uppercase tracking-widest"
                    >{{
                      companyData.subscriptionTier === 0 ? "Basic" : "Premium"
                    }}</span
                  >
                </div>
              </div>
              <h1
                class="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 leading-none"
              >
                {{ companyData?.companyName || "Your" }}
                <span
                  class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400"
                  >Empire</span
                >
              </h1>
              <p class="text-purple-100/60 text-lg max-w-2xl font-medium">
                Sculpt your brand's presence and attract the visionaries who
                will build your future.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-6 relative z-20">
        <div
          *ngIf="isLoading"
          class="flex flex-col items-center justify-center p-24 bg-white/80 backdrop-blur-3xl rounded-[3rem] border border-white/40 shadow-2xl shadow-purple-100/20 mt-16"
        >
          <div class="relative w-24 h-24">
            <div
              class="absolute inset-0 rounded-full border-8 border-purple-50"
            ></div>
            <div
              class="absolute inset-0 rounded-full border-8 border-purple-600 border-t-transparent animate-spin"
            ></div>
          </div>
          <p
            class="mt-8 text-gray-400 font-black tracking-[0.2em] animate-pulse uppercase text-xs"
          >
            Calibrating Brand Assets...
          </p>
        </div>

        <div *ngIf="!isLoading" class="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <!-- Left Sidebar: Brand Synthesis -->
          <div class="lg:col-span-1 space-y-8">
            <div
              class="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(79,70,229,0.1)] border border-white p-2 overflow-hidden sticky top-8"
            >
              <div
                class="bg-purple-50/50 rounded-[2.5rem] p-10 text-center relative overflow-hidden"
              >
                <div
                  class="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"
                ></div>

                <!-- Advanced Logo Display -->
                <div class="relative inline-block mb-8 group">
                  <div
                    class="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl rotate-2 group-hover:rotate-0 transition-all duration-700 ease-out overflow-hidden"
                  >
                    <div
                      *ngIf="!companyData?.logoUrl"
                      class="w-full h-full rounded-[1.75rem] bg-gradient-to-br from-purple-100 to-indigo-50 flex items-center justify-center text-4xl font-black text-purple-600"
                    >
                      {{ companyData?.companyName?.charAt(0) }}
                    </div>
                    <img
                      *ngIf="companyData?.logoUrl"
                      [src]="companyData?.logoUrl"
                      class="w-full h-full rounded-[1.75rem] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div
                    class="absolute -bottom-2 -right-2 w-10 h-10 bg-white border-4 border-[#f8fafc] rounded-2xl shadow-xl flex items-center justify-center text-purple-600"
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>

                <h2
                  class="text-3xl font-black text-gray-900 leading-tight mb-2"
                >
                  {{ companyData?.companyName }}
                </h2>
                <p
                  class="text-purple-600 font-black text-[11px] tracking-[0.15em] uppercase mb-8 opacity-70"
                >
                  {{ companyData?.industry || "Uncharted Sector" }}
                </p>

                <!-- Performance Grid -->
                <div class="grid grid-cols-2 gap-4 pb-4">
                  <div
                    class="bg-white/80 p-5 rounded-3xl shadow-sm border border-white hover:border-purple-100 transition-all duration-500 group"
                  >
                    <p
                      class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 group-hover:text-purple-400 transition-colors"
                    >
                      Positions
                    </p>
                    <p class="text-3xl font-black text-gray-900">
                      {{ companyData?.activeJobsCount }}
                    </p>
                  </div>
                  <div
                    class="bg-white/80 p-5 rounded-3xl shadow-sm border border-white hover:border-indigo-100 transition-all duration-500 group"
                  >
                    <p
                      class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 group-hover:text-indigo-400 transition-colors"
                    >
                      Talent
                    </p>
                    <p class="text-3xl font-black text-gray-900">24</p>
                  </div>
                </div>
              </div>

              <div class="px-8 py-8 space-y-4">
                <a
                  routerLink="/dashboard"
                  class="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <span>Dashboard</span>
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
                <a
                  routerLink="/company-jobs"
                  class="w-full flex items-center gap-4 p-5 rounded-[1.5rem] hover:bg-gray-50 text-gray-400 font-bold text-xs uppercase tracking-widest transition-all group cursor-pointer"
                >
                  <svg
                    class="w-5 h-5 group-hover:text-purple-600 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>My Job Postings</span>
                </a>
                <a
                  routerLink="/discover-talent"
                  class="w-full flex items-center gap-4 p-5 rounded-[1.5rem] hover:bg-gray-50 text-gray-400 font-bold text-xs uppercase tracking-widest transition-all group cursor-pointer"
                >
                  <svg
                    class="w-5 h-5 group-hover:text-purple-600 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Discover Talent</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Main Content: Evolution Vault -->
          <div class="lg:col-span-3 space-y-10">
            <div
              class="bg-white/50 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl shadow-purple-100/10 border border-white overflow-hidden p-2"
            >
              <div class="bg-white rounded-[3rem] p-10 md:p-16">
                <form
                  [formGroup]="profileForm"
                  (ngSubmit)="onSubmit()"
                  class="space-y-16"
                >
                  <!-- Phase 1: Brand Essence -->
                  <div class="relative">
                    <h3
                      class="text-2xl font-black text-gray-900 mb-10 flex items-center gap-4"
                    >
                      <span
                        class="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-sm"
                        >01</span
                      >
                      Brand Essence
                      <span
                        class="h-1 w-24 bg-gradient-to-r from-purple-600 to-transparent rounded-full"
                      ></span>
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div class="md:col-span-2 space-y-4">
                        <label
                          class="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2"
                          >Visual Identity (Logo URL)</label
                        >
                        <div
                          class="flex flex-col md:flex-row gap-6 items-start"
                        >
                          <div class="relative group flex-1 w-full">
                            <input
                              type="url"
                              formControlName="logoUrl"
                              placeholder="https://cloud.storage/company-logo.png"
                              class="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.75rem] focus:bg-white focus:border-purple-600 focus:ring-[12px] focus:ring-purple-600/5 transition-all font-bold text-gray-900 placeholder:text-gray-300"
                            />
                            <div
                              class="mt-4 p-4 bg-purple-50/30 rounded-2xl border border-purple-50 md:hidden"
                            >
                              <p
                                class="text-[10px] font-bold text-purple-400 mb-2 uppercase tracking-widest"
                              >
                                Mobile Preview
                              </p>
                              <img
                                *ngIf="profileForm.get('logoUrl')?.value"
                                [src]="profileForm.get('logoUrl')?.value"
                                class="h-12 w-12 rounded-xl object-cover border border-white shadow-sm"
                              />
                            </div>
                          </div>
                          <div
                            class="hidden md:flex flex-col items-center gap-2 group"
                          >
                            <div
                              class="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group-hover:border-purple-300 transition-colors"
                            >
                              <img
                                *ngIf="profileForm.get('logoUrl')?.value"
                                [src]="profileForm.get('logoUrl')?.value"
                                class="w-full h-full object-cover"
                              />
                              <svg
                                *ngIf="!profileForm.get('logoUrl')?.value"
                                class="w-6 h-6 text-gray-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <span
                              class="text-[9px] font-black text-gray-400 uppercase tracking-widest"
                              >Preview</span
                            >
                          </div>
                        </div>
                      </div>

                      <div class="space-y-4">
                        <label
                          class="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2"
                          >Legal Entity Name</label
                        >
                        <input
                          type="text"
                          formControlName="companyName"
                          placeholder="Acme Global Inc."
                          class="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.75rem] focus:bg-white focus:border-purple-600 focus:ring-[12px] focus:ring-purple-600/5 transition-all font-bold text-gray-900"
                        />
                      </div>
                      <div class="space-y-4">
                        <label
                          class="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2"
                          >Industry</label
                        >
                        <select
                          formControlName="industry"
                          class="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.75rem] focus:bg-white focus:border-purple-600 focus:ring-[12px] focus:ring-purple-600/5 transition-all font-bold text-gray-900 appearance-none"
                        >
                          <option value="">Select Industry</option>
                          <option value="IT & Software">IT & Software</option>
                          <option value="Finance">Finance & Banking</option>
                          <option value="Healthcare">
                            Healthcare & Medicine
                          </option>
                          <option value="Education">
                            Education & Training
                          </option>
                          <option value="Marketing">
                            Marketing & Advertising
                          </option>
                          <option value="Retail">Retail & E-commerce</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Logistics">
                            Logistics & Transport
                          </option>
                          <option value="Consulting">Consulting</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div class="space-y-4">
                        <label
                          class="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2"
                          >Organizational Scale</label
                        >
                        <select
                          formControlName="companySize"
                          class="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.75rem] focus:bg-white focus:border-purple-600 focus:ring-[12px] focus:ring-purple-600/5 transition-all font-bold text-gray-900 appearance-none"
                        >
                          <option value="">Define Scale</option>
                          <option value="1-10 Employees">
                            1-10 Visionaries
                          </option>
                          <option value="11-50 Employees">
                            11-50 Innovators
                          </option>
                          <option value="51-200 Employees">
                            51-200 Builders
                          </option>
                          <option value="201-500 Employees">
                            201-500 Strategists
                          </option>
                          <option value="500+ Employees">
                            Global Enterprise
                          </option>
                        </select>
                      </div>
                      <div class="space-y-4">
                        <label
                          class="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2"
                          >Operational Base</label
                        >
                        <input
                          type="text"
                          formControlName="location"
                          placeholder="Silicon Valley / Remote"
                          class="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.75rem] focus:bg-white focus:border-purple-600 focus:ring-[12px] focus:ring-purple-600/5 transition-all font-bold text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Phase 2: Digital Frontier -->
                  <div class="relative">
                    <h3
                      class="text-2xl font-black text-gray-900 mb-10 flex items-center gap-4"
                    >
                      <span
                        class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm"
                        >02</span
                      >
                      Digital Frontier
                      <span
                        class="h-1 w-24 bg-gradient-to-r from-indigo-600 to-transparent rounded-full"
                      ></span>
                    </h3>

                    <div class="space-y-4">
                      <label
                        class="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2"
                        >Digital HQ (Website)</label
                      >
                      <div class="relative group">
                        <input
                          type="url"
                          formControlName="website"
                          placeholder="https://yourbrand.future"
                          class="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.75rem] focus:bg-white focus:border-indigo-600 focus:ring-[12px] focus:ring-indigo-600/5 transition-all font-bold text-gray-900"
                        />
                        <svg
                          class="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-indigo-600 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- Phase 3: Brand Narrative & Culture -->
                  <div class="relative">
                    <h3
                      class="text-2xl font-black text-gray-900 mb-10 flex items-center gap-4"
                    >
                      <span
                        class="w-10 h-10 rounded-2xl bg-pink-600 text-white flex items-center justify-center text-sm"
                        >03</span
                      >
                      Narrative & Culture
                      <span
                        class="h-1 w-24 bg-gradient-to-r from-pink-600 to-transparent rounded-full"
                      ></span>
                    </h3>

                    <div class="space-y-10">
                      <div class="space-y-4">
                        <label
                          class="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2"
                          >Mission Statement (Description)</label
                        >
                        <textarea
                          formControlName="description"
                          rows="6"
                          placeholder="What legacy is your company creating? Define your mission and values..."
                          class="w-full px-10 py-8 bg-gray-50 border-2 border-transparent rounded-[2.5rem] focus:bg-white focus:border-pink-600 focus:ring-[12px] focus:ring-pink-600/5 transition-all font-bold text-gray-900 leading-relaxed"
                        ></textarea>
                      </div>

                      <div class="space-y-4">
                        <label
                          class="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2"
                          >Organizational Culture (Ethos)</label
                        >
                        <textarea
                          formControlName="companyCulture"
                          rows="4"
                          placeholder="Describe the environment, teamwork style, and the vibe at your workplace..."
                          class="w-full px-10 py-8 bg-gradient-to-br from-gray-50 to-purple-50/20 border-2 border-transparent rounded-[2.5rem] focus:bg-white focus:border-purple-600 focus:ring-[12px] focus:ring-purple-600/5 transition-all font-bold text-gray-900 leading-relaxed"
                        ></textarea>
                        <p
                          class="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-4"
                        >
                          This helps candidates determine if they are a cultural
                          fit for your team.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Premium Command Center -->
                  <div
                    class="pt-12 flex flex-col sm:flex-row justify-end items-center gap-8"
                  >
                    <button
                      type="button"
                      (click)="loadProfile()"
                      class="text-[11px] font-black text-gray-400 hover:text-red-500 uppercase tracking-[0.25em] transition-colors pr-4 border-r border-gray-100"
                    >
                      Synchronize Original
                    </button>
                    <button
                      type="submit"
                      [disabled]="profileForm.invalid || isSaving"
                      class="relative group bg-gray-900 text-white font-black py-6 px-16 rounded-3xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)] transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:hover:scale-100 overflow-hidden"
                    >
                      <div
                        class="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      ></div>
                      <span
                        class="relative flex items-center gap-4 text-[13px] uppercase tracking-[0.2em]"
                      >
                        <span
                          *ngIf="isSaving"
                          class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                        ></span>
                        {{ isSaving ? "Committing..." : "Finalize Identity" }}
                        <svg
                          *ngIf="!isSaving"
                          class="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
      .animate-in {
        animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1);
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
export class CompanyProfileComponent implements OnInit {
  private companyService = inject(CompanyService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  profileForm = this.fb.group({
    companyName: ["", Validators.required],
    description: [""],
    location: [""],
    website: [""],
    industry: [""],
    companySize: [""],
    logoUrl: [""],
    companyCulture: [""],
  });

  companyData: CompanyDto | null = null;
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
    this.companyService.getByUserId(this.userId).subscribe({
      next: (data) => {
        this.companyData = data;
        this.profileForm.patchValue({
          companyName: data.companyName,
          description: data.description,
          location: data.location,
          website: data.website,
          industry: data.industry,
          companySize: data.companySize,
          logoUrl: data.logoUrl,
          companyCulture: data.companyCulture,
        });
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error("Failed to load company profile.");
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.profileForm.valid && this.userId) {
      this.isSaving = true;
      const dto: UpdateCompanyDto = this.profileForm.value as any;

      this.companyService.update(this.userId, dto).subscribe({
        next: (updated) => {
          this.companyData = updated;
          this.toastService.success("Company profile updated successfully!");
          this.isSaving = false;
        },
        error: () => {
          this.toastService.error("Failed to update company profile.");
          this.isSaving = false;
        },
      });
    }
  }
}
