import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoFollowupComponent } from './mo-followup.component';

describe('MoFollowupComponent', () => {
  let component: MoFollowupComponent;
  let fixture: ComponentFixture<MoFollowupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoFollowupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
