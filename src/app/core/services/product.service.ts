import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Product} from '../../shared/interfaces/product';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private product = `${environment.baseUrl}/product`;

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.product);
  }

  public getProductById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.product}/${id}`);
  }

  public postProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(`${this.product}`, product);
  }

  public putProduct(product: Product, id: number): Observable<Product> {
    return this.httpClient.put<Product>(`${this.product}/${id}`, product);
  }

  public deleteProduct(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.product}/${id}`);
  }
}
