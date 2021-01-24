import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PortalContainerComponent} from './portal-container.component';
import {UsersComponent} from './users/users.component';
import {ProductComponent} from './product/product.component';
import {PaymentMethodComponent} from './payment-method/payment-method.component';
import {SalesBoxComponent} from './sales-box/sales-box.component';
import {ReportsComponent} from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: PortalContainerComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'usuarios'
      },
      {
        path: 'caixa',
        component: SalesBoxComponent
      },
      {
        path: 'usuarios',
        component: UsersComponent
      },
      {
        path: 'produtos',
        component: ProductComponent
      },
      {
        path: 'metodos-de-pagamento',
        component: PaymentMethodComponent
      },
      {
        path: 'relatorios',
        component: ReportsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
