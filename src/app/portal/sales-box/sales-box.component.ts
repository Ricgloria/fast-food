import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {SaleBox, SendCleanProduct, SendProduct, SendSale} from '../../shared/interfaces/sale-box';
import {Product} from '../../shared/interfaces/product';
import {SalesService} from '../../core/services/sales.service';

@Component({
  selector: 'app-sales-box',
  templateUrl: './sales-box.component.html',
  styleUrls: ['./sales-box.component.scss']
})
export class SalesBoxComponent implements OnInit {

  saleBox: SaleBox | undefined;
  sendProducts: SendProduct[] = [];

  saleForm: FormGroup = this.formBuilder.group({});

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private salesService: SalesService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.getData();
  }

  createForm(): void {
    this.saleForm = this.formBuilder.group({
      id_product: [''],
      amount: [1],
      id_payment_method: ['', Validators.required],
    });
  }

  getData(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(
      res => {
        this.saleBox = res.data;
      }
    );
  }

  addProducts(): void {
    const id = Number(this.saleForm?.get('id_product')?.value);
    const amount = Number(this.saleForm?.get('amount')?.value);
    const send: SendProduct = {
      amount,
      product: (this.saleBox?.products.find(product => product.id_product === id) as Product)
    };
    this.sendProducts.push(send);
  }

  deleteProduct(idx: number): void {
    this.sendProducts.splice(idx, 1);
  }

  totalValue(): number {
    return this.sendProducts.reduce((sum, send) => {
      return sum + (send.amount * send?.product.product_value);
    }, 0);
  }

  sendSale(): void {
    const sendSale: SendSale = {
      id_payment_method: Number(this.saleForm?.get('id_payment_method')?.value),
      sale_value: this.totalValue(),
      send_products: this.sendProducts.map(send => {
        return {
          amount: send.amount,
          id_product: send.product.id_product
        };
      }) as SendCleanProduct[]
    };

    this.salesService.postSale(sendSale).subscribe(
      () => {
        this.toast.success('Venda realizada com sucesso');
        this.clearBox();
      },
      error => this.toast.error(error)
    );
  }

  clearBox(): void  {
    this.sendProducts.splice(0);
    this.createForm();
  }
}
