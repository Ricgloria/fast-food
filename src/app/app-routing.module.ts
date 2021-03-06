import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './core/login/login.component';
import {LoginGuard} from './core/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'faca-seu-pedido'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'faca-seu-pedido',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./portal/portal.module').then(m => m.PortalModule),
    canActivate: [
      LoginGuard
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
