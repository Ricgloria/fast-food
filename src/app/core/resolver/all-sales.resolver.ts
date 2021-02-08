import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {Sale} from '../../shared/interfaces/sale-box';
import {SalesService} from '../services/sales.service';
import {ToastrService} from 'ngx-toastr';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AllSalesResolver implements Resolve<Sale[]> {

  constructor(
    private salesService: SalesService,
    private toast: ToastrService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Sale[]> | Promise<Sale[]> | Sale[] {
    return this.salesService.getAllSales().pipe(map(
      res => res)).pipe(catchError(
      err => {
        this.toast.error(err.error.message);
        return throwError(err);
      })
    );
  }

}
