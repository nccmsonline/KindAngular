import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateLetterComponent } from './generate-letter.component';

describe('GenerateLetterComponent', () => {
  let component: GenerateLetterComponent;
  let fixture: ComponentFixture<GenerateLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
