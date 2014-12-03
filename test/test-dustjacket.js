var test = require('tape');
var freshy = require('freshy').freshy;
var dustjacket = require('../');

test('registration', function (t) {
    var dust = freshy('dustjs-linkedin');
    var load = dust.onLoad;
    dustjacket.registerWith(dust);

    t.notEqual(load, dust.onLoad, 'loader was replaced');
    t.ok(dust.addLoadMiddleware, 'addLoadMiddleware method was added');

    t.end();
});

test('middleware can pass', function (t) {
    var dust = freshy('dustjs-linkedin');

    dustjacket.registerWith(dust);

    t.plan(3);

    dust.addLoadMiddleware(function (name, cb) {
        t.pass('called');
        cb();
    });

    dust.render('test', {}, function (err, out) {
        t.equal(err.message, "No template found named 'test'");
        t.notOk(out);
        t.end();
    });
});

test('middleware can error', function (t) {
    var dust = freshy('dustjs-linkedin');

    dustjacket.registerWith(dust);

    t.plan(3);

    dust.addLoadMiddleware(function (name, cb) {
        t.pass('called');
        cb('error');
    });

    dust.render('test', {}, function (err, out) {
        t.equal(err, 'error');
        t.notOk(out);
        t.end();
    });
});

test('middleware can return data', function (t) {
    var dust = freshy('dustjs-linkedin');

    dustjacket.registerWith(dust);

    t.plan(3);

    dust.addLoadMiddleware(function (name, cb) {
        t.pass('called');
        cb(null, 'data');
    });

    dust.render('test', {}, function (err, out) {
        t.error(err);
        t.equal(out, 'data');
        t.end();
    });
});

test('middleware are called with correct context', function (t) {
    var dust = freshy('dustjs-linkedin');

    dustjacket.registerWith(dust);

    t.plan(1);

    dust.addLoadMiddleware(function (name, cb) {
        t.equal(this, dust);
        cb();
    });

    dust.render('test', {}, function (err, out) {
        t.end();
    });
});

test('middleware with three parameters get a context argument', function (t) {
    var dust = freshy('dustjs-linkedin');

    dustjacket.registerWith(dust);

    t.plan(2);

    dust.addLoadMiddleware(function (name, context, cb) {
        t.ok(context);
        t.ok(name);
        cb();
    });

    dust.render('test', {}, function (err, out) {
        t.end();
    });
});

test('registering twice should noop', function (t) {
    var dust = freshy('dustjs-linkedin');

    dustjacket.registerWith(dust);
    
    var first = dust.addLoadMiddleware;

    dustjacket.registerWith(dust);

    t.ok(first == dust.addLoadMiddleware);

    t.end();

});
