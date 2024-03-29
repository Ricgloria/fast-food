import {Component, OnInit} from '@angular/core';
import {Sale, SalesReport} from '../../../shared/interfaces/sale-box';
import {PaginationInstance} from 'ngx-pagination';
import {map, take} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ChartData, ChartTooltipItem, ChartType} from 'chart.js';
import {ReportBasis, ReportInterface} from '../../../shared/interfaces/report-basis';
import {PreSalesReport} from '../../../shared/interfaces/pre-sale';
import ChartDataLabels from 'chartjs-plugin-labels';
import {Chart} from '../../../shared/interfaces/chart';
import {SalesBoxControlEnum} from '../../../shared/enum/sales-box-control-enum.enum';
import {ReportsDetails} from '../../../shared/enum/reports-details.enum';
import Utils from '../../../shared/helpers/utils';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PreSalesService} from '../../../core/services/pre-sales.service';
import {SalesService} from '../../../core/services/sales.service';
import {formatDate} from '@angular/common';
import {forkJoin} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  utils = Utils;
  allSales: Sale[] = [];
  allSalesProducts: ReportBasis[] = [];
  total = 0;

  filterForm!: FormGroup;
  isFiltered = false;

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

  reportUrlDetailsEnum = ReportsDetails;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private preSalesService: PreSalesService,
    private salesService: SalesService,
    private toastrService: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getData();
    this.createForm();
  }

  navigate(route: string): void {
    if (this.isFiltered) {
      const startDate = this.filterForm.get('startDate')?.value;
      const endDate = this.filterForm.get('endDate')?.value;
      this.router.navigate([`admin/relatorios/${route}`], {queryParams: {startDate, endDate}});
    } else {
      this.router.navigate([`admin/relatorios/${route}`]);
    }
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

  createForm(): void {
    this.filterForm = this.formBuilder.group({
      filter: ['all'],
      startDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
      endDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
    });
  }

  search(): void {
    if (this.filterForm.get('filter')?.value === 'all') {
      this.isFiltered = false;
      this.createForm();
      this.getFilteredData();
    } else {
      this.isFiltered = true;
      const startDate = this.filterForm.get('startDate')?.value;
      const endDate = this.filterForm.get('endDate')?.value;
      this.getFilteredData(startDate, endDate);
    }
  }

  getFilteredData(startDate?: string, endDate?: string): void {
    forkJoin({
      allSales: this.salesService.getAllSales(startDate, endDate),
      salesReports: this.salesService.getAllSalesReports(startDate, endDate),
      preSalesReport: this.preSalesService.getPreSalesReports(startDate, endDate)
    }).subscribe(res => {
      this.allSales = res.allSales;
      this.preSalesChartsDataInsert(res.preSalesReport);
      this.salesChartsDataInsert(res.salesReports);
    }, () => this.toastrService.error('Houve um erro inesperado'));
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
        maintainAspectRatio: false,
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

  sum(reports: Sale[]): number {
    return reports.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.sale_value;
    }, 0);
  }

  print(): void {
    window.print();
  }
}
