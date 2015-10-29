'use strict';

var _ = require('lodash');
var b = require('bluebird');
var WordPOS = require('wordpos');

_.extend(module.exports, {
  quantities: function(sentences) {
    var pos = new WordPOS();

    b.map(sentences, function(sentence) {
      var deferred = b.defer();

      pos.getPOS(sentence, function(parts) {
        deferred.resolve(parts);
      });

      return deferred.promise;
    })
    .then(function(data) {
      var output = {};

      _.each(data, function(parts) {
        _.each(parts, function(word, type) {
          if(!output[type]) output[type] = [];
          output[type].push.apply(output[type], word);
        });
      });

      console.log(output);
    });
  }
});
