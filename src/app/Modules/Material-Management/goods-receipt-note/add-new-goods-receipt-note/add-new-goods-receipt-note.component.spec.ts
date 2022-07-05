import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewGoodsReceiptNoteComponent } from './add-new-goods-receipt-note.component';

describe('AddNewGoodsReceiptNoteComponent', () => {
  let component: AddNewGoodsReceiptNoteComponent;
  let fixture: ComponentFixture<AddNewGoodsReceiptNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewGoodsReceiptNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewGoodsReceiptNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
