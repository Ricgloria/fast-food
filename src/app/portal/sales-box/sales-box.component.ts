import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {SaleBox, SendCleanProduct, SendProduct, SendSale} from '../../shared/interfaces/sale-box';
import {Product} from '../../shared/interfaces/product';
import {SalesService} from '../../core/services/sales.service';
import {SalesTypeEnum} from '../../shared/enum/sales-type.enum';
import {ExpectedTime} from '../../shared/interfaces/expected-time';
import {ExpectedTimeEnum} from '../../shared/enum/expected-time.enum';
import {ExpectedTimeService} from '../../core/services/expected-time.service';
import {PreSalesService} from '../../core/services/pre-sales.service';
import {PreSale} from '../../shared/interfaces/pre-sale';

@Component({
  selector: 'app-sales-box',
  templateUrl: './sales-box.component.html',
  styleUrls: ['./sales-box.component.scss']
})
export class SalesBoxComponent implements OnInit {

  saleBox: SaleBox | undefined;
  sendProducts: SendProduct[] = [];
  salesTypeEnum = SalesTypeEnum;
  expectedTimeEnum = ExpectedTimeEnum;

  deliveryTime!: ExpectedTime;
  inPlaceTime!: ExpectedTime;
  preSale = '';

  saleForm: FormGroup = this.formBuilder.group({});

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private salesService: SalesService,
    private expectedTimeService: ExpectedTimeService,
    private preSalesService: PreSalesService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.getData();
  }

  createForm(preSale?: PreSale): void {
    this.saleForm = this.formBuilder.group({
      id_sale: [preSale?.id_sale || ''],
      id_product: [''],
      amount: [1],
      id_payment_method: [preSale?.id_payment_method || '', Validators.required],
      sales_type_id: [preSale?.sales_type_id || '', Validators.required],
      delivery_address: [preSale?.delivery_address || null],
      id_deliveryman: [''],
      note: [preSale?.note || '']
    });

    setTimeout(() => {
      this.clearDeliveryData();
    }, 150);
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
        this.deliveryTime = (this.saleBox?.expectedTimes.find(
          ex => ex.id_expected_time === this.expectedTimeEnum.DELIVERY) as ExpectedTime);
        this.inPlaceTime = (this.saleBox?.expectedTimes.find(
          ex => ex.id_expected_time === this.expectedTimeEnum.OTHERS) as ExpectedTime);
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
    if (Number(this.saleForm.get('sales_type_id')?.value) !== this.salesTypeEnum.DELIVERY) {
      this.disableDeliveryFields();
    } else {
      this.enableDeliveryFields();
    }
  }

  sendSale(): void {
    const sendSale: SendSale = {
      id_payment_method: this.saleForm?.get('id_payment_method')?.value,
      sales_type_id: this.saleForm?.get('sales_type_id')?.value,
      delivery_address: this.saleForm?.get('delivery_address')?.value || null,
      id_deliveryman: this.saleForm?.get('id_deliveryman')?.value || null,
      note: this.saleForm?.get('note')?.value || null,
      sale_value: this.totalValue(),
      send_products: this.sendProducts.map(send => {
        return {
          amount: send.amount,
          id_product: send.product.id_product
        };
      }) as SendCleanProduct[]
    };

    this.salesService.postSale(sendSale).subscribe(
      resp => {
        this.toast.success('Venda realizada com sucesso');
        if (this.saleForm?.get('id_sale')?.value) {
          this.finalizePreSale(this.saleForm?.get('id_sale')?.value, resp.insertId);
        } else {
          this.clearBox();
        }
      },
      error => this.toast.error(error.error.message)
    );
  }

  clearBox(): void {
    this.preSale = '';
    this.sendProducts.splice(0);
    this.createForm();
  }

  changeTime(time: ExpectedTime): void {
    this.expectedTimeService.patchExpectedTime(time.id_expected_time, time.time).pipe(take(1)).subscribe(
      () => this.toast.success('Tempo atualizado com sucesso'),
      error => this.toast.error(error)
    );
  }

  getPreSale(): void {
    this.sendProducts.splice(0);
    this.createForm();
    this.preSalesService.getActivePreSaleById(Number(this.preSale)).pipe(take(1)).subscribe(
      res => {
        this.createForm(res);
        this.addProductsForId(res.products);
      },
      error => this.toast.error(error.error.message)
    );
  }

  addProductsForId(productsId: number[]): void {
    productsId.forEach(id => {
      const send: SendProduct = {
        amount: 1,
        product: (this.saleBox?.products.find(product => product.id_product === id) as Product)
      };
      this.sendProducts.push(send);
    });
  }

  finalizePreSale(id: number | string, insertId: number | string): void {
    this.preSalesService.patchFinishPreSale(id, insertId).pipe(take(1)).subscribe(
      resp => {
        this.clearBox();
        this.toast.success('Pré venda finalizada com sucesso');
        this.deliveryTime.time = resp.delivery_time;
        this.inPlaceTime.time = resp.time;
      },
      error => {
        this.toast.error(error.error.message);
        this.clearBox();
      }
    );
  }
}
