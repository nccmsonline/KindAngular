import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDieBomComponent } from './add-die-bom.component';

describe('AddDieBomComponent', () => {
  let component: AddDieBomComponent;
  let fixture: ComponentFixture<AddDieBomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDieBomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDieBomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
