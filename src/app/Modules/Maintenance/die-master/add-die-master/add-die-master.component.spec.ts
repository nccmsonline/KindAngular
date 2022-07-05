import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDieMasterComponent } from './add-die-master.component';

describe('AddDieMasterComponent', () => {
  let component: AddDieMasterComponent;
  let fixture: ComponentFixture<AddDieMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDieMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDieMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
