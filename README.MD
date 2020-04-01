Express middleware that normalises and compares the request's Origin and Referer headers with a list of allowed origins, to protect against CSRF. 

Uses [Sindresorhus](https://github.com/sindresorhus)' great [normalize-url](https://github.com/sindresorhus/normalize-url) lib. 


    var simpleOriginCompare = require('simple-origin-compare');
    
    var allowedOrigins = ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000'];
    app.use(simpleOriginCompare(allowedOrigins, opts));
    