(function () {
    "use strict";

    function registerWith(dust) {
        if (dust.addLoadMiddleware) return;

        var middlewares = [
            defaultCacheLoader
        ];

        dust.addLoadMiddleware = addLoadMiddleware;
        dust.addLoadMiddlewareFirst = addLoadMiddlewareFirst;
        dust.clearMiddleware = clearMiddleware;

        function addLoadMiddleware(middleware) {
            middlewares.push(middleware);
        }

        function addLoadMiddlewareFirst(middleware) {
            middlewares.unshift(middleware);
        }

        function clearMiddleware() {
            middlewares = [];
        }

        function defaultCacheLoader(name, context, cb) {
            if (dust.cache[name]) {
                cb(null, dust.cache[name]);
            } else {
                cb();
            }
        }

        function callLegacyOnLoad(context) {
            return function (chunk) {
                var args = [context.templateName];
                if (dust.onLoad.length == 3) {
                    args.push(context);
                }
                args.push(function(err, src) {
                    if (err) {
                        return chunk.setError(err);
                    }
                    dust.cache[context.templateName](chunk, context).end();
                });
                dust.onLoad.apply(dust, args);
            };
        }

        dust.load = load;

        function load(name, chunk, context) {
            var toRun = middlewares.slice();

            return chunk.map(function runChain(chunk) {
                var handler = toRun.shift();
                if (!handler) {
                    if (dust.onLoad) {
                        return chunk.map(callLegacyOnLoad(context));
                    } else {
                        return chunk.setError(new Error('Template Not Found: ' + name));
                    }
                }

                var args = [name, function (err, data) {
                    if (err) {
                        return chunk.setError(err);
                    } else if (data) {
                        if (typeof data == 'function') {
                            data(chunk, context).end();
                        } else if (typeof data == 'object') {
                            if (data.name) name = data.name;
                            runChain(chunk);
                        } else {
                            dust.loadSource(dust.compile(data, name))(chunk, context).end();
                        }
                    } else {
                        runChain(chunk);
                    }
                }];

                if (handler.length == 3) {
                    args.splice(1, 0, context);
                }

                handler.apply(dust, args);
            });
        }
    }

    if (typeof module == 'undefined') {
        registerWith(dust);
    } else {
        module.exports.registerWith = registerWith;
    }
})();
