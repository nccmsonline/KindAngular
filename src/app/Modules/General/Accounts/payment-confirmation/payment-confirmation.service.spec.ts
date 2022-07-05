import { TestBed, inject } from '@angular/core/testing';

import { PaymentConfirmationService } from './payment-confirmation.service';

describe('PaymentConfirmationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentConfirmationService]
    });
  });

  it('should be created', inject([PaymentConfirmationService], (service: PaymentConfirmationService) => {
    expect(service).toBeTruthy();
  }));
});
