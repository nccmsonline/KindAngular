import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderKnockedOffComponent } from './order-knocked-off.component';

describe('OrderKnockedOffComponent', () => {
  let component: OrderKnockedOffComponent;
  let fixture: ComponentFixture<OrderKnockedOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderKnockedOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderKnockedOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
