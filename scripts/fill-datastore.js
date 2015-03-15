'use strict';


var supportedLanguages = [
        'deDE',
        'enGB',
        'enUS',
        'esES',
        'esMX',
        'frFR',
        'itIT',
        'koKR',
        'plPL',
        'ptBR',
        'ptPT',
        'ruRU',
        'zhCN',
        'zhTW'
    ];

function fillDatastore(language, callback) {
    var Card = require('../models/cardSchema').createCollection(language + '-cards'),
        cardData = require('../json/' + language).cards;

    require('../lib/mongoose');

    cardData.forEach(function (item) {
        var card = new Card(item);

        card.save(function (error) {
            if (error) {
                console.log(error);
                process.exit(1);
            }
        });
    });

    callback();
}




supportedLanguages.forEach(function (language) {
    console.log('Processing %s', language);

    fillDatastore(language, function () {
        console.log('Done, you can probably hit ctrl-c by the time you have read this.');

        /*
         * This is not implemented correctly.  This will close the connection before
         * all the records are saved to the datastore.  TODO: fix this
         */
        // mongoose.connection.close();
    });
});
