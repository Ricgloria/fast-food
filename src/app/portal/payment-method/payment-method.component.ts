import {Component, OnInit} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentMethod} from '../../shared/interfaces/payment-method';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {

  paginateConfig: PaginationInstance = {
    id: 'payment',
    currentPage: 1,
    itemsPerPage: 10
  };

  isEdit = false;
  isSee = false;
  paymentForm: FormGroup = this.newFormGroupFactory();

  payments: PaymentMethod[] = [
    {
      id_payment_method: 1,
      description: 'Crédito',
      status: true
    },
    {
      id_payment_method: 1,
      description: 'Débito',
      status: true
    },
    {
      id_payment_method: 1,
      description: 'Dinheiro',
      status: true
    }
  ];

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
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
      status: [true]
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
    console.log(this.paymentForm.get('id_payment_method')?.value);
  }

  savePaymentMethod(): void {
    const paymentMethod: PaymentMethod = this.paymentForm.getRawValue();
    if (paymentMethod.id_payment_method) {
      console.log(paymentMethod);
    } else {
      console.log(paymentMethod);
    }
  }
}
