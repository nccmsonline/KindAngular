import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionFinishingComponent } from './production-finishing.component';

describe('ProductionFinishingComponent', () => {
  let component: ProductionFinishingComponent;
  let fixture: ComponentFixture<ProductionFinishingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionFinishingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionFinishingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
