/*
 * Module dependencies.
 */

var t = require('t');
var o = require('query');
var Emitter = require('emitter');
var domify = require('domify');
var empty = require('empty');
var events = require('events');
var classes = require('classes');
var serialize = require('serialize');
var regexps = require('regexps');
var form = require('./signup-form');
var render = require('render');
var config = require('config');
var inserted = require('inserted');

var captchaOptions = {
  theme: "custom",
  custom_theme_widget: 'recaptcha_widget',
  lang: 'es',
  tabindex: 4
};

var FormView = require('form-view');
var template = require('./signup-form');
var title = require('title');

/**
 * Expose SignupForm.
 */

module.exports = SignupForm;

/**
 * Proposal Comments view
 *
 * @return {SignupForm} `SignupForm` instance.
 * @api public
 */

function SignupForm (reference) {
  if (!(this instanceof SignupForm)) {
    return new SignupForm(reference);
  };

  this.el = render.dom(form);

  this.events = events(this.el, this);
  this.events.bind('submit form');

  inserted(this.el, function() {
    Recaptcha
    .create(
      config['recaptchaPublicKey'],
      'captcha-container',
      captchaOptions
    );
  });
}

/**
 * Inherit from `FormView`
 */

Emitter(FormView.prototype);

/**
 * Render proposal comments
 * 
 * @return {View} `View` instance.
 * @api public
 */

FormView.prototype.render = function(el) {
  if (1 === arguments.length) {
    // if string, then query element
    if ('string' === typeof el) {
      el = document.querySelector(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    // !!!: Should we return different things
    // on different conditions?
    // Or should we be consistent with
    // render returning always `this.el`
    return this;
  };

  return this.el;
}
/**
 * Handle `onsubmit` form event
 *
 * @param {Event} ev
 * @api private
 */

FormView.prototype.onsubmit = function(ev) {
  ev.preventDefault();
  
  // Clean errors list
  this.errors();

  // Serialize form
  var form = this.el.querySelector('form');
  var data = serialize.object(form);
  
  // Check for errors in data
  var errors = this.validate(data);

  // If errors, show and exit
  if (errors.length) {
    this.errors(errors);
    return;
  };

  // Deliver form submit
  this.emit('submit', data);
}

SignupForm.prototype.switchOn = function() {
  this.on('success', this.bound('showSuccess'));
};

FormView.prototype.validate = function(data) {
  var errors = [];
  if (!data.password.length) {
    errors.push(t('Password is not good enough'));
  };
  if (!regexps.email.test(data.email)) {
    errors.push(t('Email is not valid'));
  };
  if (!data.firstName.length) {
    errors.push(t('A firstname is required'));
  };
  if (!data.recaptcha_response_field.length) {
    errors.push(t('Type the words shown in the image'));
  };
  return errors;
}

/**
 * Show success message
 */

SignupForm.prototype.showSuccess = function() {
  var form = this.find('#signup-form');
  var success = this.find('#signup-message');

  var welcomeMessage = this.find('#signup-message h1');
  var firstName = this.get('firstName');
  var lastName = this.get('lastName');
  var fullname = firstName + ' ' + lastName;

  title(t('Signup complete'));
  var message = t("Welcome, {name}!", { name: fullname });
  welcomeMessage.html(message);

  form.addClass('hide');
  success.removeClass('hide');
}

