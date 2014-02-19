/*
 * Module dependencies.
 */

var t = require('t');
var Emitter = require('emitter');
var domify = require('domify');
var empty = require('empty');
var events = require('events');
var classes = require('classes');
var serialize = require('serialize');
var regexps = require('regexps');
var form = require('./signup-form');

/**
 * Expose FormView.
 */

module.exports = FormView;

/**
 * Proposal Comments view
 *
 * @return {FormView} `FormView` instance.
 * @api public
 */

function FormView () {
  if (!(this instanceof FormView)) {
    return new FormView();
  };

  this.el = domify(form({ t: t }));

  this.events = events(this.el, this);
  this.events.bind('submit form');

}

/**
 * Mixin `Emitter` with `FormView`
 */

Emitter(FormView.prototype);

/**
 * Render proposal comments
 * 
 * @return {FormView} `FormView` instance.
 * @api public
 */

FormView.prototype.render = function() {
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

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

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
  return errors;
}

/**
 * Fill errors list
 *
 * @param {Array} errors
 * @api public
 */

FormView.prototype.errors = function(errors) {
  var ul = this.el.querySelector('ul.form-errors');

  if (!arguments.length) return empty(ul);

  errors.forEach(function(e) {
    var li = document.createElement('li');
    li.innerHTML = e;
    ul.appendChild(li);
  });
}

FormView.prototype.showSuccess = function() {
  var form = this.el.querySelector('#signup-form');
  var success = this.el.querySelector('#signup-message');

  var welcomeMessage = this.el.querySelector('#signup-message h1');
  var firstName = this.el.querySelector('#signup-form #firstName');
  var lastName = this.el.querySelector('#signup-form #lastName');
  var fullname = firstName.value + ' ' + lastName.value;

  welcomeMessage.innerHTML = t("Welcome, {name}!", { name: fullname || t("Guest")})

  classes(form).add('hide');
  classes(success).remove('hide');
}
