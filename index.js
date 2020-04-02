var url = require('url');
var normalizeUrl = require('normalize-url');

var normalizeOpts = {
  normalizeProtocol: true,
  stripHash: true,
  stripWWW: false,
  removeQueryParameters: true,
  removeTrailingSlash: true,
  removeDirectoryIndex: true
};

var defaultOpts = {
  compareFullPath: false,
  statusCode: 400,
  statusMessage: 'Deceptive Routing',
  failureHandler: false
};

function stripPath(allowedURL) {
  var parsed = url.parse(allowedURL);
  return parsed.protocol + ':' + (parsed.slashes ? '//' : '') + parsed.host;
}

module.exports = function(allowedOrigins, opts) {
  opts = Object.assign({}, defaultOpts, opts);

  allowedOrigins = allowedOrigins.map(function(allowedOrigin) {
    return normalizeUrl(allowedOrigin, normalizeOpts);
  });
  if(!opts.compareFullPath) {
    allowedOrigins = allowedOrigins.map(stripPath);
  }

  return function(req, res, next) {
    var origin = req.headers['origin'];
    var referer = req.headers['referer'];

    //set "source origin" from the Origin header,
    // falling back to referer if that header is not preset.
    // Older browsers do not support it yet, and it seems like
    // even in supported browsers there are some cases where it isn't sent
    var sourceOrigin = origin || referer || '';

    sourceOrigin = normalizeUrl(sourceOrigin, normalizeOpts);
    if(!opts.compareFullPath) {
      sourceOrigin = stripPath(sourceOrigin);
    }

    if(allowedOrigins.indexOf(sourceOrigin) != -1) {
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