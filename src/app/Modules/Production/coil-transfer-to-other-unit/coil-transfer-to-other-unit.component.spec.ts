import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoilTransferToOtherUnitComponent } from './coil-transfer-to-other-unit.component';

describe('CoilTransferToOtherUnitComponent', () => {
  let component: CoilTransferToOtherUnitComponent;
  let fixture: ComponentFixture<CoilTransferToOtherUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoilTransferToOtherUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoilTransferToOtherUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
