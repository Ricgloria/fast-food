import {Injectable} from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {SalesType} from '../../shared/interfaces/sales-type';
import {SalesTypeService} from '../services/sales-type.service';
import {ToastrService} from 'ngx-toastr';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesTypeResolver implements Resolve<SalesType[]> {

  constructor(
    private salesTypeService: SalesTypeService,
    private toast: ToastrService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SalesType[]> | Promise<SalesType[]> | SalesType[] {
    return this.salesTypeService.getAllSalesType().pipe(map(
      res => res)).pipe(catchError(
      err => {
        this.toast.error(err.error.message);
        return throwError(err);
      })
    );
  }

}
