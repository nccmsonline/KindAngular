import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewIssunaceSlipComponent } from './add-new-issunace-slip.component';

describe('AddNewIssunaceSlipComponent', () => {
  let component: AddNewIssunaceSlipComponent;
  let fixture: ComponentFixture<AddNewIssunaceSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewIssunaceSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewIssunaceSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
