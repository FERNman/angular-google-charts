import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { ScriptLoaderService } from 'angular-google-charts';

describe('ScriptLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScriptLoaderService]
    });
  });

  const loadChartPackages = (...packages: string[]) => {
    const service = TestBed.inject(ScriptLoaderService);
    return firstValueFrom(service.loadChartPackages(...packages));
  };

  afterEach(() => {
    const scripts = document.querySelectorAll('script[src*="gstatic.com/charts"]');
    scripts.forEach(script => script.remove());

    if (typeof window !== 'undefined') {
      delete (window as any).google;
    }

    TestBed.resetTestingModule();
  });

  it('should load corechart package successfully', async () => {
    await loadChartPackages('corechart');
    // Verify that corechart package is loaded by checking for visualization components
    expect(google.visualization).toBeDefined();
    expect(google.visualization.PieChart).toBeDefined();
    expect(google.visualization.ColumnChart).toBeDefined();
    expect(google.visualization.LineChart).toBeDefined();
  });

  it('should load the specified package', async () => {
    await loadChartPackages('controls');
    // Verify that controls package is loaded
    expect(google.visualization.Dashboard).toBeDefined();
    expect(google.visualization.ControlWrapper).toBeDefined();
  });

  it('should support loading different packages at once', async () => {
    await loadChartPackages('corechart', 'table');
    // Verify that both packages are loaded
    expect(google.visualization.PieChart).toBeDefined();
    expect(google.visualization.Table).toBeDefined();
  });

  it('should support loading different packages sequentially', async () => {
    await loadChartPackages('corechart');
    await loadChartPackages('table');
    expect(google.visualization.PieChart).toBeDefined();
    expect(google.visualization.Table).toBeDefined();
  });

  it('should support loading the same package multiple times', async () => {
    await loadChartPackages('corechart');
    await loadChartPackages('corechart');
    expect(google.visualization.PieChart).toBeDefined();
    expect(google.visualization.ColumnChart).toBeDefined();
  });

  it('should load default packages when called without arguments', async () => {
    await loadChartPackages();
    expect(google.charts).toBeDefined();
  });

  // TODO:
  // it('should throw an error on invalid package names', async () => {
  //   const promise = loadChartPackages('invalid-package-that-does-not-exist');
  //   await expectAsync(promise).toBeRejectedWithError();
  // });

  it('should add only one script element with multiple sequential calls', async () => {
    await loadChartPackages('corechart');
    const scriptsAfterFirst = document.querySelectorAll('script[src*="gstatic.com/charts/loader.js"]');
    expect(scriptsAfterFirst.length).toBe(1);

    await loadChartPackages('table');
    const scriptsAfterSecond = document.querySelectorAll('script[src*="gstatic.com/charts/loader.js"]');
    expect(scriptsAfterSecond.length).toBe(1);
  });

  it('should add only one script element with multiple parallel calls', async () => {
    await Promise.all([loadChartPackages('corechart'), loadChartPackages('table'), loadChartPackages('controls')]);

    expect(google.visualization.PieChart).toBeDefined();
    expect(google.visualization.Table).toBeDefined();
    expect(google.visualization.Dashboard).toBeDefined();

    const scriptsAfterLoad = document.querySelectorAll('script[src*="gstatic.com/charts/loader.js"]');
    expect(scriptsAfterLoad.length).toBe(1);
  });
});
