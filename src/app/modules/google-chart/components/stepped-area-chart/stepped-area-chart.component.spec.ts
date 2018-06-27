import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SteppedAreaChartComponent } from './stepped-area-chart.component';

describe('SteppedAreaChartComponent', () => {
  let component: SteppedAreaChartComponent;
  let fixture: ComponentFixture<SteppedAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SteppedAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SteppedAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
