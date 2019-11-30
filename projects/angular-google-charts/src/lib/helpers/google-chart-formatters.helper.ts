import { throwError } from 'rxjs';

export class GoogleChartsFormatterHelper {
  private static formatters = {
    'ArrowFormat': (options) => new google.visualization.ArrowFormat(options),
    'BarFormat': (options) => new google.visualization.BarFormat(options),
    'DateFormat': (options) => new google.visualization.DateFormat(options),
    'NumberFormat': (options) => new google.visualization.NumberFormat(options),
    'PatternFormat': (options) => new google.visualization.PatternFormat(options)
  };

  public static getFormatter(formatterName: string, options: any) {
    if (Object.keys(this.formatters).indexOf(formatterName) === -1) {
      throw new Error('No formatter exists with the given name.');
    }
    return  this.formatters[formatterName](options);
  }
}
