import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShearingProductionComponent } from './shearing-production.component';

describe('ShearingProductionComponent', () => {
  let component: ShearingProductionComponent;
  let fixture: ComponentFixture<ShearingProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShearingProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShearingProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
