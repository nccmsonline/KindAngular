import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuanceSlipComponent } from './issuance-slip.component';

describe('IssuanceSlipComponent', () => {
  let component: IssuanceSlipComponent;
  let fixture: ComponentFixture<IssuanceSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuanceSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuanceSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
