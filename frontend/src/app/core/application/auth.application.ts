import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest } from '../domain/models/auth.model';
import { AuthRepository } from '../domain/repositories/auth.repository';
import { AuthTokenStorage } from '../infrastructure/http/auth-token.storage';

@Injectable({ providedIn: 'root' })
export class AuthApplication {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenStorage: AuthTokenStorage
  ) {}

  login(request: LoginRequest): Observable<void> {
    return this.authRepository.login(request).pipe(
      tap((response) => {
        this.tokenStorage.saveToken(response.token);
        this.tokenStorage.saveUserId(response.idUsuario);
        this.tokenStorage.saveRole(response.role);
      }),
      map(() => undefined)
    );
  }

  register(request: RegisterRequest): Observable<string> {
    return this.authRepository.register(request);
  }

  getCurrentUserId(): number | null {
    return this.tokenStorage.getUserId();
  }

  isAdmin(): boolean {
    return this.tokenStorage.isAdmin();
  }

  logout(): void {
    this.tokenStorage.clear();
  }
}
