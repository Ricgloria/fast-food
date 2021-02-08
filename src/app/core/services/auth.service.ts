import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Auth, User} from '../../shared/interfaces/user';

const TOKEN = 'token';
const USER = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = `${environment.baseUrl}/user/login`;

  constructor(
    private http: HttpClient,
    private route: Router
  ) {
  }

  login(user: { cpf: string, password: string }): Observable<Auth | null> {
    return this.http.post<Auth | null>(this.url, user, {observe: 'response'})
      .pipe(tap(response => this.createLocalStorage(response?.body)))
      .pipe(map(response => response.body));
  }

  createLocalStorage(user: Auth | null | undefined): void {
    if (user?.user && user?.token) {
      this.setUserStorage(USER, user.user);
      this.setUserStorage(TOKEN, user.token);
    }
  }

  setUserStorage(localName: string, data: {}): void {
    const stringData = JSON.stringify(data);
    return localStorage.setItem(localName, stringData);
  }

  checkLoggedUser(): boolean {
    return !!this.getLoggedUserStorage();
  }

  getLoggedUserStorage(): User {
    return JSON.parse(localStorage.getItem(USER) as string);
  }

  getLoggedUserTokenStorage(): string {
    return JSON.parse(localStorage.getItem(TOKEN) as string);
  }

  clearUserStorage(): void {
    localStorage.removeItem(USER);
    localStorage.removeItem(TOKEN);
    localStorage.clear();
  }

  logoutUser(): void {
    this.clearUserStorage();
    this.route.navigate(['/']);
  }

}
