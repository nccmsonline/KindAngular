import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintNeftFormatComponent } from './print-neft-format.component';

describe('PrintNeftFormatComponent', () => {
  let component: PrintNeftFormatComponent;
  let fixture: ComponentFixture<PrintNeftFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintNeftFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintNeftFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
