import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeRecoComponent } from './cheque-reco.component';

describe('ChequeRecoComponent', () => {
  let component: ChequeRecoComponent;
  let fixture: ComponentFixture<ChequeRecoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeRecoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeRecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
