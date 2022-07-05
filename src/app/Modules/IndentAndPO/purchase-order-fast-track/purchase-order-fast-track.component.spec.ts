import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderFastTrackComponent } from './purchase-order-fast-track.component';

describe('PurchaseOrderFastTrackComponent', () => {
  let component: PurchaseOrderFastTrackComponent;
  let fixture: ComponentFixture<PurchaseOrderFastTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderFastTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderFastTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
