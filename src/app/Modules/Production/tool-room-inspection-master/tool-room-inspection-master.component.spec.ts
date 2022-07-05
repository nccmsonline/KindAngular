import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolRoomInspectionMasterComponent } from './tool-room-inspection-master.component';

describe('ToolRoomInspectionMasterComponent', () => {
  let component: ToolRoomInspectionMasterComponent;
  let fixture: ComponentFixture<ToolRoomInspectionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolRoomInspectionMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolRoomInspectionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
