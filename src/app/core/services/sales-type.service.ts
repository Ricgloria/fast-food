import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SalesType} from '../../shared/interfaces/sales-type';

@Injectable({
  providedIn: 'root'
})
export class SalesTypeService {

  private sales = `${environment.baseUrl}/sales-type`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getAllSalesType(): Observable<SalesType[]> {
    return this.httpClient.get<SalesType[]>(this.sales);
  }

  public getAllActiveSalesType(): Observable<SalesType[]> {
    return this.httpClient.get<SalesType[]>(`${this.sales}/sales`);
  }

  public patchStatusSaleType(id: number, status: boolean | number): Observable<any> {
    return this.httpClient.patch(`${this.sales}/${id}`, {status});
  }
}
