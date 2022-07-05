import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShearingProductionComponent } from './add-shearing-production.component';

describe('AddShearingProductionComponent', () => {
  let component: AddShearingProductionComponent;
  let fixture: ComponentFixture<AddShearingProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddShearingProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShearingProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
