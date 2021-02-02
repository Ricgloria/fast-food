import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PortalContainerComponent} from './portal-container.component';
import {UsersComponent} from './users/users.component';
import {ProductComponent} from './product/product.component';
import {PaymentMethodComponent} from './payment-method/payment-method.component';
import {SalesBoxComponent} from './sales-box/sales-box.component';
import {ReportsComponent} from './reports/reports.component';
import {ProductResolver} from '../core/resolver/product.resolver';
import {PaymentMethodResolver} from '../core/resolver/payment-method.resolver';
import {UserResolver} from '../core/resolver/user.resolver';

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
        component: UsersComponent,
        resolve: {
          users: UserResolver
        }
      },
      {
        path: 'produtos',
        component: ProductComponent,
        resolve: {
          products: ProductResolver
        }
      },
      {
        path: 'metodos-de-pagamento',
        component: PaymentMethodComponent,
        resolve: {
          payments: PaymentMethodResolver
        }
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
