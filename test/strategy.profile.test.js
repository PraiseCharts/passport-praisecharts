var PraiseChartsStrategy = require('../lib/strategy')
  , fs = require('fs');


describe('Strategy#userProfile', function() {
  
  describe('fetched from default endpoint', function() {
    var strategy = new PraiseChartsStrategy({
      consumerKey: 'api_test2',
      consumerSecret: 'secret'
    }, function verify(){});
    
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      if (url != 'https://www.praisecharts.com/api/v1.0/me') { return callback(new Error('incorrect url argument')); }
      if (token != 'token') { return callback(new Error('incorrect token argument')); }
      if (tokenSecret != 'token-secret') { return callback(new Error('incorrect tokenSecret argument')); }
    
      var body = fs.readFileSync('test/fixtures/account/theSeanCook.json', 'utf8');
      var response = {headers:{'x-access-level': 'read'}};
      callback(null, body, response);
    }
    
    
    var profile;
  
    before(function(done) {
      strategy.userProfile('token', 'token-secret', { id: '1063047' }, function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
  
    it('should parse profile', function() {
      expect(profile.provider).to.equal('praisecharts');
      expect(profile.id).to.equal('1063047');
    });
  
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
  
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  
    it('should set accessLevel property', function() {
      expect(profile._accessLevel).to.equal('read');
    });
    
  }); // fetched from default endpoint
  
  
  describe('skipping extended profile', function() {
    var strategy = new PraiseChartsStrategy({
      consumerKey: 'api_test2',
      consumerSecret: 'secret',
      skipExtendedUserProfile: true
    }, function verify(){});
    
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      return callback(new Error('should not fetch profile'));
    }
    
    
    var profile;
  
    before(function(done) {
      strategy.userProfile('token', 'token-secret', {"id":"1063047"}, function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
  
    it('should parse profile', function() {
      expect(profile.provider).to.equal('praisecharts');
      expect(profile.id).to.equal('1063047');
    });
  
    it('should not set raw property', function() {
      expect(profile._raw).to.be.undefined;
    });
  
    it('should not set json property', function() {
      expect(profile._json).to.be.undefined;
    });
  }); // skipping extended profile
  
  describe('error caused by invalid token', function() {
    var strategy = new PraiseChartsStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret',
      userProfileURL: 'https://api.twitter.com/1.1/users/show.json'
    }, function verify(){});
    
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      var body = '{"errors":[{"message":"Invalid or expired token","code":89}]}';
      callback({ statusCode: 401, data: body });
    }
    
    
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('x-token', 'token-secret', { user_id: '123' }, function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('APIError');
      expect(err.message).to.equal('Invalid or expired token');
      expect(err.code).to.equal(89);
      expect(err.status).to.equal(500);
    });
    
    it('should not supply profile', function() {
      expect(profile).to.be.undefined;
    });
  }); // error caused by invalid token
  
  describe('error caused by malformed response', function() {
    var strategy = new PraiseChartsStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret',
      userProfileURL: 'https://api.twitter.com/1.1/users/show.json'
    }, function verify(){});
    
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      var body = 'Hello, world.';
      callback(null, body, undefined);
    }
    
    
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('token', 'token-secret', { user_id: '123' }, function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Failed to parse user profile');
    });
    
    it('should not supply profile', function() {
      expect(profile).to.be.undefined;
    });
  }); // error caused by malformed response
  
  describe('internal error', function() {
    var strategy = new PraiseChartsStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret',
      userProfileURL: 'https://api.twitter.com/1.1/users/show.json'
    }, function verify(){});
    
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      return callback(new Error('something went wrong'));
    }
    
    
    var err, profile;
    before(function(done) {
      strategy.userProfile('token', 'token-secret', { user_id: '123' }, function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
      expect(err.oauthError).to.be.an.instanceOf(Error);
      expect(err.oauthError.message).to.equal('something went wrong');
    });
  
    it('should not supply profile', function() {
      expect(profile).to.be.undefined;
    });
  }); // internal error
  
});
