'use strict';

var jadePhp = require('jade2php');
var through = require('through2');
var ext = require('gulp-util').replaceExtension;
var PluginError = require('gulp-util').PluginError;
var merge = require('merge');

function handleExtension(filepath, opts){
  return ext(filepath, '');
}

module.exports = function(options){
  var defaultOptions = {
    omitPhpRuntime: true,
    omitPhpExtractor: true
  };
  var opts = merge(defaultOptions, options);

  function CompileJade(file, enc, cb){
    opts.filename = file.path;

    if (file.data) {
      opts.data = file.data;
    }

    file.path = handleExtension(file.path, opts);

    if(file.isStream()){
      return cb(new PluginError('gulp-jade', 'Streaming not supported'));
    }

    if(file.isBuffer()){
      try {
        file.contents = new Buffer(jadePhp(String(file.contents), opts));
      } catch(e) {
        return cb(new PluginError('gulp-jade', e));
      }
    }
    cb(null, file);
  }

  return through.obj(CompileJade);
};
