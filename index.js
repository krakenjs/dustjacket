(function () {
    "use strict";

    function registerWith(dust) {
        if (dust.addLoadMiddleware) return;

        var middlewares = [
            defaultCacheLoader
        ];

        dust.addLoadMiddleware = addLoadMiddleware;
        dust.clearMiddleware = clearMiddleware;

        function addLoadMiddleware(middleware) {
            middlewares.push(middleware);
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

        function callLegacyOnLoad(context, chunk) {
            var args = [context.templateName];
            if (dust.onLoad.length == 3) {
                args.push(context);
            }
            args.push(function(err, src) {
                if (err) {
                    return chunk.setError(err);
                }
                dust.loadSource(dust.compile(src, context.templateName))(chunk, context).end();
            });
            dust.onLoad.apply(dust, args);
        }

        dust.load = load;

        function load(name, chunk, context) {
            var toRun = middlewares.slice();

            return chunk.map(function runChain(chunk) {
                var handler = toRun.shift();
                if (!handler) {
                    if (dust.onLoad) {
                        return callLegacyOnLoad(context, chunk);
                    } else {
                        return chunk.setError(new Error('Template Not Found: ' + name));
                    }
                }

                var args = [name, function (err, data) {
                    if (err) {
                        return chunk.setError(err);
                    } else if (data != null) {
                        if (typeof data == 'function') {
                            data(chunk, context).end();
                        } else if (typeof data == 'object') {
                            if (data.name) name = data.name;
                            if (data.context) context = context.push(data.context);
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

    if (typeof module == 'undefined' && typeof dust != 'undefined') {
        /*global dust*/
        registerWith(dust);
    } else {
        module.exports.registerWith = registerWith;
    }
})();
