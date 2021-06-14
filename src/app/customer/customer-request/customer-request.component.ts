import {Component, OnInit} from '@angular/core';
import {take} from 'rxjs/operators';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {SaleBox, SendProduct} from '../../shared/interfaces/sale-box';
import {PaginationInstance} from 'ngx-pagination';
import {Product} from '../../shared/interfaces/product';

@Component({
  selector: 'app-customer-request',
  templateUrl: './customer-request.component.html',
  styleUrls: ['./customer-request.component.scss']
})
export class CustomerRequestComponent implements OnInit {

  saleBox: SaleBox = {} as SaleBox;
  shoppingCart: Product[] = [];
  selectElement = 'delivery';
  details = '';
  paginateConfig: PaginationInstance = {
    id: 'product',
    currentPage: 1,
    itemsPerPage: 10
  };

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(
      res => {
        this.saleBox = res.data;
      }
    );
  }

  addProducts(product: Product): void {
    this.shoppingCart.push(product);
  }

  deleteProduct(idx: number): void {
    this.shoppingCart.splice(idx, 1);
  }

  totalValue(): number {
    return this.shoppingCart.reduce((sum, product) => {
      return sum + (product?.id_discount ? product?.product_discount_value : product.product_value);
    }, 0);
  }

  buildToRemove(): void {
    let message = '*Retirada ou consumir no local* \n *Pedidos*: \n';
    this.shoppingCart.forEach( prod => message = `${message} ${prod.product_name} \n` );
    message = `${message} *Observações*: ${this.details}`;
    message = window.encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?1=pt_BR&phone=5512991123842&text=${message}`, '_blank');
  }
}
