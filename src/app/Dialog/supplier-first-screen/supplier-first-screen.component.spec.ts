import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierFirstScreenComponent } from './supplier-first-screen.component';

describe('SupplierFirstScreenComponent', () => {
  let component: SupplierFirstScreenComponent;
  let fixture: ComponentFixture<SupplierFirstScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierFirstScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierFirstScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
