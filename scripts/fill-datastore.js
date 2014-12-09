'use strict';


function fillDatastore(callback) {
    var Card = require('../models/cardSchema'),
        cardData = require('../json/enUS').cards;

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




fillDatastore(function () {
    console.log('Done, you can probably hit ctrl-c by the time you have read this.');

    /*
     * This is not implemented correctly.  This will close the connection before
     * all the records are saved to the datastore.  TODO: fix this
     */
    // mongoose.connection.close();
});
