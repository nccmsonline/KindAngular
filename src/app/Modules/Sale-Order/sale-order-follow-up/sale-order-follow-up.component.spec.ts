import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderFollowUpComponent } from './sale-order-follow-up.component';

describe('SaleOrderFollowUpComponent', () => {
  let component: SaleOrderFollowUpComponent;
  let fixture: ComponentFixture<SaleOrderFollowUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleOrderFollowUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
