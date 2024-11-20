import { ErrorHandler, Injectable, isDevMode } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Suppress server-side specific errors like "window is not defined"
    if (error.message && error.message.includes('window is not defined')) {
      return; // Ignore this error
    }

    if (error.message && error.message.includes('localStorage is not defined')) {
      return; // Ignore this error
    }

    // Log errors only in development mode
    if (isDevMode()) {
      console.error('Global Error:', error);
    }
  }
}
