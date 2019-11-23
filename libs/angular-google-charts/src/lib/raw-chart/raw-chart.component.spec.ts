import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptLoaderService } from '../script-loader/script-loader.service';
import { RawChartComponent } from './raw-chart.component';

jest.mock('../script-loader/script-loader.service');

describe('RawChartComponent', () => {
  let component: RawChartComponent;
  let fixture: ComponentFixture<RawChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RawChartComponent],
      providers: [ScriptLoaderService]
    }).compileComponents();
  }));

  describe('Generic Chart tests', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RawChartComponent);
      component = fixture.componentInstance;
      component.chartData = {
        chartType: 'BarChart',
        dataTable: [
          ['Topping', 'Slices'],
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Olives', 1],
          ['Zucchini', 1],
          ['Pepperoni', 2]
        ],
        options: {
          title: 'Generic Chart'
        }
      };

      fixture.detectChanges();

      return component.ready.toPromise();
    });

    it('should fire ready events', () => {
      // if we ever come here, beforeEach called done(), so component.ready works.
      // no need for more expect() functions
      expect(true).toBeTruthy();
    });

    it('should load the corechart package', () => {
      expect(google.visualization.BarChart).toBeDefined();
      expect(google.visualization.AreaChart).toBeDefined();
      expect(google.visualization.BubbleChart).toBeDefined();
    });

    it('should match parent width', () => {
      const chartElement = component.getChartElement();
      const chartContainer = chartElement.parentElement;
      chartContainer.style.width = '100%';

      component.ngOnChanges();

      const chartParent = chartContainer.parentElement;
      expect(chartContainer.clientWidth).toEqual(chartParent.clientWidth);
    });

    it('should resize on window resize', async () => {
      const chartElement = component.getChartElement();
      component.dynamicResize = true;

      const chartContainer = chartElement.parentElement;
      chartContainer.style.width = '100%';

      component.ngOnChanges();
      component.ngAfterViewInit();

      const chartParent = chartContainer.parentElement;
      chartParent.style.width = '1000px';

      window.dispatchEvent(new Event('resize'));

      fixture.detectChanges();
      await fixture.whenStable();

      expect(chartContainer.clientWidth).toEqual(chartParent.clientWidth);
    });
  });

  describe('BarChart tests', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RawChartComponent);
      component = fixture.componentInstance;
      component.chartData = {
        chartType: 'BarChart',
        dataTable: [
          ['Element', 'Density'],
          ['Copper', 8.94],
          ['Silver', 10.49],
          ['Gold', 19.3],
          ['Platinum', 21.45]
        ],
        options: {
          title: 'My Bar Chart'
        }
      };

      fixture.detectChanges();

      return component.ready.toPromise();
    });

    it('should render a simple bar chart', () => {
      const chartElement = component.getChartElement();
      expect(chartElement).not.toBeNull();
    });

    it('should set the title correctly', () => {
      const chartElement = component.getChartElement();
      const title = findInChildren(chartElement, element => element.textContent === 'My Bar Chart');
      expect(title).not.toBeNull();
    });

    it('should apply the roles', () => {
      component.chartData.dataTable = [
        ['Element', 'Density', { role: 'style', type: 'string' }],
        ['Copper', 8.94, '#b87333'],
        ['Silver', 10.49, 'silver'],
        ['Gold', 19.3, 'gold'],
        ['Platinum', 21.45, 'color: #e5e4e2']
      ];

      component.ngOnChanges();

      return component.ready.toPromise().then(() => {
        const chartElement = component.getChartElement();

        const copperBar = findInChildren(chartElement, element => {
          const attr = element.attributes.getNamedItem('stroke');
          return attr ? attr.value === '#b87333' : false;
        });
        const silverBar = findInChildren(chartElement, element => {
          const attr = element.attributes.getNamedItem('stroke');
          return attr ? attr.value === '#c0c0c0' : false;
        });
        const goldBar = findInChildren(chartElement, element => {
          const attr = element.attributes.getNamedItem('stroke');
          return attr ? attr.value === '#ffd700' : false;
        });

        expect(copperBar).not.toBeNull();
        expect(silverBar).not.toBeNull();
        expect(goldBar).not.toBeNull();
      });
    });

    it('should use the format the data', () => {
      component.chartData.dataTable = [
        ['Element', 'Density'],
        ['Copper', new Date(1990, 10, 1)],
        ['Silver', new Date(1991, 9, 1)],
        ['Gold', new Date(1992, 8, 1)],
        ['Platinum', new Date(1993, 7, 1)]
      ];

      component.formatter = [
        {
          formatter: new google.visualization.DateFormat({ formatType: 'long' }),
          colIndex: 1
        }
      ];

      component.ngOnChanges();

      return component.ready.toPromise().then(() => {
        // TODO: Find a way to test whether the formatter worked.
      });
    });
  });

  describe('events', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RawChartComponent);
      component = fixture.componentInstance;
      component.chartData = {
        chartType: 'BarChart',
        dataTable: [
          ['Element', 'Density'],
          ['Copper', 8.94],
          ['Silver', 10.49],
          ['Gold', 19.3],
          ['Platinum', 21.45]
        ],
        options: {
          title: 'My Bar Chart'
        }
      };

      fixture.detectChanges();

      return component.ready.toPromise();
    });

    it.todo('should fire hover events');

    it.todo('should fire select event');
  });

  describe('advanced charts', () => {
    it('should load the table chart package', () => {
      fixture = TestBed.createComponent(RawChartComponent);
      component = fixture.componentInstance;
      component.chartData = {
        chartType: 'Table',
        dataTable: [
          ['asf', 'asdf'],
          [1, 1]
        ]
      };

      fixture.detectChanges();

      return component.ready.toPromise().then(() => {
        expect(google.visualization.Table).toBeDefined();
      });
    });

    it('should load the material chart package', () => {
      fixture = TestBed.createComponent(RawChartComponent);
      component = fixture.componentInstance;
      component.chartData = {
        chartType: 'Bar',
        dataTable: [
          ['test', 'asdf'],
          [0, 1]
        ]
      };

      fixture.detectChanges();

      return component.ready.toPromise().then(() => {
        expect((<any>google.charts).Bar).toBeDefined();
      });
    });
  });
});

function findInChildren(parent: HTMLElement, comparison: (el: HTMLElement) => boolean): HTMLElement {
  const children = Array.from(parent.children);
  for (const child of children) {
    if (comparison(<HTMLElement>child)) {
      return <HTMLElement>child;
    } else {
      const found = findInChildren(<HTMLElement>child, comparison);
      if (found) {
        return found;
      }
    }
  }

  return null;
}
