const originCompare = require('../index');

const httpMocks = require('node-mocks-http');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');

const { expect, assert } = chai;
chai.should();
chai.use(sinonChai);

const createResponse = () => 
  httpMocks.createResponse({eventEmitter: require('events').EventEmitter});

const assertError = done => err => {
  assert(err != null);
  assert(res.statusCode == 400);
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
        assert(res.statusCode >= 400 && res.statusCode < 500);
        done();
      });

      originCompare(allowedOrigins)(req, res, () => done(new Error('should not have been called')));
    });
  });
});