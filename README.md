dustjacket
=========

Loader middleware for dustjs

Use
---

```
var dust = require('dustjs-linkedin');
var dustjacket = require('dustjacket');
dustjacket.registerWith(dust);

dust.addLoadMiddleware(function (name, cb) {
    // Handle loading as you see fit

    // cb(), pass to next middleware
    // cb(err), report an error to render
    // cb(null, data) return data to renderer, stopping the chain
});
```
