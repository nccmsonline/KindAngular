import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoofoperationPopupComponent } from './noofoperation-popup.component';

describe('NoofoperationPopupComponent', () => {
  let component: NoofoperationPopupComponent;
  let fixture: ComponentFixture<NoofoperationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoofoperationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoofoperationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
