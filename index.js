(function () {
    "use strict";

    function registerWith(dust) {
        if (dust.addLoadMiddleware) return;

        var originalLoader = dust.onLoad;
        var middlewares = [];

        dust.addLoadMiddleware = addLoadMiddleware;

        function addLoadMiddleware(middleware) {
            middlewares.push(middleware);
        }

        dust.onLoad = load;

        function load(name, context, cb) {
            if (typeof context == 'function' && !cb) {
                cb = context;
                context = null;
            }

            var toRun = middlewares.slice();
            if (originalLoader) toRun.push(originalLoader);

            function runChain() {
                var handler = toRun.shift();
                if (!handler) {
                    return cb(new Error("No template found named '" + name + "'"));
                }

                var args = [name, function (err, data) {
                    if (err) {
                        return cb(err);
                    } else if (data) {
                        return cb(null, data);
                    } else {
                        runChain();
                    }
                }];

                if (handler.length == 3) {
                    args = args.splice(1, 0, context || {});
                }

                handler.apply(dust, args);
            }

            runChain();
        }
    }

    if (typeof module == 'undefined') {
        registerWith(dust);
    } else {
        module.exports.registerWith = registerWith;
    }
})();
