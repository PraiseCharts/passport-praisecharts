# passport-praisecharts (WIP)

[Passport](http://passportjs.org/) strategy for authenticating with [PraiseCharts](http://praisecharts.com/)
using the OAuth 1.0a API.

This module lets you authenticate using PraiseCharts in your Node.js applications.
By plugging into Passport, PraiseCharts authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).


[![npm](https://img.shields.io/npm/v/passport-praisecharts.svg)](https://www.npmjs.com/package/passport-praisecharts)
![build](https://github.com/PraiseCharts/passport-praisecharts/actions/workflows/node.yml/badge.svg)
[...](https://github.com/jaredhanson/passport-praisecharts/wiki/Status)

## Install

```bash
$ npm install passport-praisecharts
```

## Usage

#### Create an Application

Before using `passport-praisecharts`, you must register an application with PraiseCharts.
If you have not already done so, a new application can be created at
[PraiseCharts Application Management](https://apps.praisecharts.com/).  Your application
will be issued a consumer key (API Key) and consumer secret (API Secret), which
need to be provided to the strategy.  You will also need to configure a callback
URL which matches the route in your application.

#### Configure Strategy

The PraiseCharts authentication strategy authenticates users using a PraiseCharts account
and OAuth tokens.  The consumer key and consumer secret obtained when creating
an application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and
corresponding secret as arguments, as well as `profile` which contains the
authenticated user's PraiseCharts profile.   The `verify` callback must call `cb`
providing a user to complete authentication.

```javascript
passport.use(new PraiseChartsStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/praisecharts/callback"
  },
  function(token, tokenSecret, profile, cb) {
    User.findOrCreate({ praisechartsId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'praisecharts'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/praisecharts',
  passport.authenticate('praisecharts'));

app.get('/auth/praisecharts/callback', 
  passport.authenticate('praisecharts', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-praisecharts-example)
as a starting point for their own web applications.

## License

[The MIT License](http://opensource.org/licenses/MIT)
