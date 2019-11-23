import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptLoaderService } from '../script-loader/script-loader.service';
import { GoogleChartComponent } from './google-chart.component';

describe('ChartComponent', () => {
  let component: GoogleChartComponent;
  let fixture: ComponentFixture<GoogleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleChartComponent],
      providers: [ScriptLoaderService]
    }).compileComponents();
  }));

  describe('Generic Chart tests', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(GoogleChartComponent);
      component = fixture.componentInstance;
      component.type = 'PieChart';
      component.title = 'My Chart';
      component.data = [
        ['Mushrooms', 3],
        ['Onions', 1],
        ['Olives', 1],
        ['Zucchini', 1],
        ['Pepperoni', 2]
      ];
      component.columnNames = ['Topping', 'Slices'];

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
      fixture = TestBed.createComponent(GoogleChartComponent);
      component = fixture.componentInstance;
      component.type = 'BarChart';
      component.title = 'My Bar Chart';
      component.data = [
        ['Copper', 8.94],
        ['Silver', 10.49],
        ['Gold', 19.3],
        ['Platinum', 21.45]
      ];
      component.columnNames = ['Element', 'Density'];

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

    it('should format the data', () => {
      component.roles = [{ role: 'style', type: 'string' }];
      component.data = [
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
  });

  describe('events', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(GoogleChartComponent);
      component = fixture.componentInstance;
      component.type = 'BarChart';
      component.title = 'My Bar Chart';
      component.data = [
        ['Copper', 8.94],
        ['Silver', 10.49],
        ['Gold', 19.3],
        ['Platinum', 21.45]
      ];
      component.columnNames = ['Element', 'Density'];

      fixture.detectChanges();

      return component.ready.toPromise();
    });

    it.todo('should fire hover events');

    it.todo('should fire select event');
  });

  describe('advanced charts', () => {
    it('should load the table chart package', () => {
      fixture = TestBed.createComponent(GoogleChartComponent);
      component = fixture.componentInstance;
      component.type = 'Table';
      component.data = [];
      component.columnNames = [];

      fixture.detectChanges();

      return component.ready.toPromise().then(() => {
        expect(google.visualization.Table).toBeDefined();
      });
    });

    it('should load the material chart package', () => {
      fixture = TestBed.createComponent(GoogleChartComponent);
      component = fixture.componentInstance;
      component.type = 'Bar';
      component.data = [];
      component.columnNames = [];

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
