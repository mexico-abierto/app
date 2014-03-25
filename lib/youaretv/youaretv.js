/**
 * Module dependencies.
 */

var page      = require('page')
  , title     = require('title')
  , t         = require('t')
  , empty     = require('empty')
  , o         = require('query')
  , render    = require('render')
  , template  = require('./template');

page('/envivo', function(ctx, next) {
  title(t('Live feed'));
  empty(o('#content')).appendChild(render.dom(template));
});

