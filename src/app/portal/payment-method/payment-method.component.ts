import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PaymentMethod} from '../../shared/interfaces/payment-method';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {PaymentMethodService} from '../../core/services/payment-method.service';
import {debounceTime, take} from 'rxjs/operators';
import {Product} from '../../shared/interfaces/product';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit, OnDestroy {

  paginateConfig: PaginationInstance = {
    id: 'payment',
    currentPage: 1,
    itemsPerPage: 10
  };

  search = new FormControl();
  subscription: Subscription | undefined;

  isEdit = false;
  isSee = false;
  paymentForm: FormGroup = this.newFormGroupFactory();

  payments: PaymentMethod[] = [];
  filteredPayments: PaymentMethod[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private paymentMethodService: PaymentMethodService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getData(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(res => {
      this.payments = res.payments;
      this.filteredPayments = res.payments;
      this.filter();
    });
  }

  filter(): void {
    this.subscription = this.search.valueChanges.pipe(debounceTime(200)).subscribe(
      (value: string) => {
        if (value) {
          this.filteredPayments = this.payments.filter(pay => pay.description.toUpperCase().includes(value.toUpperCase()));
        } else {
          this.filteredPayments = this.payments;
        }
      }
    );
  }

  getPaymentMethods(): void {
    this.paymentMethodService.getAllPaymentMethods().pipe(take(1)).subscribe(
      res => {
        this.filteredPayments = res;
        this.payments = res;
      });
  }

  createForm(paymentMethod?: PaymentMethod): void {
    if (paymentMethod?.id_payment_method) {
      this.paymentForm.disable();
      this.paymentForm = this.editFormGroupFactory(paymentMethod);
      this.paymentForm.disable();
    } else {
      this.paymentForm.enable();
      this.paymentForm = this.newFormGroupFactory();
      this.paymentForm.enable();
    }
  }

  editFormGroupFactory(paymentMethod: PaymentMethod): FormGroup {
    return this.formBuilder.group({
      id_payment_method: [paymentMethod.id_payment_method],
      description: [paymentMethod.description, Validators.required],
      status: [paymentMethod.status, Validators.required]
    });
  }

  newFormGroupFactory(): FormGroup {
    return this.formBuilder.group({
      description: ['', Validators.required],
      status: [1]
    });
  }

  editState(): void {
    this.isEdit = !this.isEdit;
    if (this.isEdit) {
      this.paymentForm.enable();
    } else {
      this.paymentForm.disable();
    }
  }

  seeState(): void {
    this.isSee = false;
    this.isEdit = false;
    this.createForm();
  }

  onSeeClick(paymentMethod: PaymentMethod): void {
    this.createForm(paymentMethod);
    this.isSee = true;
  }

  deletePaymentMethod(): void {
    const id = this.paymentForm.get('id_payment_method')?.value;
    this.paymentMethodService.deletePaymentMethod(id).pipe(take(1)).subscribe(
      res => {
        this.getPaymentMethods();
        this.toast.success(res.message);
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  savePaymentMethod(): void {
    const paymentMethod: PaymentMethod = this.paymentForm.getRawValue();
    paymentMethod.status = Number(paymentMethod.status);
    if (paymentMethod.id_payment_method) {
      this.putPaymentMethod(paymentMethod);
    } else {
      this.postPaymentMethod(paymentMethod);
    }
  }

  postPaymentMethod(paymentMethod: PaymentMethod): void {
    this.paymentMethodService.postPaymentMethod(paymentMethod).pipe(take(1)).subscribe(
      () => {
        this.getPaymentMethods();
        this.toast.success('Método de pagamento criado com sucesso');
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  putPaymentMethod(paymentMethod: PaymentMethod): void {
    const id: number = paymentMethod.id_payment_method || 0;
    delete paymentMethod.id_payment_method;

    this.paymentMethodService.putPaymentMethod(paymentMethod, id).pipe(take(1)).subscribe(
      () => {
        this.getPaymentMethods();
        this.toast.success('Método de pagamento editado com sucesso');
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  change(paymentMethod: PaymentMethod, event: boolean): void {
    paymentMethod.status = event ? 1 : 0;
    this.disableAndEnable({...paymentMethod});
  }

  disableAndEnable(paymentMethod: PaymentMethod): void {
    const id: number = paymentMethod.id_payment_method || 0;
    delete paymentMethod.id_payment_method;

    this.paymentMethodService.putPaymentMethod(paymentMethod, id).pipe(take(1)).subscribe(
      res => {
        const message = res.status ? 'ativado' : 'inativado';
        this.toast.success(`Método de pagamento ${message} com sucesso`);
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }
}
