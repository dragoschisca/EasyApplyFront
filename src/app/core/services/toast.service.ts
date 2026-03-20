import { Injectable, signal } from '@angular/core';

export interface Toast {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toasts = signal<Toast[]>([]);

  show(type: 'success' | 'error' | 'info', message: string) {
    const toast: Toast = { type, message };
    this.toasts.update(t => [...t, toast]);
    setTimeout(() => this.remove(toast), 3000);
  }

  success(message: string) {
    this.show('success', message);
  }

  error(message: string) {
    this.show('error', message);
  }

  info(message: string) {
    this.show('info', message);
  }

  remove(toast: Toast) {
    this.toasts.update(t => t.filter(x => x !== toast));
  }
}
