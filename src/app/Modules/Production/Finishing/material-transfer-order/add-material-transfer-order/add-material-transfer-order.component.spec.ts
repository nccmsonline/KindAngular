import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialTransferOrderComponent } from './add-material-transfer-order.component';

describe('AddMaterialTransferOrderComponent', () => {
  let component: AddMaterialTransferOrderComponent;
  let fixture: ComponentFixture<AddMaterialTransferOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaterialTransferOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaterialTransferOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
