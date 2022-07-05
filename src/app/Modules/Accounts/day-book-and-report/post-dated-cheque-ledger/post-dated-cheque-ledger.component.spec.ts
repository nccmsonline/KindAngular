import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDatedChequeLedgerComponent } from './post-dated-cheque-ledger.component';

describe('PostDatedChequeLedgerComponent', () => {
  let component: PostDatedChequeLedgerComponent;
  let fixture: ComponentFixture<PostDatedChequeLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostDatedChequeLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDatedChequeLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
