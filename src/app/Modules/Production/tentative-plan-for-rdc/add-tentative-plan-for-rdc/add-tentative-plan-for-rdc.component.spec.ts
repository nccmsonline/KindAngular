import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTentativePlanForRdcComponent } from './add-tentative-plan-for-rdc.component';

describe('AddTentativePlanForRdcComponent', () => {
  let component: AddTentativePlanForRdcComponent;
  let fixture: ComponentFixture<AddTentativePlanForRdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTentativePlanForRdcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTentativePlanForRdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
