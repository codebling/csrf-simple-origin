const defaultOpts = {
  statusCode: 400,
  statusMessage: 'Deceptive Routing',
  failureHandler: null,
};

module.exports = (allowedOrigins, options) => {
  const opts = Object.assign({}, defaultOpts, options);

  return (req, res, next) => {
    const origin = req.headers['origin'];

    if(allowedOrigins.includes(origin)) {
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