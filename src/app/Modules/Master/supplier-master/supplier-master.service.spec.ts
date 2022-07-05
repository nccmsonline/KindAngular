import { TestBed, inject } from '@angular/core/testing';

import { SupplierMasterService } from './supplier-master.service';

describe('SupplierMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupplierMasterService]
    });
  });

  it('should be created', inject([SupplierMasterService], (service: SupplierMasterService) => {
    expect(service).toBeTruthy();
  }));
});
