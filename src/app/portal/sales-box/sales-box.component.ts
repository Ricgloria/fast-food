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
      is_delivery: [false],
      delivery_address: [null],
      id_deliveryman: [''],
      note: ['']
    });
    this.disableDeliveryFields();
  }

  disableDeliveryFields(): void {
    this.saleForm.get('delivery_address')?.setValue('');
    this.saleForm.get('id_deliveryman')?.setValue('');
    this.saleForm.get('delivery_address')?.disable();
    this.saleForm.get('id_deliveryman')?.disable();
    this.saleForm.get('delivery_address')?.setValidators(null);
    this.saleForm.get('delivery_address')?.updateValueAndValidity();
    this.saleForm.get('id_deliveryman')?.setValidators(null);
    this.saleForm.get('id_deliveryman')?.updateValueAndValidity();
  }

  enableDeliveryFields(): void {
    this.saleForm.get('delivery_address')?.enable();
    this.saleForm.get('id_deliveryman')?.enable();
    this.saleForm.get('delivery_address')?.setValidators([Validators.required]);
    this.saleForm.get('delivery_address')?.updateValueAndValidity();
    this.saleForm.get('id_deliveryman')?.setValidators([Validators.required]);
    this.saleForm.get('id_deliveryman')?.updateValueAndValidity();
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
      return sum + (send.amount *
        (send?.product?.id_discount ? send?.product.product_discount_value : send.product.product_value));
    }, 0);
  }

  clearDeliveryData(): void {
    const value = this.saleForm.get('is_delivery')?.value;
    if (!value) {
      this.disableDeliveryFields();
    } else {
      this.enableDeliveryFields();
    }
  }

  sendSale(): void {
    const sendSale: SendSale = {
      id_payment_method: Number(this.saleForm?.get('id_payment_method')?.value),
      is_delivery: Number(this.saleForm?.get('is_delivery')?.value),
      delivery_address: this.saleForm?.get('delivery_address')?.value,
      id_deliveryman: Number(this.saleForm?.get('is_delivery')?.value) ? Number(this.saleForm?.get('id_deliveryman')?.value) : null,
      note: this.saleForm?.get('note')?.value,
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

  clearBox(): void {
    this.sendProducts.splice(0);
    this.createForm();
  }
}
