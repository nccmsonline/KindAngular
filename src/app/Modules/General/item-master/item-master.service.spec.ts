import { TestBed, inject } from '@angular/core/testing';

import { ItemMasterService } from './item-master.service';

describe('ItemMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemMasterService]
    });
  });

  it('should be created', inject([ItemMasterService], (service: ItemMasterService) => {
    expect(service).toBeTruthy();
  }));
});
