'use strict';

var util = require('util'),
    restify = require('restify'),
    server = restify.createServer({name: 'Hearthstone API'}),
    cards = require('./models/cardSchema');

require('./lib/mongoose');




if (!process.env.PORT) {
    console.error('Environment not set.  PORT is not defined!');
    process.exit(1);
}




function getAllCards(request, response, next) {
    cards.find({}, function (error, cards) {
        if (error) {
            console.error(error);
            response.send(error);
        }

        response.send(cards);
    });
}




function getCardsById(request, response, next) {
    cards.find({CardID: request.params.id}, function (error, cards) {
        if (error) {
            console.error(error);
            response.send(error);
        }

        response.send(cards);
    });
}




function getCardsByName(request, response, next) {
    cards.find({'Tag.CardName': decodeURI(request.params.name)}, function (error, cards) {
        if (error) {
            console.error(error);
            response.send(error);
        }

        response.send(cards);
    });
}




function getCardsByClass(request, response, next) {
    cards.find({'Tag.Class': request.params['class']}, function (error, cards) {
        if (error) {
            console.error(error);
            response.send(error);
        }

        response.send(cards);
    });
}




function getClasses(request, response, next) {
    cards.find().distinct('Tag.Class', function (error, classes) {
        if (error) {
            console.error(error);
            response.send(error);
        }

        response.send(classes);
    });
}




server.get('/rest/api/latest/cards', getAllCards);
server.get('/rest/api/latest/classes', getClasses);
server.get('/rest/api/latest/cards/class/:class', getCardsByClass);

server.get('/rest/api/latest/card/id/:id', getCardsById);
server.get('/rest/api/latest/card/name/:name', getCardsByName);





server.listen(process.env.PORT, function () {
    console.log('%s listening at %s', server.name, server.url);
});
