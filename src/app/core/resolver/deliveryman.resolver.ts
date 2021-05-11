import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {Deliveryman} from '../../shared/interfaces/deliveryman';
import {DeliverymanService} from '../services/deliveryman.service';
import {ToastrService} from 'ngx-toastr';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeliverymanResolver implements Resolve<Deliveryman[]> {

  constructor(
    private deliverymanService: DeliverymanService,
    private toast: ToastrService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Deliveryman[]> | Promise<Deliveryman[]> | Deliveryman[] {
    return this.deliverymanService.getAllDeliveryman().pipe(map(
      res => res)).pipe(catchError(
      err => {
        this.toast.error(err.error.message);
        return throwError(err);
      })
    );
  }

}
