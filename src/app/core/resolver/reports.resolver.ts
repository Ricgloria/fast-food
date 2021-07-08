import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {forkJoin, Observable, throwError} from 'rxjs';
import {SalesService} from '../services/sales.service';
import {ToastrService} from 'ngx-toastr';
import {PreSalesService} from '../services/pre-sales.service';
import {ReportInterface} from '../../shared/interfaces/report-basis';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportsResolver implements Resolve<ReportInterface> {

  constructor(
    private salesService: SalesService,
    private preSalesService: PreSalesService,
    private toast: ToastrService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ReportInterface>
    | Promise<ReportInterface> | ReportInterface {
    return forkJoin({
      allSales: this.salesService.getAllSales(),
      salesReports: this.salesService.getAllSalesReports(),
      preSalesReport: this.preSalesService.getPreSalesReports()
    }).pipe(catchError(
      err => {
        this.toast.error(err.error.message);
        return throwError(err);
      })
    );
  }
}
