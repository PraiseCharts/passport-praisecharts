var Profile = require('../lib/profile')
  , fs = require('fs');


describe('Profile.parse', function() {
  
  describe('profile obtained from GET account/verify_credentials documentation on 2016/01/28', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/fixtures/account/theSeanCook.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.id).to.equal('1063047');
    });
  });
  
  describe('profile obtained from GET account/verify_credentials documentation on 2016/01/28, with email attribute', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/fixtures/account/theSeanCook-include_email.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.id).to.equal('1063047');
    });
  });
  
  
});
