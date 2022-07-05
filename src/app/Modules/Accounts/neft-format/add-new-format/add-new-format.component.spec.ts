import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewFormatComponent } from './add-new-format.component';

describe('AddNewFormatComponent', () => {
  let component: AddNewFormatComponent;
  let fixture: ComponentFixture<AddNewFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
