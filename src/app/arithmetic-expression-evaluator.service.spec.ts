import { TestBed } from '@angular/core/testing';

import { ArithmeticExpressionEvaluatorService } from './arithmetic-expression-evaluator.service';

describe('ArithmeticExpressionEvaluatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArithmeticExpressionEvaluatorService = TestBed.get(ArithmeticExpressionEvaluatorService);
    expect(service).toBeTruthy();
  });
});
