import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CustomerRequestComponent} from './customer-request/customer-request.component';
import {SalesBoxResolver} from '../core/resolver/sales-box.resolver';
import {RequestSentComponent} from './request-sent/request-sent.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerRequestComponent,
    resolve: {
      data: SalesBoxResolver
    }
  },
  {
    path: 'pedido-enviado/:request',
    component: RequestSentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {
}
