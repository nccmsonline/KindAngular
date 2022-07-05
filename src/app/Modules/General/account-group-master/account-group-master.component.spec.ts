import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountGroupMasterComponent } from './account-group-master.component';

describe('AccountGroupMasterComponent', () => {
  let component: AccountGroupMasterComponent;
  let fixture: ComponentFixture<AccountGroupMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountGroupMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountGroupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
