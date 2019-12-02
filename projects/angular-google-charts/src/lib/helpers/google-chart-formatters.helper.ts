// @dynamic
export class GoogleChartsFormatterHelper {
  public static getFormatter(formatterName: string, options: any): google.visualization.DefaultFormatter {
    if (!google.visualization.hasOwnProperty(formatterName)) {
      throw new Error('No formatter exists with the given name.');
    }

    if (formatterName === 'ColorFormat') {
      return this.setupColorFormatter(new google.visualization[formatterName], options);
    }

    return  new google.visualization[formatterName](options);
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
