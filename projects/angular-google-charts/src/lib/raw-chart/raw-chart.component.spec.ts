import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawChartComponent } from './raw-chart.component';
import { ScriptLoaderService } from '../script-loader/script-loader.service';

describe('RawChartComponent', () => {
  let component: RawChartComponent;
  let fixture: ComponentFixture<RawChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawChartComponent ],
      providers: [
        ScriptLoaderService
      ]
    })
    .compileComponents();
  }));

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

  describe('Generic Chart tests', () => {
    beforeEach((done) => {
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

      component.ready.subscribe(() => {
        done();
      });
    });

    it('should fire ready events', () => {
      // if we ever come here, beforeEach called done(), so component.ready works.
      // no need for more expect() functions
    });

    it('should load the corechart package', () => {
      expect(google.visualization.BarChart).toBeDefined();
      expect(google.visualization.AreaChart).toBeDefined();
      expect(google.visualization.BubbleChart).toBeDefined();
    });

    it ('should match parent width', () => {
      const chartElement = component.getChartElement();
      const chartContainer = chartElement.parentElement;
      chartContainer.style.width = '100%';

      component.ngOnChanges();

      const chartParent = chartContainer.parentElement;
      expect(chartContainer.clientWidth).toEqual(chartParent.clientWidth);
    });

    it ('should resize on window resize', (done) => {
      const chartElement = component.getChartElement();
      component.dynamicResize = true;

      const chartContainer = chartElement.parentElement;
      chartContainer.style.width = '100%';

      component.ngOnChanges();
      component.ngAfterViewInit();

      const chartParent = chartContainer.parentElement;
      chartParent.style.width = '1000px';

      window.dispatchEvent(new Event('resize'));

      setTimeout(() => {
        expect(chartContainer.clientWidth).toEqual(chartParent.clientWidth);
        done();
      }, 200);
    });
  });

  describe('BarChart tests', () => {
    beforeEach((done) => {
      fixture = TestBed.createComponent(RawChartComponent);
      component = fixture.componentInstance;
      component.chartData = {
        chartType: 'BarChart',
        dataTable: [
          ['Element', 'Density'],
          ['Copper', 8.94],
          ['Silver', 10.49],
          ['Gold', 19.30],
          ['Platinum', 21.45]
        ],
        options: {
          title: 'My Bar Chart'
        }
      };

      fixture.detectChanges();

      component.ready.subscribe(() => {
        done();
      });
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

    it('should format the data', (done) => {
      component.chartData.dataTable = [
        ['Element', 'Density', { role: 'style', type: 'string' }],
        ['Copper', 8.94, '#b87333'],
        ['Silver', 10.49, 'silver'],
        ['Gold', 19.30, 'gold'],
        ['Platinum', 21.45, 'color: #e5e4e2' ],
      ];

      component.ready.subscribe(() => {
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

        done();
      });

      component.ngOnChanges();
    });
  });

  describe('events', () => {
    beforeEach((done) => {
      fixture = TestBed.createComponent(RawChartComponent);
      component = fixture.componentInstance;
      component.chartData = {
        chartType: 'BarChart',
        dataTable: [
          ['Element', 'Density'],
          ['Copper', 8.94],
          ['Silver', 10.49],
          ['Gold', 19.30],
          ['Platinum', 21.45]
        ],
        options: {
          title: 'My Bar Chart'
        }
      };

      fixture.detectChanges();

      component.ready.subscribe(() => {
        done();
      });
    });

    it('should fire hover events', async(() => {
      // TODO
    }));

    it('should fire select event', async(() => {
      // TODO
    }));
  });

  describe('advanced charts', () => {
    it('should load the table chart package', (done) => {
      fixture = TestBed.createComponent(RawChartComponent);
      component = fixture.componentInstance;
      component.chartData = {
        chartType: 'Table',
        dataTable: [],
      };

      fixture.detectChanges();

      component.ready.subscribe(() => {
        expect(google.visualization.Table).toBeDefined();

        done();
      });
    });

    it('should load the material chart package', async(() => {
      fixture = TestBed.createComponent(RawChartComponent);
      component = fixture.componentInstance;
      component.chartData = {
        chartType: 'Bar'
      };

      fixture.detectChanges();

      component.ready.subscribe(() => {
        expect((<any>google.charts).Bar).toBeDefined();
      });
    }));
  });
});
