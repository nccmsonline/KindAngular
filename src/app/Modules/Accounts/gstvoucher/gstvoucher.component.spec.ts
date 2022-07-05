import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTVoucherComponent } from './gstvoucher.component';

describe('GSTVoucherComponent', () => {
  let component: GSTVoucherComponent;
  let fixture: ComponentFixture<GSTVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GSTVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GSTVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
