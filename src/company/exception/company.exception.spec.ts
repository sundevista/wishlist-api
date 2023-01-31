import { CompanyException } from './company.exception';

describe('CompanyException', () => {
  it('should be defined', () => {
    expect(new CompanyException()).toBeDefined();
  });
});
