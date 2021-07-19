import {Component, OnInit} from '@angular/core';
import {Sale, SalesReport} from '../../shared/interfaces/sale-box';
import {PaginationInstance} from 'ngx-pagination';
import {map, take} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Label, SingleOrMultiDataSet} from 'ng2-charts/lib/base-chart.directive';
import {ChartData, ChartDataSets, ChartOptions, ChartTooltipItem, ChartType} from 'chart.js';
import {ReportBasis, ReportInterface} from '../../shared/interfaces/report-basis';
import {PreSalesReport} from '../../shared/interfaces/pre-sale';
import ChartDataLabels from 'chartjs-plugin-labels';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  allSales: Sale[] = [];
  allSalesProducts: ReportBasis[] = [];
  total = 0;

  salesReport!: SalesReport;

  salesBoxControl = 1;
  salesBoxControlEnum = SalesBoxControlEnum;

  preSalesTypeChart!: Chart;
  preSalesPaymentChart!: Chart;
  preSalesConversion!: Chart;

  salesUsersChart!: Chart;
  salesDeliverymanChart!: Chart;
  salesPaymentMethodChart!: Chart;
  salesTypeChart!: Chart;
  saleBoxChart!: Chart;

  salesPag: PaginationInstance = {
    id: 'sales',
    currentPage: 1,
    itemsPerPage: 10,
  };

  productSales: PaginationInstance = {
    id: 'productSales',
    currentPage: 1,
    itemsPerPage: 6,
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
    this.salesReport = salesReport;
    this.salesUsersChart = this.generateTypeChart(salesReport.users);
    this.salesDeliverymanChart = this.generateTypeChart(salesReport.deliverymen);
    this.salesPaymentMethodChart = this.generateTypeChart(salesReport.paymentMethods);
    this.salesTypeChart = this.generateTypeChart(salesReport.salesType);
    this.allSalesProducts = salesReport.itemsSale;
    this.total = salesReport.total;
    this.changeLineChart();
  }

  changeLineChart(): void {
    switch (Number(this.salesBoxControl)) {
      case this.salesBoxControlEnum.SEVEN_DAYS:
        this.saleBoxChart = this.generateLineTypeChart(this.salesReport.lastSevenDays, 'Sete dias', 'line');
        break;
      case this.salesBoxControlEnum.LAST_MONTH:
        this.saleBoxChart = this.generateLineTypeChart(this.salesReport.lastMonth, 'Último mês', 'line');
        break;
      case this.salesBoxControlEnum.LAST_SIX_MONTH:
        this.saleBoxChart = this.generateLineTypeChart(this.salesReport.sixMonth, 'Seis meses', 'line');
        break;
      case this.salesBoxControlEnum.FULL_TIME:
        this.saleBoxChart = this.generateLineTypeChart(this.salesReport.allSales, 'Tudo', 'line');
        break;
    }
  }

  generateTypeChart(reports: ReportBasis[], chartType: ChartType = 'pie'): Chart {
    return {
      lineChartData: [],
      plugins: [ChartDataLabels],
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          labels: {
            render: 'percentage',
            fontColor: '#474747',
            precision: 2,
            fontSize: 10
          }
        },
      },
      data: reports.map(report => report.total),
      labels: reports.map(report => report.name),
      chartType
    };
  }

  generateLineTypeChart(reports: ReportBasis[], label: string, chartType: ChartType = 'line'): Chart {
    return {
      data: [],
      plugins: [ChartDataLabels],
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          yAxes: [{
            ticks: {
              callback(value: number | string, index: number, values: number[] | string[]): string | number | null | undefined {
                return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
              }
            }
          }],
        },
        tooltips: {
          callbacks: {
            label(tooltipItem: ChartTooltipItem, data: ChartData): string | string[] {
              return Number(tooltipItem.yLabel).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
            }
          }
        },
      },
      lineChartData: [{data: reports.map(report => report.total), label}],
      labels: reports.map(report => report.name),
      chartType
    };
  }

  getPercentage(totalProduct: number): number {
    return ((totalProduct / this.total) * 100);
  }
}

interface Chart {
  options: ChartOptions;
  lineChartData: ChartDataSets[];
  data: SingleOrMultiDataSet;
  labels: Label[];
  chartType: ChartType;
  plugins: any[];
}

enum SalesBoxControlEnum {
  SEVEN_DAYS = 1,
  LAST_MONTH,
  LAST_SIX_MONTH,
  FULL_TIME
}
