import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthService} from '../services/auth.service';
import {catchError} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private api = environment.baseUrl;

  constructor(
    private auth: AuthService,
    private toast: ToastrService,
    private router: Router
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.auth.checkLoggedUser() && request.url.includes(this.api)) {
      request = this.setHeadersToken(request);
    }

    return next.handle(request).pipe(catchError(
      err => {
        if (err?.status === 400 && err?.error?.message?.includes('Token inválido.')) {
          this.forceLogin();
          return throwError(err);
        } else {
          return throwError(err);
        }
      })
    );
  }

  setHeadersToken(request: HttpRequest<any>): HttpRequest<any> {
    if (this.auth.getLoggedUserTokenStorage()) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.getLoggedUserTokenStorage()}`
        }
      });
    } else {
      return request;
    }
  }

  forceLogin(): void {
    this.toast.error('Sua permissão expirou, refaça seu login');
    this.auth.clearUserStorage();
    this.router.navigate(['/login']);
  }
}
