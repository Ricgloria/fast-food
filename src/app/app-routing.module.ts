import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './core/login/login.component';
import {LoginGuard} from './core/guards/login.guard';
import {CustomerRequestComponent} from './customer/customer-request/customer-request.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'faca-seu-pedido',
    component: CustomerRequestComponent
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
export class AppRoutingModule { }
