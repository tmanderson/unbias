'use strict';

var _ = require('lodash');
var natural = require('natural');
var dictionaries = require('./dictionaries');
var wordTokenizer = new natural.TreebankWordTokenizer();

_.extend(module.exports, {
  sentence: function(line) {
    line = line.replace(/([.!?])([A-Z])/g, '$1 $2').replace(/[\t\n\r]/g, '');
    var lastSentenceEnd = 0;
    var sentences = [];

    _.each(wordTokenizer.tokenize(line), function(word, i, words) {
      // If there's punctuation in the word, and it's not capital (far from perfect)
      if(/[.!?]/ig.test(word) && !/[A-Z]/.test(word) && 
        dictionaries.abbreviations.indexOf(word.toLowerCase()) < 0) {

        sentences.push(words.slice(lastSentenceEnd, i + 1).join(' ').replace(/\s([.,'?`"])/g, '$1'));
        lastSentenceEnd = i + 1;
      }
    });
    
    return sentences;
  }
});