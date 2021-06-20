import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {forkJoin, Observable, throwError} from 'rxjs';
import {SaleBox} from '../../shared/interfaces/sale-box';
import {ProductService} from '../services/product.service';
import {ToastrService} from 'ngx-toastr';
import {PaymentMethodService} from '../services/payment-method.service';
import {catchError, map} from 'rxjs/operators';
import {DeliverymanService} from '../services/deliveryman.service';
import {SalesTypeService} from '../services/sales-type.service';
import {ChatPhoneService} from '../services/chat-phone.service';
import {ExpectedTimeService} from '../services/expected-time.service';

@Injectable({
  providedIn: 'root'
})
export class SalesBoxResolver implements Resolve<SaleBox> {

  constructor(
    private productService: ProductService,
    private paymentMethod: PaymentMethodService,
    private deliverymanService: DeliverymanService,
    private salesTypeService: SalesTypeService,
    private chatPhoneService: ChatPhoneService,
    private expectedTimeService: ExpectedTimeService,
    private toast: ToastrService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SaleBox> | Promise<SaleBox> | SaleBox {
    return forkJoin([
      this.productService.getAllActiveProducts(),
      this.paymentMethod.getAllActivePaymentMethods(),
      this.deliverymanService.getAllActiveDeliveryman(),
      this.salesTypeService.getAllActiveSalesType(),
      this.chatPhoneService.getChatPhone(),
      this.expectedTimeService.getExpectedTimes()
    ]).pipe(map(
      res => {
        return {
          products: res[0],
          paymentMethods: res[1],
          deliveryman: res[2],
          salesType: res[3],
          chatPhone: res[4],
          expectedTimes: res[5]
        };
      })).pipe(catchError(
      err => {
        this.toast.error(err.error.message);
        return throwError(err);
      })
    );
  }

}
