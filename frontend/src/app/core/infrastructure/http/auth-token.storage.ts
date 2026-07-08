import { Injectable } from '@angular/core';

const TOKEN_KEY = 'goodvision.jwt';
const USER_ID_KEY = 'goodvision.userId';
const USER_ROLE_KEY = 'goodvision.role';

@Injectable({ providedIn: 'root' })
export class AuthTokenStorage {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getUserId(): number | null {
    const id = localStorage.getItem(USER_ID_KEY);
    return id ? +id : null;
  }

  saveUserId(id: number): void {
    localStorage.setItem(USER_ID_KEY, String(id));
  }

  getRole(): string | null {
    return localStorage.getItem(USER_ROLE_KEY);
  }

  saveRole(role: string): void {
    localStorage.setItem(USER_ROLE_KEY, role);
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }
}
