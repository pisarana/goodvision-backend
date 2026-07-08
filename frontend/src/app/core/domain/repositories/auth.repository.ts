import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';

export abstract class AuthRepository {
  abstract login(request: LoginRequest): Observable<LoginResponse>;
  abstract register(request: RegisterRequest): Observable<string>;
}
