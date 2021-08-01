import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PreSale, PreSaleId, PreSalesReport} from '../../shared/interfaces/pre-sale';
import {paramsBuilder} from '../../shared/helpers/params-builder';

@Injectable({
  providedIn: 'root'
})
export class PreSalesService {

  private preSales = `${environment.baseUrl}/pre-sales`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getAllPreSales(): Observable<PreSale[]> {
    return this.httpClient.get<PreSale[]>(this.preSales);
  }

  public getPreSaleById(id: number): Observable<PreSale> {
    return this.httpClient.get<PreSale>(`${this.preSales}/${id}`);
  }


  public getPreSalesReports(startDate?: string | null, endDate?: string | null): Observable<PreSalesReport> {
    const setParams = {startDate, endDate};
    const params = paramsBuilder(setParams);
    return this.httpClient.get<PreSalesReport>(`${this.preSales}/reports`, {params});
  }

  public getActivePreSaleById(id: number): Observable<PreSale> {
    return this.httpClient.get<PreSale>(`${this.preSales}/active/${id}`);
  }

  public postPreSale(preSale: PreSale): Observable<PreSaleId> {
    return this.httpClient.post<PreSaleId>(this.preSales, preSale);
  }

  public patchFinishPreSale(id: number | string): Observable<any> {
    return this.httpClient.patch<any>(`${this.preSales}/${id}`, {});
  }
}
