/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @api public
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {};
  profile.id = String(json.id);
  profile.name = json.name;
  if (json.email) {
    profile.emails = [{ value: json.email }];
  }
  
  return profile;
};
