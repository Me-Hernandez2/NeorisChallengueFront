import { TestBed } from '@angular/core/testing';

import { GetProductsService } from './get-products.service';

describe('GetProductsService', () => {
  let service: GetProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetProductsService);
  });
});
