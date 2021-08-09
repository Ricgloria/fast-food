import {Component, OnInit} from '@angular/core';
import {take} from 'rxjs/operators';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {SaleBox} from '../../shared/interfaces/sale-box';
import {PaginationInstance} from 'ngx-pagination';
import {Product} from '../../shared/interfaces/product';
import {PreSalesService} from '../../core/services/pre-sales.service';
import {PreSale} from '../../shared/interfaces/pre-sale';
import {SalesTypeEnum} from '../../shared/enum/sales-type.enum';
import {PaymentMethodEnum} from '../../shared/enum/payment-method.enum';
import {mask} from '../../shared/helpers/mask.helper';
import {ExpectedTimeEnum} from '../../shared/enum/expected-time.enum';

@Component({
  selector: 'app-customer-request',
  templateUrl: './customer-request.component.html',
  styleUrls: ['./customer-request.component.scss']
})
export class CustomerRequestComponent implements OnInit {

  saleBox: SaleBox = {} as SaleBox;
  shoppingCart: Product[] = [];
  changesFor = '';
  mask = mask;
  preSale: PreSale = {
    id_chat_phone: 0,
    delivery_address: '',
    id_payment_method: 0,
    note: '',
    phone: '',
    products: [],
    sales_type_id: 0
  };

  salesTypeEnum = SalesTypeEnum;
  paymentMethodEnum = PaymentMethodEnum;
  expectedTimeEnum = ExpectedTimeEnum;

  whatsAppNumber = '';

  paginateConfig: PaginationInstance = {
    id: 'product',
    currentPage: 1,
    itemsPerPage: 10
  };

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private preSalesService: PreSalesService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(
      res => {
        this.saleBox = res.data;
        this.preSale.id_payment_method = (this.saleBox.paymentMethods[0].id_payment_method as number);
        this.preSale.sales_type_id = this.saleBox.salesType[0].sales_type_id;
        this.preSale.id_chat_phone = this.saleBox.chatPhone.id_chat_phone;
        this.whatsAppNumber = this.saleBox.chatPhone.phone;
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
    let message = this.buildProductsMessageAndID();
    message = `${message}\n*Observações*: ${this.preSale.note}\n*Forma de pagamento*: ${this.getPaymentMethodDescription()}`;
    if (this.forceToNUmber(this.preSale.id_payment_method) === this.paymentMethodEnum.MONEY) {
      message = `${message} \n*Troco para:* ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(Number(this.changesFor))}`;
    }
    this.preSale.delivery_address = '';
    this.sendPreSale(message);
  }

  buildDeliveryRemove(): void {
    let message = this.buildProductsMessageAndID();
    message = `${message}\n*Observações*: ${this.preSale.note} \n*Endereço*: ${this.preSale.delivery_address} \n*Forma de pagamento*: ${this.getPaymentMethodDescription()}`;
    if (this.forceToNUmber(this.preSale.id_payment_method) === this.paymentMethodEnum.MONEY) {
      message = `${message} \n*Troco para:* ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(Number(this.changesFor))}`;
    }
    this.sendPreSale(message);
  }

  sendPreSale(message: string): void {
    this.preSalesService.postPreSale(this.preSale).pipe(take(1)).subscribe(
      res => {
        message = `*Número do pédido:* ${res.preSaleID}\n${message}`;
        this.openWhats(message);
        this.router.navigate(['/faca-seu-pedido/pedido-enviado', res.preSaleID]);
      },
      error => this.toast.error(error)
    );
  }

  openWhats(message: string): void {
    message = window.encodeURIComponent(message);
    window.open(`https://web.whatsapp.com/send?1=pt_BR&phone=55${this.whatsAppNumber}&text=${message}`, '_blank');
  }

  getPaymentMethodDescription(): string | undefined {
    return this.saleBox.paymentMethods.find(
      pay => pay.id_payment_method === this.forceToNUmber(this.preSale.id_payment_method))?.description;
  }

  forceToNUmber(value: number | string): number {
    return Number(value);
  }

  buildProductsMessageAndID(): string {
    let message = `*${this.getShopType()}*\n*Pedidos*: \n`;
    this.preSale.products = [];
    this.shoppingCart.forEach(prod => {
      message = `${message} ${prod.product_name} \n`;
      if (prod.id_product != null) {
        this.preSale.products.push(prod.id_product);
      }
    });
    return message;
  }

  getPhoneMask(): string {
    return this.preSale.phone.length === 10 ? mask.phone : mask.cellphone;
  }

  getExpectedTime(id: number): string | undefined {
    return this.saleBox.expectedTimes.find(ex => ex.id_expected_time === id)?.time;
  }

  getShopType(): string | undefined {
    return this.saleBox.salesType.find(type => type.sales_type_id === this.forceToNUmber(this.preSale.sales_type_id))?.name;
  }
}
