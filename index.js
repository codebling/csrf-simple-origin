const url = require('url');
const normalizeUrl = require('normalize-url');

const normalizeOpts = {
  normalizeProtocol: true,
  stripHash: true,
  stripWWW: false,
  removeQueryParameters: true,
  removeTrailingSlash: true,
  removeDirectoryIndex: true
};

const defaultOpts = {
  statusCode: 400,
  statusMessage: 'Deceptive Routing',
  failureHandler: false
};

module.exports = function(allowedOrigins, opts) {
  opts = Object.assign({}, defaultOpts, opts);

  allowedOrigins = allowedOrigins.map(function(allowedOrigin) {
    return normalizeUrl(allowedOrigin, normalizeOpts);
  });

  return function(req, res, next) {
    const origin = req.headers['origin'];

    const normalizedOrigin = normalizeUrl(origin, normalizeOpts);

    if(allowedOrigins.indexOf(normalizedOrigin) != -1) {
      next();
    } else {
      if(opts.failureHandler) {
        opts.failureHandler(req, res, next);
      } else {
        res.statusMessage = opts.statusMessage;
        res.status(opts.statusCode).end();
      }
    }
  }
};