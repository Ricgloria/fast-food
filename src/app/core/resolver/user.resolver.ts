import {Injectable} from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {User} from '../../shared/interfaces/user';
import {UserService} from '../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User[]> {

  constructor(
    private userService: UserService,
    private toast: ToastrService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]> | Promise<User[]> | User[] {
    return this.userService.getAllUsers().pipe(map(
      res => res)).pipe(catchError(
      err => {
        this.toast.error(err.error.message);
        return throwError(err);
      })
    );
  }
}
