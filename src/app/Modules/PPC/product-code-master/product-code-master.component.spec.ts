import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCodeMasterComponent } from './product-code-master.component';

describe('ProductCodeMasterComponent', () => {
  let component: ProductCodeMasterComponent;
  let fixture: ComponentFixture<ProductCodeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCodeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCodeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
