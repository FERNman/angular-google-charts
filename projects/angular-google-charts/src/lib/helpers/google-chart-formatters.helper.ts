// @dynamic
export class GoogleChartsFormatterHelper {
  private static formatters = {
    'ArrowFormat': (options) => new google.visualization.ArrowFormat(options),
    'BarFormat': (options) => new google.visualization.BarFormat(options),
    'DateFormat': (options) => new google.visualization.DateFormat(options),
    'NumberFormat': (options) => new google.visualization.NumberFormat(options),
    'PatternFormat': (options) => new google.visualization.PatternFormat(options),
    'ColorFormat': () => new google.visualization.ColorFormat()
  };

  public static getFormatter(formatterName: string, options: any): google.visualization.DefaultFormatter {
    if (Object.keys(this.formatters).indexOf(formatterName) === -1) {
      throw new Error('No formatter exists with the given name.');
    }

    if (formatterName === 'ColorFormat') {
      return this.setupColorFormatter(this.formatters[formatterName](), options);
    }

    return  this.formatters[formatterName](options);
  }

  private static setupColorFormatter(formatter: google.visualization.ColorFormat, options: any): google.visualization.ColorFormat {
    switch (options['methodCall']) {
      case 'AddRange':
        formatter.addRange(options['from'], options['to'], options['color'], options['bgcolor']);
        return formatter;
      case 'AddGradientRange':
        formatter.addGradientRange(options['from'], options['to'], options['color'], options['fromBgColor'], options['toBgColor']);
        return formatter;
      default:
        throw new Error('Incorrect method call for Color Formatter.');
    }
  }

  public static isInstance(formatter: any): boolean {
    return formatter instanceof google.visualization.ArrowFormat ||
      formatter instanceof google.visualization.BarFormat ||
      formatter instanceof google.visualization.ColorFormat ||
      formatter instanceof google.visualization.DateFormat ||
      formatter instanceof google.visualization.NumberFormat ||
      formatter instanceof google.visualization.PatternFormat;
  }
}
