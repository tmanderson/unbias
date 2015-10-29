'use strict';

var _ = require('lodash');
var b = require('bluebird');
var fs = require('fs');

var os = require('os');
var url = require('url');
var path = require('path');
var cheerio = require('cheerio');
var request = require('request');

var READABILITY_API_KEY = process.env.READABILITY_API_KEY || (
  fs.existsSync(path.join(os.homedir(), '.ssh/api-keys.json')) &&
  fs.readFileSync(path.join(os.homedir(), '.ssh/api-keys.json'))
);

var dictionaries = require('./dictionaries');
var tokenizers = require('./tokenizers');
var parsers = require('./parsers');

_.extend(module.exports, {
  getContentFromUrl: function(articleUrl) {
    var URL = url.format({
      protocol: 'http',
      host: 'readability.com',
      pathname: '/api/content/v1/parser',
      query: {
        url: articleUrl,
        token: READABILITY_API_KEY
      }
    });
    
    request.get({ url: URL, json: true }, function(err, res, data) {
      var article = tokenizers.sentence(
        cheerio.load('<body>' + data.content + '</body>')('body').text()
      );

      parsers.quantities(article);
    });
  },

  getContentFromFile: function(path) {
    parsers.quantities(tokenizers.sentence(fs.readFileSync(path).toString()));
  },

  parseContent: function(content) {
    parsers.quantities(content);
  }
});

module.exports.getContentFromFile(process.argv.pop());