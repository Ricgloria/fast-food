import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalRoutingModule } from './portal-routing.module';
import { PortalContainerComponent } from './portal-container.component';
import { UsersComponent } from './users/users.component';
import {SharedModule} from '../shared/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxMaskModule} from 'ngx-mask';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProductComponent } from './product/product.component';
import {NgxCurrencyModule} from 'ngx-currency';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { SalesBoxComponent } from './sales-box/sales-box.component';
import { ReportsComponent } from './reports/reports.component';
import { DeliverymanComponent } from './deliveryman/deliveryman.component';
import {ChartsModule} from 'ng2-charts';


@NgModule({
  declarations: [
    PortalContainerComponent,
    UsersComponent,
    ProductComponent,
    PaymentMethodComponent,
    SalesBoxComponent,
    ReportsComponent,
    DeliverymanComponent
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgxMaskModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    FormsModule,
    ChartsModule
  ],
  bootstrap: [
    PortalContainerComponent
  ]
})
export class PortalModule { }
