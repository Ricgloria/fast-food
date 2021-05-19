import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {forkJoin, Observable, throwError} from 'rxjs';
import {ProductAndDiscount} from '../../shared/interfaces/product';
import {ProductService} from '../services/product.service';
import {catchError, map} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {DiscountService} from '../services/discount.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<ProductAndDiscount> {

  constructor(
    private productService: ProductService,
    private discountService: DiscountService,
    private toast: ToastrService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<ProductAndDiscount> | Promise<ProductAndDiscount> | ProductAndDiscount {
    return forkJoin([
      this.productService.getAllProducts(),
      this.discountService.getDiscount()
    ]).pipe(map(
      res => {
        return {
          products: res[0],
          discount: res[1]
        };
      })).pipe(catchError(
      err => {
        this.toast.error(err.error.message);
        return throwError(err);
      })
    );
  }

}
