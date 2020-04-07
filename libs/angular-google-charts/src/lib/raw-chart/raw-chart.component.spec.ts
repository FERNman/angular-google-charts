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

  beforeEach(() => {
    fixture = TestBed.createComponent(RawChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
