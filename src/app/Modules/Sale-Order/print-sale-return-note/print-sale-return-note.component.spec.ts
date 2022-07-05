import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSaleReturnNoteComponent } from './print-sale-return-note.component';

describe('PrintSaleReturnNoteComponent', () => {
  let component: PrintSaleReturnNoteComponent;
  let fixture: ComponentFixture<PrintSaleReturnNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSaleReturnNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSaleReturnNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
