import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewGSTVoucherComponent } from './add-new-gstvoucher.component';

describe('AddNewGSTVoucherComponent', () => {
  let component: AddNewGSTVoucherComponent;
  let fixture: ComponentFixture<AddNewGSTVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewGSTVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewGSTVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
