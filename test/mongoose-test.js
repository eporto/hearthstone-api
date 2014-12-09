'use strict';

var card = require('../models/cardSchema');

require('../lib/mongoose');


// card.find({CardID: /^GVG/}, function (error, cards) {
//     if (error) {
//         console.error('Error: ', error);
//     }
//
//     cards.forEach(function (card) {
//         console.log(card.CardID, card.Tag.CardName);
//     });
// });
//

card.find({'Tag.Atk': 3}, function (error, cards) {
    if (error) {
        console.error('Error: ', error);
    }

    console.log(cards);
});
