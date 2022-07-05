import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTransferOrderComponent } from './material-transfer-order.component';

describe('MaterialTransferOrderComponent', () => {
  let component: MaterialTransferOrderComponent;
  let fixture: ComponentFixture<MaterialTransferOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTransferOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTransferOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
