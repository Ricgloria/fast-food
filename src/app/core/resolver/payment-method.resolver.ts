import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {PaymentMethod} from '../../shared/interfaces/payment-method';
import {PaymentMethodService} from '../services/payment-method.service';
import {catchError, map} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodResolver implements Resolve<PaymentMethod[]> {

  constructor(
    private paymentMethodService: PaymentMethodService,
    private toast: ToastrService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<PaymentMethod[]> | Promise<PaymentMethod[]> | PaymentMethod[] {
    return this.paymentMethodService.getAllPaymentMethods().pipe(map(
      res => res)).pipe(catchError(
      err => {
        this.toast.error(err.error.message);
        return throwError(err);
      })
    );
  }

}
