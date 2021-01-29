import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {Product} from '../../shared/interfaces/product';
import {ProductService} from '../services/product.service';
import {catchError, map} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product[]> {

  constructor(
    private productService: ProductService,
    private toast: ToastrService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product[]> | Promise<Product[]> | Product[] {
    return this.productService.getAllProducts().pipe(map(
      res => res)).pipe(catchError(
      err => {
        this.toast.error(err.error.message);
        return throwError(err);
      })
    );
  }

}
