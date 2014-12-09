'use strict';

var card = require('../models/cardSchema');

require('./mongoose');


card.find({CardID: /^GVG/}, function (error, cards) {
    if (error) {
        console.error('Error: ', error);
    }

    cards.forEach(function (card) {
        console.log(card.CardID, card.Tag.CardName);
    });
});
