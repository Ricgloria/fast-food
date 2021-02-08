import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SendSale} from '../../shared/interfaces/sale-box';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private sales = `${environment.baseUrl}/sales`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getAllSales(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.sales);
  }

  public postSale(sale: SendSale): Observable<any> {
    return this.httpClient.post<any>(`${this.sales}`, sale);
  }
}
