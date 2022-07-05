import { TestBed, inject } from '@angular/core/testing';

import { PaymentRequirmentService } from './payment-requirment.service';

describe('PaymentRequirmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentRequirmentService]
    });
  });

  it('should be created', inject([PaymentRequirmentService], (service: PaymentRequirmentService) => {
    expect(service).toBeTruthy();
  }));
});
