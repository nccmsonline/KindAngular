import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomPreparationComponent } from './bom-preparation.component';

describe('BomPreparationComponent', () => {
  let component: BomPreparationComponent;
  let fixture: ComponentFixture<BomPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BomPreparationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BomPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
