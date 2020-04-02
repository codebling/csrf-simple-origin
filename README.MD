HTTP and Express middleware that compares the request's Origin header with a list of allowed origins, to protect against CSRF. 

- [Installation](#installation)
- [Use](#use)
- [Background](#background)
- [API](#api)
  - [`csrf(allowedOrigins, options)`](#csrfallowedorigins-options)
  - [`options`](#options)
    - [`options.statusCode` default: 400](#optionsstatuscode-default-400)
    - [`options.statusMessage` default: "Deceptive Routing"](#optionsstatusmessage-default-%22deceptive-routing%22)
    - [`options.failureHandler` default: null](#optionsfailurehandler-default-null)
      - [Example](#example)
- [License](#license)

# Installation
```
npm i csrf-simple-origin
```

# Use
```
const csrf = require('csrf-simple-origin');
    
const allowedOrigins = ['https://yoursite.example.com', 'http://anothersubdomain.yoursite.example.com'];
app.use(csrf(allowedOrigins));
```

# Background

[Cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery) is a common problem on the web. 

Mitigating these attacks used to mean that you had to pass a token to the client on every page, then check the token that they sent on every XHR request. 

[Most browsers](https://caniuse.com/#feat=mdn-http_headers_origin) now support the [`Origin` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin). This gives us a simple mechanism to verify XHR request and prevent CSRF. This middleware checks the `Origin` header against a list of allowed origins, rejecting requests from other (external) origins with a 400.

Read more at [Understanding CSRF](https://github.com/pillarjs/understanding-csrf).

# API

## `csrf(allowedOrigins, options)`

Creates the middleware.

Returns a function with a typical Express signature `function(req, res, next)` (compatible with Node HTTP server request handler) to handle the request.

Include this in your [Express](http://expressjs.com/) application with `app.use()` on your XHR routes
```
const middleware = csrf(allowedOrigins);
app.use(middleware);
```

Or in vanilla HTTP:
```
const middleware = csrf(allowedOrigins);
http.createServer((req, res) => middleware(req, res, () => {
    // If we reach here, then CSRF `Origin` header has been verified!
    doSomething();
});
```

## `options`

`options` is an object with these defaults:
```
{
  statusCode: 400,
  statusMessage: 'Deceptive Routing',
  failureHandler: null
}
```

### `options.statusCode` default: 400

Type: number

The HTTP code to respond if the request is rejected, i.e. if the request contain an `Origin` header which hasn't been whitelisted.

### `options.statusMessage` default: "Deceptive Routing"

Type: string

The HTTP message to respond if the request is rejected, i.e. if the request contain an `Origin` header which hasn't been whitelisted.

### `options.failureHandler` default: null

Type: function(req, res, next)

If a handler is provided, this will be called instead of responding to the response.

#### Example
```
const failureHandler = (req, res, next) => {
    logIntrusion();
    next();
};
app.use(csrf(allowedOrigins, {failureHandler}));
```

# License

This code is licensed [WTFPL](https://en.wikipedia.org/wiki/WTFPL), [Beerware](https://en.wikipedia.org/wiki/Beerware), or [MIT](https://en.wikipedia.org/wiki/MIT_License), whichever you prefer. Use this code with or without modification, with or without attribution, with or without reproducing this license, for commercial purposes or any other purpose. 