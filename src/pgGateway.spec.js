import PGGateway from './pgGateway'

describe('Class PGGateway', function() {
  it('should be of class', () => {
    expect(PGGateway).to.be.a('function');
  });

  it('should have default payment selection rule defined', () => {
    const pgGateway = new PGGateway()
    expect(pgGateway._selectionRule).to.be.defined;
    expect(pgGateway._selectionRule).to.be.a('function');
  });

  describe('use()', () => {
    let pgGateway;

    before(() => {
      pgGateway = new PGGateway()
    });
    it('should be a function', () => {
      expect(pgGateway.use).to.be.a('function');
    });
    it('should throw if no name is provide via argument or gateway', () => {
      expect(pgGateway.use, {}).to.throw(Error)
    });
  });
})
