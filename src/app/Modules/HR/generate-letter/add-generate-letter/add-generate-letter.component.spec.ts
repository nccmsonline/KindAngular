import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGenerateLetterComponent } from './add-generate-letter.component';

describe('AddGenerateLetterComponent', () => {
  let component: AddGenerateLetterComponent;
  let fixture: ComponentFixture<AddGenerateLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGenerateLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGenerateLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
