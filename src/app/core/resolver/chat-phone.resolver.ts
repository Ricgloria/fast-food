import {Injectable} from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {ChatPhone} from '../../shared/interfaces/chat-phone';
import {ChatPhoneService} from '../services/chat-phone.service';
import {ToastrService} from 'ngx-toastr';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatPhoneResolver implements Resolve<ChatPhone> {

  constructor(
    private chatPhoneService: ChatPhoneService,
    private toast: ToastrService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChatPhone> | Promise<ChatPhone> | ChatPhone {
    return this.chatPhoneService.getChatPhone().pipe(map(
      res => res)).pipe(catchError(
      err => {
        this.toast.error(err.error.message);
        return throwError(err);
      })
    );
  }
}
