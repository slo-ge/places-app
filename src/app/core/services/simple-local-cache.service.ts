import {Injectable} from '@angular/core';
import {AuthResponse} from "@app/core/services/cms.service";

const USER_KEY = 'strapi-user';
const FEEDBACK_CLOSED = 'feedback_closed';
/**
 * by changing this value, users which already opened it with v1,
 * where normally the dialog would not appear automatically, will be opened again
 */
const FEEDBACK_VALUE = 'feedback-v1-hidden';

@Injectable({
  providedIn: 'root'
})
export class SimpleLocalCacheService {
  localStorage = localStorage;

  constructor() {
  }

  setUser(auth: AuthResponse) {
    this.localStorage.setItem(USER_KEY, JSON.stringify(auth));
  }

  getUser(): AuthResponse | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr) as AuthResponse;
    }

    return null;
  }

  clearUser() {
    this.localStorage.removeItem(USER_KEY);
  }

  getItem(key: string): string | null{
    return localStorage.getItem(key);
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  setFeedbackClosed() {
    this.localStorage.setItem(FEEDBACK_CLOSED, FEEDBACK_VALUE);
  }

  getFeedbackClosed(): boolean {
    return this.localStorage.getItem(FEEDBACK_CLOSED) === FEEDBACK_VALUE;
  }
}
