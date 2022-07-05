import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDatedChequeBudgetWiseComponent } from './post-dated-cheque-budget-wise.component';

describe('PostDatedChequeBudgetWiseComponent', () => {
  let component: PostDatedChequeBudgetWiseComponent;
  let fixture: ComponentFixture<PostDatedChequeBudgetWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostDatedChequeBudgetWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDatedChequeBudgetWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
