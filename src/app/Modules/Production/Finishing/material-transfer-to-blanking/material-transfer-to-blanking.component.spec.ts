import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTransferToBlankingComponent } from './material-transfer-to-blanking.component';

describe('MaterialTransferToBlankingComponent', () => {
  let component: MaterialTransferToBlankingComponent;
  let fixture: ComponentFixture<MaterialTransferToBlankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTransferToBlankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTransferToBlankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
