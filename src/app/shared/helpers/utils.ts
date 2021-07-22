import {ReportBasis} from '../interfaces/report-basis';

export default class Utils {
  static getSum(reports: ReportBasis[]): number {
    return reports.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.total;
    }, 0);
  }

  static getPercentage(totalProduct: number, total: number): string {
    return ((totalProduct / total)).toLocaleString('pt-BR', {style: 'percent', minimumFractionDigits: 2});
  }
}
