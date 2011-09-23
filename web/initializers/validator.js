var Validator = require('validator').Validator;
Validator.prototype.error = function (msg) {
  this._errors[this.field] = msg;
}

Validator.prototype.getErrors = function () {
  return this._errors;
}

Validator.prototype.check = function(field, str, fail_msg) {
  this.field = field;
  this.str = (str == null || (isNaN(str) && str.length == undefined)) ? '' : str;
  if (typeof this.str == 'number') { this.str += ''; }
  this.msg = fail_msg;
  if (this._errors == null) { this._errors = {}; }
  return this;
}