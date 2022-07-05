import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMachineMasterComponent } from './add-machine-master.component';

describe('AddMachineMasterComponent', () => {
  let component: AddMachineMasterComponent;
  let fixture: ComponentFixture<AddMachineMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMachineMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMachineMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
