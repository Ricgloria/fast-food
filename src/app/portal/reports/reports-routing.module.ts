import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReportsComponent} from './reports/reports.component';
import {ReportsResolver} from '../../core/resolver/reports.resolver';
import {ReportDetailsComponent} from './report-details/report-details.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path: 'detalhes-conversao',
    component: ReportDetailsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path: 'vendas-por-usuario',
    component: ReportDetailsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path: 'entregas-por-entregadores',
    component: ReportDetailsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path: 'todos-os-produtos',
    component: ReportDetailsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path: 'todas-as-vendas',
    component: ReportDetailsComponent,
    resolve: {
      reports: ReportsResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
