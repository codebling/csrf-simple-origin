var originCompare = require('../index');

var httpMocks = require('node-mocks-http');
var chai = require('chai');
var should = chai.should();

const createResponse = () => 
  httpMocks.createResponse({eventEmitter: require('events').EventEmitter});

const assertError = done => err => {
  chai.assert(err != null);
  chai.assert(res.statusCode == 400);
  done();
};


describe('Blocking', () => {
  describe('Partial match', () => {
    
    it('should reply 400 when no options are specified for domains that partially match', done => {
      const allowedOrigins = ['localhost'];

      const req = {
        headers: {
          'origin': 'localhost.example.com'
        }
      };

      const res = createResponse();
      res.on('end', function() {
        done(new Error('should not return'));
      });
      originCompare(allowedOrigins, )(req, res, () => );
    });
  });
});