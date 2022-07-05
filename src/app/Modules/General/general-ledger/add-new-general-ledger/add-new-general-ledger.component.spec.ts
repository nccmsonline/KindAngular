import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewGeneralLedgerComponent } from './add-new-general-ledger.component';

describe('AddNewGeneralLedgerComponent', () => {
  let component: AddNewGeneralLedgerComponent;
  let fixture: ComponentFixture<AddNewGeneralLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewGeneralLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewGeneralLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
