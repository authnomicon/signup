/**
 * Create signup registration handler.
 *
 * Returns an HTTP handler that creates a new account with the user-supplied
 * information and credentials.  The information is submitted via an HTML form
 * which was rendered by the `prompt` handler.
 *
 * @param {@authnomicon/credentials.PasswordStore} passwords - Storage mechanism
 *          used to access and persist password credentials.
 * @param {passport.Authenticator} authenticator - Request authenticator.
 * @param {flowstate.Store} store - Per-request state store.
 * @returns {express.RequestHandler[]}
 */
exports = module.exports = function(passwords, authenticator, store) {
  
  // TODO: Add password confirmation here
  
  function register(req, res, next) {
    var user = {
      username: req.body.username
    };
    if (req.body.name) { user.displayName = req.body.name; }
    if (req.body.family_name) { (user.name = user.name || {}).familyName = req.body.family_name; }
    if (req.body.given_name) { (user.name = user.name || {}).givenName = req.body.given_name; }
    
    passwords.create(user, req.body.password, function(err, user) {
      if (err) { return next(err); }
      req.login(user, function(err) {
        if (err) { return next(err); }
        return res.resumeState(next);
      });
    });
  }
  
  function redirect(req, res, next) {
    res.redirect('/');
  }
  
  
  return [
    require('body-parser').urlencoded({ extended: false }),
    require('csurf')({ value: function(req){ return req.body && req.body.csrf_token; } }),
    require('flowstate')({ store: store }),
    authenticator.initialize(),
    register,
    redirect
  ];
};

exports['@require'] = [
  'module:@authnomicon/credentials.PasswordStore',
  'module:passport.Authenticator',
  'module:flowstate.Store'
];
