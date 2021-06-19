import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PreSale, PreSaleId} from '../../shared/interfaces/pre-sale';

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

  public getActivePreSaleById(id: number): Observable<PreSale> {
    return this.httpClient.get<PreSale>(`${this.preSales}/active/${id}`);
  }

  public postPreSale(preSale: PreSale): Observable<PreSaleId> {
    return this.httpClient.post<PreSaleId>(this.preSales, preSale);
  }

  public patchFinishPreSale(id: number): Observable<any> {
    return this.httpClient.patch<any>(`${this.preSales}/${id}`, {});
  }
}
