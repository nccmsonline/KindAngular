import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCoilTransferToOtherUnitComponent } from './add-coil-transfer-to-other-unit.component';

describe('AddCoilTransferToOtherUnitComponent', () => {
  let component: AddCoilTransferToOtherUnitComponent;
  let fixture: ComponentFixture<AddCoilTransferToOtherUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCoilTransferToOtherUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCoilTransferToOtherUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
