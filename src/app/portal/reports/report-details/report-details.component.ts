import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, take} from 'rxjs/operators';
import {ReportBasis, ReportInterface} from '../../../shared/interfaces/report-basis';
import {ReportsDetails} from '../../../shared/enum/reports-details.enum';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit {

  urlPath = '';
  reports: ReportInterface = {} as ReportInterface;
  reportUrlDetailsEnum = ReportsDetails;

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

  getPercentage(totalProduct: number, total: number): string {
    return ((totalProduct / total)).toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 2 });
  }

  print(): void {
    window.print();
  }

  sum(reports: ReportBasis[]): number {
    return reports.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.total;
    }, 0);
  }
}


