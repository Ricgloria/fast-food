import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaymentMethod} from '../../shared/interfaces/payment-method';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private paymentMethod = `${environment.baseUrl}/payment-method`;

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllPaymentMethods(): Observable<PaymentMethod[]> {
    return this.httpClient.get<PaymentMethod[]>(this.paymentMethod);
  }

  public getAllActivePaymentMethods(): Observable<PaymentMethod[]> {
    return this.httpClient.get<PaymentMethod[]>(`${this.paymentMethod}/sales`);
  }

  public getPaymentMethodsById(id: number): Observable<PaymentMethod> {
    return this.httpClient.get<PaymentMethod>(`${this.paymentMethod}/${id}`);
  }

  public postPaymentMethod(paymentMethod: PaymentMethod): Observable<PaymentMethod> {
    return this.httpClient.post<PaymentMethod>(`${this.paymentMethod}`, paymentMethod);
  }

  public putPaymentMethod(paymentMethod: PaymentMethod, id: number): Observable<PaymentMethod> {
    return this.httpClient.put<PaymentMethod>(`${this.paymentMethod}/${id}`, paymentMethod);
  }

  public deletePaymentMethod(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.paymentMethod}/${id}`);
  }
}
