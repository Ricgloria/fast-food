import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user = `${environment.baseUrl}/user`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.user);
  }

  public getUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.user}/${id}`);
  }

  public postUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.user}`, user);
  }

  public putUser(user: User, id: number): Observable<User> {
    return this.httpClient.put<User>(`${this.user}/${id}`, user);
  }

  public deleteUser(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.user}/${id}`);
  }

  public resetPassword(id: number): Observable<any> {
    return this.httpClient.patch<any>(`${this.user}/${id}`, {});
  }

  public renewPassword(password: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.user}/renew`, password);
  }
}
