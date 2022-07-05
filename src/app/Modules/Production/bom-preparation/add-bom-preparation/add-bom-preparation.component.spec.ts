import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBomPreparationComponent } from './add-bom-preparation.component';

describe('AddBomPreparationComponent', () => {
  let component: AddBomPreparationComponent;
  let fixture: ComponentFixture<AddBomPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBomPreparationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBomPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
