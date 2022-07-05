import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingTransferToOtherUnitComponent } from './cutting-transfer-to-other-unit.component';

describe('CuttingTransferToOtherUnitComponent', () => {
  let component: CuttingTransferToOtherUnitComponent;
  let fixture: ComponentFixture<CuttingTransferToOtherUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuttingTransferToOtherUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingTransferToOtherUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
