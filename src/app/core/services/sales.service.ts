import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SalesReport, SendSale} from '../../shared/interfaces/sale-box';
import {paramsBuilder} from '../../shared/helpers/params-builder';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private sales = `${environment.baseUrl}/sales`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getAllSales(startDate?: string | null, endDate?: string | null): Observable<any[]> {
    const setParams = {startDate, endDate};
    const params = paramsBuilder(setParams);
    return this.httpClient.get<any[]>(this.sales, {params});
  }

  public postSale(sale: SendSale): Observable<any> {
    return this.httpClient.post<any>(`${this.sales}`, sale);
  }

  public getAllSalesReports(startDate?: string | null, endDate?: string | null): Observable<SalesReport> {
    const setParams = {startDate, endDate};
    const params = paramsBuilder(setParams);
    return this.httpClient.get<SalesReport>(`${this.sales}/reports`, {params});
  }
}
