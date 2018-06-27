import { GoogleChartModule } from './google-chart.module';

describe('GoogleChartModule', () => {
  let googleChartModule: GoogleChartModule;

  beforeEach(() => {
    googleChartModule = new GoogleChartModule();
  });

  it('should create an instance', () => {
    expect(googleChartModule).toBeTruthy();
  });
});
