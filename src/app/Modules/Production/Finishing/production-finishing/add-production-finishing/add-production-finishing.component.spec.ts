import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductionFinishingComponent } from './add-production-finishing.component';

describe('AddProductionFinishingComponent', () => {
  let component: AddProductionFinishingComponent;
  let fixture: ComponentFixture<AddProductionFinishingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductionFinishingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductionFinishingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
