import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialTransferToBlankingComponent } from './add-material-transfer-to-blanking.component';

describe('AddMaterialTransferToBlankingComponent', () => {
  let component: AddMaterialTransferToBlankingComponent;
  let fixture: ComponentFixture<AddMaterialTransferToBlankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaterialTransferToBlankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaterialTransferToBlankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
