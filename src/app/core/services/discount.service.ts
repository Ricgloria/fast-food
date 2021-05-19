import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Discount} from '../../shared/interfaces/discount';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private discount = `${environment.baseUrl}/discount`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getDiscount(): Observable<Discount> {
    return this.httpClient.get<Discount>(this.discount);
  }

  public putDiscount(discount: Discount): Observable<Discount> {
    return this.httpClient.put<Discount>(this.discount, discount);
  }
}
