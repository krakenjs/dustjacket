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

In the browser:

```
<script src='dustjs-linkedin.js'></script>
<script src='dustjacket/index.js'></script>

dust.addLoadMiddleware(...)
```

The module auto-registers if not loaded inside a commonjs module system.
