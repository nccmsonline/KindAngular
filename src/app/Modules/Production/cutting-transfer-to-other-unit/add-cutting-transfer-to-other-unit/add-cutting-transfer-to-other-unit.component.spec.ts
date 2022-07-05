import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCuttingTransferToOtherUnitComponent } from './add-cutting-transfer-to-other-unit.component';

describe('AddCuttingTransferToOtherUnitComponent', () => {
  let component: AddCuttingTransferToOtherUnitComponent;
  let fixture: ComponentFixture<AddCuttingTransferToOtherUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCuttingTransferToOtherUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCuttingTransferToOtherUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
