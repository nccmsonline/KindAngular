import { TestBed, inject } from '@angular/core/testing';

import { CustomerMasterService } from './customer-master.service';

describe('CustomerMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerMasterService]
    });
  });

  it('should be created', inject([CustomerMasterService], (service: CustomerMasterService) => {
    expect(service).toBeTruthy();
  }));
});
