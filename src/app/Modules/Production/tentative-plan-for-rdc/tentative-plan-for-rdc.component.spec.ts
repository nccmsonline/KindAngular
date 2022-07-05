import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TentativePlanForRdcComponent } from './tentative-plan-for-rdc.component';

describe('TentativePlanForRdcComponent', () => {
  let component: TentativePlanForRdcComponent;
  let fixture: ComponentFixture<TentativePlanForRdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TentativePlanForRdcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TentativePlanForRdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
