dustjacket
=========

Loader middleware for dustjs

Use
---

```
var dust = require('dustjs-linkedin');
var dustjacket = require('dustjacket');
dustjacket.registerWith(dust);

dust.clearMiddleware(); // Clears default loader middleware that handles caching in dust.cache, and any other registered middleware

dust.addLoadMiddleware(function (name, context, cb) {
    // Handle loading as you see fit

    // cb(), pass to next middleware
    // cb(err), report an error to render
    // cb(null, data) return data (where data is a string) to renderer, which will be compiled, and stop the chain
    // cb(null, { name: newTemplateName }) updates the template name being loaded and continues the chain.
});
```

In the browser:

```
<script src='dustjs-linkedin.js'></script>
<script src='dustjacket/index.js'></script>

dust.addLoadMiddleware(...)
```

The module auto-registers if not loaded inside a commonjs module system.
