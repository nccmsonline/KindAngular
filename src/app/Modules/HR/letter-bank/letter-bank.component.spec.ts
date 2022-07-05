import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterBankComponent } from './letter-bank.component';

describe('LetterBankComponent', () => {
  let component: LetterBankComponent;
  let fixture: ComponentFixture<LetterBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LetterBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
