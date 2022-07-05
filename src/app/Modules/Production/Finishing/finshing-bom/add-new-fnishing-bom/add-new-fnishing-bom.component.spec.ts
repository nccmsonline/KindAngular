import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewFnishingBOMComponent } from './add-new-fnishing-bom.component';

describe('AddNewFnishingBOMComponent', () => {
  let component: AddNewFnishingBOMComponent;
  let fixture: ComponentFixture<AddNewFnishingBOMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewFnishingBOMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewFnishingBOMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
