#!/usr/bin/env node

'use strict';

// ===================
// Module dependencies
// ===================

/**
 * Internal
 */

const sprintf = require("sprintf-js").sprintf

// ===================
// Attributes
// ===================

const offset = 100;

// ==============
// Helpers
// ==============


const title = function(text) {
  console.log(text.cyan.bold);
}

const info = function(text) {
  text = "==> " + text
  console.log(text.cyan);
}

const warn = function(text) {
  text = "==> " + text
  console.log(text.yellow);
}

const error = function(text) {
  text = "==> " + text
  console.log(text.red);
}

const dottedInfo = function(text1, text2) {

  let t1L = text1.length;
  console.log(sprintf(`%s%'.${offset-t1L}s`, text1, text2.cyan));
}

const dottedError = function(text1, text2) {
  let t1L = text1.length;
  console.log(sprintf(`%s%'.${offset-t1L}s`, text1, text2.red));
}

const simpleInfo = function(text) {
  text = "    " + text
  console.log(text.cyan);
}

const simpleError = function(text) {
  text = "    " + text
  console.log(text.red);
}

// ==============
// Export
// ==============

module.exports = {
  title,
  info,
  warn,
  error,
  dottedInfo,
  dottedError,
  simpleInfo,
  simpleError
}
