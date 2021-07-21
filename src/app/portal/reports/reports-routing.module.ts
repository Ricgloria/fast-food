import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsComponent} from './reports/reports.component';
import {ReportsResolver} from '../../core/resolver/reports.resolver';
import {ReportDetailsComponent} from './report-details/report-details.component';
import {ReportsDetails} from '../../shared/enum/reports-details.enum';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path:  ReportsDetails.MENU_SALES_TYPE,
    component: ReportDetailsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path: ReportsDetails.MENU_PAYMENT_METHOD,
    component: ReportDetailsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path: ReportsDetails.CONVERSION,
    component: ReportDetailsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path: ReportsDetails.SALES_BY_USER,
    component: ReportDetailsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path: ReportsDetails.DELIVERY_BY_DELIVERYMAN,
    component: ReportDetailsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path: ReportsDetails.ALL_PRODUCTS_SALE,
    component: ReportDetailsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path: ReportsDetails.SALES_BOX_SALES_TYPE,
    component: ReportDetailsComponent,
    resolve: {
      reports: ReportsResolver
    }
  },
  {
    path:  ReportsDetails.SALES_BOX_PAYMENT_METHOD,
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
export class ReportsRoutingModule {
}
