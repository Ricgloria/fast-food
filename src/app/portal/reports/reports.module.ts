import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import {ReportsComponent} from './reports/reports.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';
import { ReportDetailsComponent } from './report-details/report-details.component';
import { ReportDetailsTableComponent } from './report-details-table/report-details-table.component';


@NgModule({
  declarations: [
    ReportsComponent,
    ReportDetailsComponent,
    ReportDetailsTableComponent
  ],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        NgxPaginationModule,
        FormsModule,
        ChartsModule,
        ReactiveFormsModule
    ]
})
export class ReportsModule { }
