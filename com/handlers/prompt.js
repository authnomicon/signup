// Module dependencies.
var path = require('path')
  , ejs = require('ejs');

/**
 * Create signup prompt handler.
 *
 * Returns an HTTP handler that prompts the user to sign up by creating an
 * account.  The prompt is rendered via HTML and the response will be submitted
 * to the `register` handler via an HTML form.
 *
 * @param {flowstate.Store} store - Per-request state store.
 * @returns {express.RequestHandler[]}
 */
exports = module.exports = function(store) {

  function prompt(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    
    res.render('signup', function(err, str) {
      if (err && err.view) {
        var view = path.resolve(__dirname, '../views/prompt.ejs');
        ejs.renderFile(view, res.locals, function(err, str) {
          if (err) { return next(err); }
          res.send(str);
        });
        return;
      } else if (err) {
        return next(err);
      }
      res.send(str);
    });
  };
  
  
  return [
    require('csurf')(),
    require('flowstate')({ store: store }),
    prompt
  ];
};

// Module annotations.
exports['@require'] = [
  'module:flowstate.Store'
];
