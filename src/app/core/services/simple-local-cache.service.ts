import {Injectable} from '@angular/core';
import {AuthResponse} from "@app/core/services/cms.service";

const USER_KEY = 'strapi-user';

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
}
