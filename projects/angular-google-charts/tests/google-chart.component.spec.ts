import { ChartType } from '../src/lib/types/chart-type';
import { render, waitFor } from '@testing-library/angular';

import { GoogleChart, ScriptLoaderService } from 'angular-google-charts';
import { firstValueFrom } from 'rxjs';

describe('GoogleChartComponent', () => {
  it('should render a chart', async () => {
    const { container, fixture } = await render(GoogleChart, {
      componentInputs: {
        type: ChartType.PieChart,
        columns: ['Task', 'Hours per Day'],
        data: [
          ['Work', 11],
          ['Eat', 2],
          ['Sleep', 7]
        ]
      },
      providers: [ScriptLoaderService]
    });

    await firstValueFrom(fixture.componentInstance.ready);

    expect(container.querySelector('svg')).toBeVisible();
  });

  it('should throw error when type is not provided', async () => {
    await expectAsync(
      render(GoogleChart, {
        componentInputs: {
          columns: ['Task', 'Hours per Day'],
          data: [
            ['Work', 11],
            ['Eat', 2],
            ['Sleep', 7]
          ]
        },
        providers: [ScriptLoaderService]
      })
    ).toBeRejectedWithError(
      '[GoogleChartComponent] Required input "type" is not set. Please set the type of the chart to create.'
    );
  });

  it('should throw error when data is not provided', async () => {
    await expectAsync(
      render(GoogleChart, {
        componentInputs: {
          type: ChartType.PieChart,
          columns: ['Task', 'Hours per Day']
        },
        providers: [ScriptLoaderService]
      })
    ).toBeRejectedWithError(
      '[GoogleChartComponent] Required input "data" is not set. Please set the data for the chart to create.'
    );
  });

  it('should update chart when data changes', async () => {
    const columns = ['Task', 'Hours per Day'];

    const { rerender, container, fixture } = await render(GoogleChart, {
      componentInputs: {
        type: ChartType.PieChart,
        columns,
        data: [
          ['Work', 11],
          ['Eat', 2],
          ['Sleep', 7]
        ]
      },
      providers: [ScriptLoaderService]
    });

    await firstValueFrom(fixture.componentInstance.ready);
    expect(container.querySelector('svg')).toBeVisible();

    const initialSvg = container.querySelector('svg')?.outerHTML;
    expect(initialSvg).toBeDefined();

    await rerender({
      componentInputs: {
        type: ChartType.PieChart,
        columns,
        data: [
          ['Work', 10],
          ['Eat', 3],
          ['Sleep', 7]
        ]
      }
    });

    await waitFor(() => expect(container.querySelector('svg')?.outerHTML).not.toBe(initialSvg));

    expect(container.querySelector('svg')).toBeVisible();
  });

  // TODO: Test changing the input properties dynamically and checking if the chart updates accordingly.
  // TODO: Test for chart events like selection, error, etc.
});
