import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Deliveryman} from '../../shared/interfaces/deliveryman';

@Injectable({
  providedIn: 'root'
})
export class DeliverymanService {

  private deliveryman = `${environment.baseUrl}/deliveryman`;

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllDeliveryman(): Observable<Deliveryman[]> {
    return this.httpClient.get<Deliveryman[]>(this.deliveryman);
  }

  public getAllActiveDeliveryman(): Observable<Deliveryman[]> {
    return this.httpClient.get<Deliveryman[]>(`${this.deliveryman}/sales`);
  }

  public getDeliverymanById(id: number): Observable<Deliveryman> {
    return this.httpClient.get<Deliveryman>(`${this.deliveryman}/${id}`);
  }

  public postDeliveryman(deliveryman: Deliveryman): Observable<Deliveryman> {
    return this.httpClient.post<Deliveryman>(`${this.deliveryman}`, deliveryman);
  }

  public putDeliveryman(deliveryman: Deliveryman, id: number): Observable<Deliveryman> {
    return this.httpClient.put<Deliveryman>(`${this.deliveryman}/${id}`, deliveryman);
  }

  public deleteDeliveryman(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.deliveryman}/${id}`);
  }
}
