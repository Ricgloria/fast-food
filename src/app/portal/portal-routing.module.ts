import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PortalContainerComponent} from './portal-container.component';
import {UsersComponent} from './users/users.component';
import {ProductComponent} from './product/product.component';
import {PaymentMethodComponent} from './payment-method/payment-method.component';
import {SalesBoxComponent} from './sales-box/sales-box.component';
import {ProductResolver} from '../core/resolver/product.resolver';
import {PaymentMethodResolver} from '../core/resolver/payment-method.resolver';
import {UserResolver} from '../core/resolver/user.resolver';
import {SalesBoxResolver} from '../core/resolver/sales-box.resolver';
import {DeliverymanComponent} from './deliveryman/deliveryman.component';
import {DeliverymanResolver} from '../core/resolver/deliveryman.resolver';
import {SalesTypeResolver} from '../core/resolver/sales-type.resolver';
import {ChatPhoneResolver} from '../core/resolver/chat-phone.resolver';
import {AuthGuard} from '../core/guards/auth.guard';
import {PasswordChangeComponent} from './password-change/password-change.component';

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
        },
        canActivate: [
          AuthGuard
        ]
      },
      {
        path: 'entregadores',
        component: DeliverymanComponent,
        resolve: {
          deliveryman: DeliverymanResolver
        },
        canActivate: [
          AuthGuard
        ]
      },
      {
        path: 'produtos',
        component: ProductComponent,
        resolve: {
          products: ProductResolver
        },
        canActivate: [
          AuthGuard
        ]
      },
      {
        path: 'metodos-de-pagamento',
        component: PaymentMethodComponent,
        resolve: {
          payments: PaymentMethodResolver,
          salesType: SalesTypeResolver,
          chatPhone: ChatPhoneResolver
        },
        canActivate: [
          AuthGuard
        ]
      },
      {
        path: 'mudar-senha',
        component: PasswordChangeComponent
      },
      {
        path: 'relatorios',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
        canActivate: [
          AuthGuard
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule {
}
