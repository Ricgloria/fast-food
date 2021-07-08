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
import {SalesBoxResolver} from '../core/resolver/sales-box.resolver';
import {ReportsResolver} from '../core/resolver/reports.resolver';
import {DeliverymanComponent} from './deliveryman/deliveryman.component';
import {DeliverymanResolver} from '../core/resolver/deliveryman.resolver';
import {SalesTypeResolver} from '../core/resolver/sales-type.resolver';
import {ChatPhoneResolver} from '../core/resolver/chat-phone.resolver';

const routes: Routes = [
  {
    path: '',
    component: PortalContainerComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'caixa'
      },
      {
        path: 'caixa',
        component: SalesBoxComponent,
        resolve: {
          data: SalesBoxResolver
        }
      },
      {
        path: 'usuarios',
        component: UsersComponent,
        resolve: {
          users: UserResolver
        }
      },
      {
        path: 'entregadores',
        component: DeliverymanComponent,
        resolve: {
          deliveryman: DeliverymanResolver
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
          payments: PaymentMethodResolver,
          salesType: SalesTypeResolver,
          chatPhone: ChatPhoneResolver
        }
      },
      {
        path: 'relatorios',
        component: ReportsComponent,
        resolve: {
          reports: ReportsResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
