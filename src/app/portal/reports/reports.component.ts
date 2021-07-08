import {Component, OnInit} from '@angular/core';
import {Sale, SalesReport} from '../../shared/interfaces/sale-box';
import {PaginationInstance} from 'ngx-pagination';
import {map, take} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Label, SingleOrMultiDataSet} from 'ng2-charts/lib/base-chart.directive';
import {ChartOptions, ChartType} from 'chart.js';
import {ReportBasis, ReportInterface} from '../../shared/interfaces/report-basis';
import {PreSalesReport} from '../../shared/interfaces/pre-sale';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  allSales: Sale[] = [];

  preSalesTypeChart!: Chart;
  preSalesPaymentChart!: Chart;
  preSalesConversion!: Chart;

  salesUsersChart!: Chart;
  salesDeliverymanChart!: Chart;
  salesPaymentMethodChart!: Chart;
  salesTypeChart!: Chart;

  salesPag: PaginationInstance = {
    id: 'sales',
    currentPage: 1,
    itemsPerPage: 10,
  };

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.activatedRoute.data.pipe(take(1)).pipe(map(
      res => res as { reports: ReportInterface })).subscribe(
      res => {
        this.allSales = res.reports.allSales;
        this.preSalesChartsDataInsert(res.reports.preSalesReport);
        this.salesChartsDataInsert(res.reports.salesReports);

      });
  }

  preSalesChartsDataInsert(preSalesReport: PreSalesReport): void {
    this.preSalesTypeChart = this.generateTypeChart(preSalesReport.salesType);
    this.preSalesPaymentChart = this.generateTypeChart(preSalesReport.paymentMethods);
    this.preSalesConversion = this.generateTypeChart(preSalesReport.status);
  }

  salesChartsDataInsert(salesReport: SalesReport): void {
    this.salesUsersChart = this.generateTypeChart(salesReport.users);
    this.salesDeliverymanChart = this.generateTypeChart(salesReport.deliverymen);
    this.salesPaymentMethodChart = this.generateTypeChart(salesReport.paymentMethods);
    this.salesTypeChart = this.generateTypeChart(salesReport.salesType);
  }

  generateTypeChart(reports: ReportBasis[], chartType: ChartType = 'pie'): Chart {
    return {
      options: {responsive: true},
      data: reports.map(report => report.total),
      labels: reports.map(report => report.name),
      chartType
    };
  }

/*  generateTypeChart(reports: ReportBasis[], chartType: ChartType = 'pie'): Chart {
    return {
      options: {responsive: true, scales: {yAxes: [{ticks: {stepSize: 1, beginAtZero: true}}]} },
      data: reports.map(report => report.total),
      labels: reports.map(report => report.name),
      chartType
    };
  }*/
}

interface Chart {
  options: ChartOptions;
  data: SingleOrMultiDataSet;
  labels: Label[];
  chartType: ChartType;
}
