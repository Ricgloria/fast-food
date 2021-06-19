import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomerRoutingModule} from './customer-routing.module';
import {CustomerRequestComponent} from './customer-request/customer-request.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule} from '@angular/forms';
import {NgxCurrencyModule} from 'ngx-currency';
import {SharedModule} from '../shared/shared.module';
import {NgxMaskModule} from 'ngx-mask';
import { RequestSentComponent } from './request-sent/request-sent.component';


@NgModule({
  declarations: [
    CustomerRequestComponent,
    RequestSentComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    NgxPaginationModule,
    FormsModule,
    NgxCurrencyModule,
    SharedModule,
    NgxMaskModule
  ]
})
export class CustomerModule {
}
