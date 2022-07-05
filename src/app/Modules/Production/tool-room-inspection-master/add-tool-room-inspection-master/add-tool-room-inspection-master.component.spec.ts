import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToolRoomInspectionMasterComponent } from './add-tool-room-inspection-master.component';

describe('AddToolRoomInspectionMasterComponent', () => {
  let component: AddToolRoomInspectionMasterComponent;
  let fixture: ComponentFixture<AddToolRoomInspectionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToolRoomInspectionMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToolRoomInspectionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
