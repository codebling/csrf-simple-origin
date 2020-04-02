var originCompare = require('../index');

var httpMocks = require('node-mocks-http');
var chai = require('chai');
var should = chai.should();


it('should not accept domains that partially match', function(done) {
  var allowedOrigins = ['localhost'];

  var req = {
    headers: {
      'origin': 'localhost.example.com'
    }
  };
  var res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter});

  function assertFailure(err) {
    chai.assert(err != null);
    chai.assert(res.statusCode == 400);
    done();
  }


  res.on('end', function() {
    
  });
  originCompare(allowedOrigins)(req, res, assertFailure);
}) ;