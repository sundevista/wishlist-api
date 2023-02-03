import { IntegrationException } from './integration.exception';

describe('IntegrationException', () => {
  it('should be defined', () => {
    expect(new IntegrationException()).toBeDefined();
  });
});
