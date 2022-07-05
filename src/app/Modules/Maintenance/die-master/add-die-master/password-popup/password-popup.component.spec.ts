import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordPopupComponent } from './password-popup.component';

describe('PasswordPopupComponent', () => {
  let component: PasswordPopupComponent;
  let fixture: ComponentFixture<PasswordPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
