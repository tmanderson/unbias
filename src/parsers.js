'use strict';

var _ = require('lodash');
var pos = require('pos');

_.extend(module.exports, {
  quantities: function(sentences) {
    var lexer = new pos.Lexer();
    var tagger = new pos.Tagger();

    var tagged = _.groupBy(
      _.flatten(
        _.map(sentences, function(sentence) {
          sentence = sentence.replace(/(\d+),(\d+)/g, '$1$2').replace(/[.'",`()]/g, '');
          return _.map(
            tagger.tag(lexer.lex(sentence)),
            function(tag, i, tags) {
              return {
                word: tag[0],
                tag: tag[1],
                tri: [ _.get(tags, i-1 + '.[0]'), tag[0], _.get(tags, i+1 + '.[0]') ].join(' '),
                context: sentence
              };
            }
          );
        })
      ),
      'tag'
    );

    console.log(tagged.CD);
  }
});

/*
CC Coord Conjuncn           and,but,or
CD Cardinal number          one,two
DT Determiner               the,some
EX Existential there        there
FW Foreign Word             mon dieu
IN Preposition              of,in,by
JJ Adjective                big
JJR Adj., comparative       bigger
JJS Adj., superlative       biggest
LS List item marker         1,One
MD Modal                    can,should
NN Noun, sing. or mass      dog
NNP Proper noun, sing.      Edinburgh
NNPS Proper noun, plural    Smiths
NNS Noun, plural            dogs
POS Possessive ending       Õs
PDT Predeterminer           all, both
PP$ Possessive pronoun      my,oneÕs
PRP Personal pronoun         I,you,she
RB Adverb                   quickly
RBR Adverb, comparative     faster
RBS Adverb, superlative     fastest
RP Particle                 up,off
SYM Symbol                  +,%,&
TO ÒtoÓ                     to
UH Interjection             oh, oops
URL url                     http://www.google.com/
VB verb, base form          eat
VBD verb, past tense        ate
VBG verb, gerund            eating
VBN verb, past part         eaten
VBP Verb, present           eat
VBZ Verb, present           eats
WDT Wh-determiner           which,that
WP Wh pronoun               who,what
WP$ Possessive-Wh           whose
WRB Wh-adverb               how,where
, Comma                     ,
. Sent-final punct          . ! ?
: Mid-sent punct.           : ; Ñ
$ Dollar sign               $
# Pound sign                #
" quote                     "
( Left paren                (
) Right paren               )
 */