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
  describe('Partially matching domains', () => {

    const allowedOrigins = ['localhost'];

    const req = {
      headers: {
        'origin': 'localhost.example.com'
      }
    };

    it('should reply 4xx when no options are passed', done => {
      const res = createResponse();
      
      res.on('end', () => {
        assert(res.statusCode >= 400 && res.statusCode < 500);
        done();
      });

      originCompare(allowedOrigins)(req, res, () => done(new Error('should not have been called')));
    });

    it('should call the handler when one is passed', done => {
      const res = createResponse();
      
      res.on('end',() => done(new Error('should not have been called'))); 
      
      const options = { failureHandler: (req, res, next) => done() };
      originCompare(allowedOrigins, options)(req, res, () => done(new Error('should not have been called')));
    });
  });
});