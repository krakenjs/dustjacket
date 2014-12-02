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

        function load(name, cb) {
            var toRun = middlewares.slice();
            if (originalLoader) toRun.push(originalLoader);

            function runChain() {
                var handler = toRun.shift();
                if (!handler) {
                    return cb(new Error("No template found named '" + name + "'"));
                }

                handler.call(dust, name, function (err, data) {
                    if (err) {
                        return cb(err);
                    } else if (data) {
                        return cb(null, data);
                    } else {
                        runChain();
                    }
                });
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
