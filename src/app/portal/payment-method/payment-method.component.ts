import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentMethod} from '../../shared/interfaces/payment-method';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {PaymentMethodService} from '../../core/services/payment-method.service';
import {take} from 'rxjs/operators';
import {SalesType} from '../../shared/interfaces/sales-type';
import {SalesTypeService} from '../../core/services/sales-type.service';
import {mask} from '../../shared/helpers/mask.helper';
import {ChatPhoneService} from '../../core/services/chat-phone.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {

  payments: PaymentMethod[] = [];
  salesType: SalesType[] = [];
  phoneFlag = false;
  whatsForm!: FormGroup;
  phone = '';

  constructor(
    private formBuilder: FormBuilder,
    private paymentMethodService: PaymentMethodService,
    private salesTypeService: SalesTypeService,
    private chatPhoneService: ChatPhoneService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(
      res => {
        this.payments = res.payments;
        this.salesType = res.salesType;
        this.phone = res.chatPhone.phone;
        this.createWhatsForm();
      });
  }

  changePayment(paymentMethod: PaymentMethod, event: boolean): void {
    paymentMethod.status = event ? 1 : 0;
    this.disableAndEnablePayment({...paymentMethod});
  }

  disableAndEnablePayment(paymentMethod: PaymentMethod): void {
    const id: number = paymentMethod.id_payment_method || 0;
    delete paymentMethod.id_payment_method;

    this.paymentMethodService.putPaymentMethod(paymentMethod, id).pipe(take(1)).subscribe(
      res => {
        const message = res.status ? 'ativado' : 'inativado';
        this.toast.success(`Método de pagamento ${message} com sucesso`);
      },
      error => this.toast.error(error)
    );
  }

  changeSalesType(saleType: SalesType, event: boolean): void {
    saleType.status = event ? 1 : 0;
    this.disableAndSalesType({...saleType});
  }

  disableAndSalesType(saleType: SalesType): void {
    this.salesTypeService.patchStatusSaleType(saleType.sales_type_id, saleType.status).pipe(take(1)).subscribe(
      () => {
        const message = saleType.status ? 'ativado' : 'inativado';
        this.toast.success(`Tipo de venda ${message} com sucesso`);
      },
      error => this.toast.error(error)
    );
  }

  getPhoneMask(): string {
    return (this.whatsForm.get('phone') as unknown as string)?.length === 10 ? mask.phone : mask.cellphone;
  }

  createWhatsForm(): void {
    this.whatsForm = this.formBuilder.group({
      phone: [this.phone || '', Validators.required]
    });
    setTimeout(() => this.whatsForm.disable(), 150);
  }

  editWhatsFormState(): void {
    this.phoneFlag = !this.phoneFlag;
    if (this.phoneFlag) {
      this.whatsForm.enable();
    } else {
      this.createWhatsForm();
    }
  }

  saveWhats(): void {
    const phone = this.whatsForm.get('phone')?.value;
    this.chatPhoneService.patchChatPhone(phone).pipe(take(1)).subscribe(
      () => {
        this.phone = phone;
        this.editWhatsFormState();
        this.toast.success('Telefone de chat editado com sucesso');
      },
      error => this.toast.error(error)
    );
  }
}
