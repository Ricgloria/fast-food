import {Sale, SalesReport} from './sale-box';
import {PreSalesReport} from './pre-sale';

export interface ReportBasis {
  name: string;
  total: number;
}

export interface ReportInterface {
  allSales: Sale[];
  salesReports: SalesReport;
  preSalesReport: PreSalesReport;
}
