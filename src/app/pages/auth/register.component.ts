import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Background Decorations -->
      <div class="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div class="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <h2 class="mt-6 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
          Create an Account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <a routerLink="/login" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign in instead
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div class="bg-white/80 backdrop-blur-lg py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
          <form class="space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            
            <div *ngIf="registerForm.get('role')?.value === 'Candidate'" class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700"> First Name </label>
                <div class="mt-1">
                  <input id="firstName" type="text" formControlName="firstName"
                    class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                    placeholder="John">
                </div>
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700"> Last Name </label>
                <div class="mt-1">
                  <input id="lastName" type="text" formControlName="lastName"
                    class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                    placeholder="Doe">
                </div>
              </div>
            </div>

            <div *ngIf="registerForm.get('role')?.value === 'Employer'">
              <label for="companyName" class="block text-sm font-medium text-gray-700"> Company Name </label>
              <div class="mt-1">
                <input id="companyName" type="text" formControlName="companyName"
                  class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="Acme Inc.">
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
              <div class="mt-1">
                <input id="email" type="email" formControlName="email"
                  class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="name@example.com">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
              <div class="mt-1">
                <input id="password" type="password" formControlName="password"
                  class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="••••••••">
              </div>
            </div>

            <div>
              <label for="role" class="block text-sm font-medium text-gray-700"> Account Type </label>
              <div class="mt-1">
                <select id="role" formControlName="role"
                  class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all bg-white">
                  <option value="Candidate">Candidate (Looking for jobs)</option>
                  <option value="Employer">Employer (Hiring)</option>
                </select>
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="registerForm.invalid || isLoading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all active:scale-95">
                <span *ngIf="isLoading" class="mr-2">
                   <!-- Spinner icon -->
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isLoading ? 'Creating account...' : 'Create account' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  registerForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    companyName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['Candidate', Validators.required]
  });

  isLoading = false;

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      const formValue = this.registerForm.value;
      const userData: any = {
        firstName: formValue.firstName || '',
        lastName: formValue.lastName || '',
        companyName: formValue.companyName || '',
        email: formValue.email!,
        password: formValue.password!,
        confirmPassword: formValue.password!,
        userType: formValue.role === 'Employer' ? 1 : 0
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.toastService.success('Account created successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
