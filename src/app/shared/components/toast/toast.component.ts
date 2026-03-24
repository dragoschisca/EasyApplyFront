import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <div *ngFor="let toast of toastService.toasts()" 
           [@toastAnimation]
           class="flex items-center min-w-[300px] max-w-sm p-4 text-gray-900 bg-white rounded-xl shadow-2xl border-l-4"
           [ngClass]="{
             'border-green-500': toast.type === 'success',
             'border-red-500': toast.type === 'error',
             'border-blue-500': toast.type === 'info'
           }">
        
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
             [ngClass]="{
               'text-green-500 bg-green-100': toast.type === 'success',
               'text-red-500 bg-red-100': toast.type === 'error',
               'text-blue-500 bg-blue-100': toast.type === 'info'
             }">
          <!-- Success Icon -->
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <!-- Error Icon -->
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <!-- Info Icon -->
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div class="ml-3 text-sm font-medium">{{ toast.message }}</div>

        <button type="button" (click)="toastService.remove(toast)"
                class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8">
          <span class="sr-only">Close</span>
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
