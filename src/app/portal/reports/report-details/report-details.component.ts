import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, take} from 'rxjs/operators';
import {ReportInterface} from '../../../shared/interfaces/report-basis';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit {

  urlPath = '';
  reports: ReportInterface = {} as ReportInterface;
  reportUrlDetailsEnum = ReportUrlDetailsEnum;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.urlPath = this.activatedRoute.snapshot.url[0].path;
    this.getData();
  }

  getData(): void {
    this.activatedRoute.data.pipe(take(1)).pipe(map(
      res => res as { reports: ReportInterface })).subscribe(
      res => {
        this.reports = res.reports;
      });
  }

  getPercentage(totalProduct: number, total: number): number {
    return ((totalProduct / total) * 100);
  }

  print(): void {
    window.print();
  }
}

enum ReportUrlDetailsEnum {
  CONVERSION = 'detalhes-conversao',
  SALES_BY_USER = 'vendas-por-usuario',
  DELIVERY_BY_DELIVERYMAN = 'entregas-por-entregadores',
  ALL_PRODUCTS_SALE = 'todos-os-produtos',
  ALL_SALES = 'todas-as-vendas',
}


