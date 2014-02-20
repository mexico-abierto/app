/**
 * Module dependencies.
 */

var express = require('express')
  , mailer = require('lib/mailer')
  , path = require('path')
  , t = require('t-component')
  , signup = require('./lib/signup')
  , config = require('lib/config')
  , Recaptcha = require('recaptcha').Recaptcha
  ;

/**
 * Lazy register SignUp Application
 */

var app;

/**
 * Exports Application
 */

module.exports = app = express();


/**
 * Define routes for SignUp module
 */

app.post('/', function(req, res, next) {
  var meta = {
    ip: req.ip,
    ips: req.ips,
    host: req.get('host'),
    origin: req.get('origin'),
    referer: req.get('referer'),
    ua: req.get('user-agent')
  };

  var data = {
    remoteip: meta.ip,
    challenge: req.body.recaptcha_challenge_field,
    response: req.body.recaptcha_response_field
  };
  var recaptcha = new Recaptcha(config["recaptchaPublicKey"], config["recaptchaPrivateKey"], data);

  // Verify reCAPTCHA before signing up
  recaptcha.verify(function(success, error_code) {
    if (success) {
      signup.doSignUp(req.body, meta, function (err, citizen) {
        if (err) return res.json(200, { error: t(err.message) });
        // Login with new account
        req.login(citizen, function(err) {
          if (err) return res.json(200, { error: t(err.message) });
          return res.json(200);
        });
      })
    } else {
      return res.json(200, { error: t("Type the words shown in the image") });
    }
  });

});

app.post('/validate', function(req, res, next) {
  signup.emailValidate(req.body, function (err, citizen) {
    if (err) {
      return res.json(200, { error: t(err.message) });
    };
    req.login(citizen, function(err) {
      if (err) return res.json(200, { error: t(err.message) });
      return res.json(200);
    });
  })
});

app.post('/resend-validation-email', function(req, res, next) {
  var meta = {
    ip: req.ip,
    ips: req.ips,
    host: req.get('host'),
    origin: req.get('origin'),
    referer: req.get('referer'),
    ua: req.get('user-agent')
  };

  signup.resendValidationEmail(req.body, meta, function (err, citizen) {
    if (err) {
      return res.json(200, { error: t(err.message) });
    };
    return res.json(200);
  })
});

app.get('/gimmeRecaptcha', function(req, res, next) {
  var r = new Recaptcha(config.recaptchaPublicKey, config.recaptchaPrivateKey);
  res.send(r.toHTML());
});

