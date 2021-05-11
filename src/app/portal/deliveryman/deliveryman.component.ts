import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, take} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {Deliveryman} from '../../shared/interfaces/deliveryman';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {mask} from '../../shared/helpers/mask.helper';
import {DeliverymanService} from '../../core/services/deliveryman.service';
import {PaginationInstance} from 'ngx-pagination';

@Component({
  selector: 'app-deliveryman',
  templateUrl: './deliveryman.component.html',
  styleUrls: ['./deliveryman.component.scss']
})
export class DeliverymanComponent implements OnInit, OnDestroy {

  paginateConfig: PaginationInstance = {
    id: 'delivery',
    currentPage: 1,
    itemsPerPage: 10
  };

  deliveryman: Deliveryman[] = [];
  filteredDeliveryman: Deliveryman[] = [];
  search = new FormControl();
  subscription: Subscription | undefined;
  deliverymanForm: FormGroup = this.newFormGroupFactory();

  mask = mask;
  isEdit = false;
  isSee = false;

  constructor(
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private deliverymanService: DeliverymanService
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getData(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(
      res => {
        this.deliveryman = res.deliveryman;
        this.filteredDeliveryman = res.deliveryman;
        this.filterDeliveryman();
      }
    );
  }

  getAllDeliveryman(): void {
    this.deliverymanService.getAllDeliveryman().pipe(take(1)).subscribe(
      res => {
        this.deliveryman = res;
        this.filteredDeliveryman = res;
      },
      error => this.toast.error(error)
    );
  }

  filterDeliveryman(): void {
    this.subscription = this.search.valueChanges.pipe(debounceTime(200)).subscribe(
      (value: string) => {
        if (value) {
          this.filteredDeliveryman = this.deliveryman.filter(user => user.name.toUpperCase().includes(value.toUpperCase()));
        } else {
          this.filteredDeliveryman = this.deliveryman;
        }
      }
    );
  }

  createForm(deliveryman?: Deliveryman): void {
    if (deliveryman?.id_deliveryman) {
      this.deliverymanForm = this.editFormGroupFactory(deliveryman);
      setTimeout( () => this.deliverymanForm.disable(), 200);
    } else {
      this.deliverymanForm = this.newFormGroupFactory();
      setTimeout( () => this.deliverymanForm.enable(), 200);
    }

  }

  editFormGroupFactory(deliveryman: Deliveryman): FormGroup {
    return this.formBuilder.group({
      id_deliveryman: [deliveryman.id_deliveryman],
      name: [deliveryman?.name, Validators.required],
      phone: [deliveryman?.phone, Validators.required],
      motorcycle: [deliveryman?.motorcycle],
      status: [deliveryman?.status, Validators.required],
    });
  }

  newFormGroupFactory(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      motorcycle: [''],
      status: [1, Validators.required],
    });
  }

  editState(): void {
    this.isEdit = !this.isEdit;
    if (this.isEdit) {
      this.deliverymanForm.enable();
    } else {
      this.deliverymanForm.disable();
    }
  }

  seeState(): void {
    this.isSee = false;
    this.isEdit = false;
    this.createForm();
  }

  onSeeClick(deliveryman: Deliveryman): void {
    this.createForm(deliveryman);
    this.isSee = true;
  }

  getPhoneMask(): string {
    return (this.deliverymanForm.get('phone')?.value as string).length === 10 ? mask.phone : mask.cellphone;
  }

  deleteDelivery(): void {
    const id = this.deliverymanForm.get('id_deliveryman')?.value;
    this.deliverymanService.deleteDeliveryman(id).pipe(take(1)).subscribe(
      res => {
        this.getAllDeliveryman();
        this.toast.success(res.message);
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  saveDeliveryman(): void {
    const delivery: Deliveryman = this.deliverymanForm.getRawValue();
    delivery.status = Number(delivery.status);
    if (delivery.id_deliveryman) {
      this.putUser(delivery);
    } else {
      this.postUser(delivery);
    }
  }

  postUser(user: Deliveryman): void {
    this.deliverymanService.postDeliveryman(user).pipe(take(1)).subscribe(
      () => {
        this.getAllDeliveryman();
        this.toast.success('Entregador cadastrado com sucesso');
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  putUser(del: Deliveryman): void {
    const id: number = del.id_deliveryman || 0;
    delete del.id_deliveryman;

    this.deliverymanService.putDeliveryman(del, id).pipe(take(1)).subscribe(
      () => {
        this.toast.success(`Entregador editado com sucesso`);
        this.getAllDeliveryman();
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  change(user: Deliveryman, event: boolean): void {
    user.status = event ? 1 : 0;
    this.disableAndEnable({...user});
  }

  disableAndEnable(user: Deliveryman): void {
    const id: number = user.id_deliveryman || 0;
    delete user.id_deliveryman;

    this.deliverymanService.putDeliveryman(user, id).pipe(take(1)).subscribe(
      res => {
        const message = res.status ? 'ativado' : 'inativado';
        this.toast.success(`Entregador ${message} com sucesso`);
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }
}
