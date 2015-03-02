"use strict";

var test = require('tape');
var freshy = require('freshy').freshy;
var dustjacket = require('../');

test('registration', function (t) {
    var dust = freshy('dustjs-linkedin');
    var load = dust.load;
    dustjacket.registerWith(dust);

    t.notEqual(load, dust.load, 'loader was replaced');
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
        t.equal(err.message, "Template Not Found: test");
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

    t.plan(3);

    dust.addLoadMiddleware(function (name, cb) {
        t.equal(this, dust);
        cb(null, '');
    });

    dust.render('test', {}, function (err, out) {
        t.error(err);
        t.equal(out, '');
        t.end();
    });
});

test('middleware with three parameters get a context argument', function (t) {
    var dust = freshy('dustjs-linkedin');

    dustjacket.registerWith(dust);

    t.plan(4);

    dust.addLoadMiddleware(function (name, context, cb) {
        t.ok(context);
        t.ok(name);
        cb(null, '');
    });

    dust.render('test', {}, function (err, out) {
        t.error(err);
        t.equal(out, '');
        t.end();
    });
});

test('middleware can change loaded template name', function (t) {
    var dust = freshy('dustjs-linkedin');

    dustjacket.registerWith(dust);

    t.plan(3);

    dust.addLoadMiddleware(function (name, context, cb) {
        cb(null, {name: 'test-changed'});
    });

    dust.addLoadMiddleware(function (name, context, cb) {
        t.equal(name, 'test-changed');
        cb(null, '');
    });

    dust.render('test', {}, function (err, out) {
        t.error(err);
        t.equal(out, '');
        t.end();
    });
});

test('middleware can be cleared', function (t) {
    var dust = freshy('dustjs-linkedin');

    dustjacket.registerWith(dust);

    t.plan(3);

    var called = false;
    dust.addLoadMiddleware(function (name, context, cb) {
        called = true;
        cb();
    });

    dust.clearMiddleware();

    dust.render('test', {}, function (err, out) {
        t.ok(err);
        t.ok(!called, "middleware was not called");
        t.notOk(out);
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

test('default middleware caches', function (t) {
    var dust = freshy('dustjs-linkedin');

    dustjacket.registerWith(dust);

    t.plan(6);

    var called = 0;

    dust.addLoadMiddleware(function (name, context, cb) {
        called += 1;
        cb(null, "Hi");
    });

    dust.render('test', {}, function (err, out) {
        t.error(err);
        t.equal(called, 1, "Called once already");
        t.equal(out, 'Hi');
        dust.render('test', {}, function (err, out) {
            t.error(err);
            t.equal(called, 1, "Called just once");
            t.equal(out, 'Hi');
            t.end();
        });
    });
});

test('legacy onLoad is called', function (t) {
    var dust = freshy('dustjs-linkedin');

    dustjacket.registerWith(dust);

    t.plan(3);

    dust.onLoad = function (name, context, cb) {
        t.ok(context, 'context is provided');
        t.ok(name, 'template name is provided');
        t.equal(context.templateName, name, 'template name is the same as the context one');

        cb(null, "");
    };

    dust.render('test', {}, function (err, out) {
        t.end();
    });
});

test('a loader should be able to change the name for future loaders', function (t) {
    var dust = freshy('dustjs-linkedin');

    dustjacket.registerWith(dust);

    t.plan(2);

    dust.addLoadMiddleware(function (name, context, cb) {
        cb(null, {name: 'new', context: { 'new': 'context' }});
    });

    dust.addLoadMiddleware(function (name, context, cb) {
        t.equal(name, 'new');
        t.equal(context.get('new'), 'context');
        cb(null, 'done');
    });

    dust.render('test', {}, function (err, out) {
        t.end();
    });

});
