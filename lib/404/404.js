/**
<<<<<<< HEAD
* Module dependencies.
*/
=======
 * Module dependencies.
 */
>>>>>>> 0.7.5

var empty = require('empty');
var o = require('query');
var template = require('./template');
var render = require('render');
var page = require('page');
var classes = require('classes');

/**
<<<<<<< HEAD
* Append 404 middleware
*/

page('*', function () {
  var view = render.dom(template);
  empty(o('#content'))
    .appendChild(view);
  classes(o('body')).add('not-found');
=======
 * Append 404 middleware
 */

page('*', function (ctx, next) {
  classes(document.body).add("not-found-page");
  var view = render.dom(template);
  empty(o('#content')).appendChild(view);
>>>>>>> 0.7.5
});