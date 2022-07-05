import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTInvoiceComponent } from './gstinvoice.component';

describe('GSTInvoiceComponent', () => {
  let component: GSTInvoiceComponent;
  let fixture: ComponentFixture<GSTInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GSTInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GSTInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
