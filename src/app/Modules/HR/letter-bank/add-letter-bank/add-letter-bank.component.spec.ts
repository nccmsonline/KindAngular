import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLetterBankComponent } from './add-letter-bank.component';

describe('AddLetterBankComponent', () => {
  let component: AddLetterBankComponent;
  let fixture: ComponentFixture<AddLetterBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLetterBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLetterBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
