import { TestBed, inject } from '@angular/core/testing';

import { StoreRequisitionSlipService } from './store-requisition-slip.service';

describe('StoreRequisitionSlipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreRequisitionSlipService]
    });
  });

  it('should be created', inject([StoreRequisitionSlipService], (service: StoreRequisitionSlipService) => {
    expect(service).toBeTruthy();
  }));
});
