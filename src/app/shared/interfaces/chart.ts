import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label, SingleOrMultiDataSet} from 'ng2-charts/lib/base-chart.directive';

export interface Chart {
  options: ChartOptions;
  lineChartData: ChartDataSets[];
  data: SingleOrMultiDataSet;
  labels: Label[];
  chartType: ChartType;
  plugins: any[];
}
