import { TestBed, inject } from '@angular/core/testing';

import { GoodsReceiptNoteService } from './goods-receipt-note.service';

describe('GoodsReceiptNoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodsReceiptNoteService]
    });
  });

  it('should be created', inject([GoodsReceiptNoteService], (service: GoodsReceiptNoteService) => {
    expect(service).toBeTruthy();
  }));
});
