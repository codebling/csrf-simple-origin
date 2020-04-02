const url = require('url');
const normalizeUrl = require('normalize-url');

const normalizeOpts = {
  normalizeProtocol: true,
  stripWWW: false,
};

const defaultOpts = {
  statusCode: 400,
  statusMessage: 'Deceptive Routing',
  failureHandler: false
};

module.exports = (allowedOrigins, options) => {
  const opts = Object.assign({}, defaultOpts, options);

  const normalizedAllowedOrigins = allowedOrigins.map(function(allowedOrigin) {
    return normalizeUrl(allowedOrigin, normalizeOpts);
  });

  return (req, res, next) => {
    const origin = req.headers['origin'];

    const normalizedOrigin = normalizeUrl(origin, normalizeOpts);

    if(normalizedAllowedOrigins.includes(normalizedOrigin)) {
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