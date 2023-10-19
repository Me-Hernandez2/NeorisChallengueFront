import { TestBed } from '@angular/core/testing';

import { ValidateIdService } from './validate-id.service';

describe('ValidateIdService', () => {
  let service: ValidateIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateIdService);
  });
});
