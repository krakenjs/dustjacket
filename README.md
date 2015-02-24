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

Loaders
-------

A loader can cause several effects in the process depending on what it calls back with.

* an error will trigger an error in the render
* a string will cause that string to be compiled as a dust template and cached
* a function will be called with the chunk and context as normal for a dust chunk handler, and no caching will be performed.
* an object with a `name` property will update the template name being loaded, and pass control on to the next handler
* calling back with no data at all will pass on to the next handler.

If control is passed past the last handler, the default dust `onLoad` behavior will be invoked, and a missing template error will be triggered if that fails.

Loader Arity
------------

Loaders with arity 2 will be called with `(name, callback)`; loaders with arity 3 will be called with `(name, context, callback)`.
